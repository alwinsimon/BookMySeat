import express, { Request, Response, request } from "express";
import mongoose from "mongoose";
import { body } from "express-validator";

import {
  requireAuth,
  validateRequest,
  NotFoundError,
  BadRequestError,
  OrderStatus,
} from "@bookmyseat/common";

import { natsClient } from "../nats-client";
import { OrderCreatedPublisher } from "../events/publishers/order-created-publisher";

import { Order } from "../models/order";
import { Ticket } from "../models/ticket";

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 15 * 60; // 15 Minutes

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
    // Find the Ticket that user is trying to purchase from the DB
    const { ticketId } = req.body;

    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      throw new NotFoundError();
    }

    // Make sure that the Ticket is not already reserved by another order
    const isReserved = await ticket.isReserved();

    if (isReserved) {
      throw new BadRequestError("Ticket is already reserved.");
    }

    // Calculate the expiration date for this order
    const expirationDate = new Date();

    expirationDate.setSeconds(
      expirationDate.getSeconds() + EXPIRATION_WINDOW_SECONDS
    );

    // Build the order and save it in the DB
    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expirationDate,
      ticket: ticket,
    });

    await order.save();

    // Publishing a event notifying other services about the order creation
    new OrderCreatedPublisher(natsClient.client).publish({
      id: order.id,
      version: order.version,
      status: order.status,
      userId: order.userId,
      expiresAt: order.expiresAt.toISOString(),
      ticket: {
        id: ticket.id,
        price: ticket.price,
      },
    });

    res.status(201).send(order);
  }
);

export { router as createOrderRouter };
