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

    await stripe.charges.create({
      currency: "usd",
      amount: order.price * 100,
      source: token,
    });
    res.status(201).send({ chargeCreation: "Success" });
  }
);

export { router as createChargeRouter };
