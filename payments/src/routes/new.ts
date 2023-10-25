import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  requireAuth,
  validateRequest,
  NotFoundError,
  NotAuthorizedError,
  BadRequestError,
  OrderStatus,
} from "@bookmyseat/common";
import { Order } from "../models/order";
import { stripe } from "../stripe-config";
import { Payment } from "../models/payment";
import { PaymentCreatedPublisher } from "../events/publishers/payment-created-publisher";
import { natsClient } from "../nats-client";

const router = express.Router();

router.post(
  "/api/payments",
  requireAuth,
  [
    body("token")
      .not()
      .isEmpty()
      .withMessage("A valid payment token is required."),
    body("orderId").not().isEmpty().withMessage("A valid orderId is required."),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      throw new NotFoundError();
    }
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }
    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError("Cannot create a payment for cancelled order.");
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: order.price * 100,
      currency: "inr",
      automatic_payment_methods: { enabled: true },
    });

    const paymentRecord = Payment.build({
      orderId: order.id,
      stripeId: paymentIntent.id,
    });

    await paymentRecord.save();

    // Publish Event Indicating the payment success
    await new PaymentCreatedPublisher(natsClient.client).publish({
      id: paymentRecord.id,
      version: paymentRecord.version,
      orderId: paymentRecord.orderId,
      stripeId: paymentRecord.stripeId,
    });

    res
      .status(201)
      .send({ chargeCreation: "Success", paymentId: paymentRecord.id });
  }
);

export { router as createChargeRouter };
