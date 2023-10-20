import { Message } from "node-nats-streaming";
import {
  Listener,
  EventSubjects,
  OrderCreatedEvent,
  OrderStatus,
  NotFoundError,
} from "@bookmyseat/common";

import { queueGroupName } from "../ticket-service-queue-group-name";
import { Ticket } from "../../models/ticket";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = EventSubjects.OrderCreated;

  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    // Find the Ticket that the Order is trying to reserve
    const ticket = await Ticket.findById(data.ticket.id);

    // If no ticket exists, throw an error
    if (!ticket) {
      throw new Error("Ticket not found !!!");
    }

    // If ticket exist, mark the ticket as being reserved by setting the orderId property
    ticket.set({ orderId: data.id });

    // Save the Ticket to DB
    await ticket.save();

    // Acknowledge the event
    msg.ack();
  }
}
