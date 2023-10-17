import express, { Request, Response } from "express";
import { param } from "express-validator";
import mongoose from "mongoose";
import {
  requireAuth,
  validateRequest,
  NotFoundError,
  NotAuthorizedError,
} from "@bookmyseat/common";

import { Order, OrderStatus } from "../models/order";

const router = express.Router();

router.delete(
  "/api/orders/:orderId",
  requireAuth,
  [
    param("orderId")
      .not()
      .isEmpty()
      // Custom validation to check if the provided ticketId is a valid mongoDb document Id
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage("Valid Order Id must be provided in request params."),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    // Try to fetch the requested order
    const order = await Order.findById(req.params.orderId).populate("ticket");

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    order.status = OrderStatus.Cancelled;
    await order.save();

    res.status(204).send(order);
  }
);

export { router as deleteOrderRouter };
