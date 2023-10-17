import express, { Request, Response } from "express";
import mongoose from "mongoose";
import { param } from "express-validator";
import { Order } from "../models/order";
import {
  requireAuth,
  validateRequest,
  NotFoundError,
  NotAuthorizedError,
} from "@bookmyseat/common";

const router = express.Router();

router.get(
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

    if(order.userId !== req.currentUser!.id){
      throw new NotAuthorizedError
    }
    
    res.status(200).send(order);
  }
);

export { router as showOrderRouter };
