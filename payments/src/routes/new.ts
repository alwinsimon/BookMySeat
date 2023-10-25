import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  requireAuth,
  validateRequest,
  NotFoundError,
  BadRequestError,
} from "@bookmyseat/common";

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
    res.status(201).send({ chargeCreation: "Success" });
  }
);

export { router as createChargeRouter };
