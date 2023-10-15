import express, { Request, Response } from "express";
import mongoose from "mongoose";
import { body } from "express-validator";

import { requireAuth, validateRequest } from "@bookmyseat/common";

const router = express.Router();

router.get(
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
    res.status(200).send({ status: "indexOrderRouter" });
  }
);

export { router as indexOrderRouter };
