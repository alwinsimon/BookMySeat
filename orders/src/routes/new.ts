import express, { Request, Response } from "express";
import mongoose from "mongoose";
import { body } from "express-validator";

import { requireAuth, validateRequest } from "@bookmyseat/common";

import { Order } from "../models/order";
import { Ticket } from "../models/ticket";

const router = express.Router();

router.post(
  "/api/orders",
  requireAuth,
  [
    body("ticketId")
      .not()
      .isEmpty()
      // Custom validation to check if the provided ticketId is a valid mongoDb document Id
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage("Valid Ticket Id must be provided."),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    res.status(201).send({ status: "createOrderRouter" });
  }
);

export { router as createOrderRouter };
