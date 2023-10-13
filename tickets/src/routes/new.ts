import express, { Request, Response } from "express";
import { body } from "express-validator";
import { requireAuth, validateRequest } from "@bookmyseat/common";

import { Ticket } from "../models/ticket";

const router = express.Router();

router.post(
  "/api/tickets",
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("Valid Title is Required."),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Valid Price which is greater than 0 is Required"),
  ],
  validateRequest,
  (req: Request, res: Response) => {
    const { title, price } = req.body;

    const ticket = Ticket.build({
      title,
      price,
      userId: req.currentUser!.id,
    });

    ticket.save();

    res.status(201).send(ticket);
  }
);

export { router as createTicketRouter };
