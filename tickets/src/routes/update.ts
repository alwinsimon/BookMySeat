import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  requireAuth,
  validateRequest,
  NotFoundError,
  NotAuthorizedError,
} from "@bookmyseat/common";

import { Ticket } from "../models/ticket";

import { natsClient } from "../nats-client";
import { TicketUpdatedPublisher } from "../events/publishers/ticket-updated-publisher";

const router = express.Router();

router.put(
  "/api/tickets/:ticketId",
  requireAuth,
  [
    body("title")
      .not()
      .isEmpty()
      .withMessage("A Valid title string must be provided."),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be provided and must be greater than zero."),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.ticketId);

    if (!ticket) {
      throw new NotFoundError();
    }

    if (ticket.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    ticket.set({
      title: req.body.title,
      price: req.body.price,
    });
    await ticket.save();

    await new TicketUpdatedPublisher(natsClient.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
    });

    res.send(ticket);
  }
);

export { router as updateTicketRouter };
