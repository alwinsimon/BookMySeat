import { Message } from "node-nats-streaming";
import {
  Listener,
  EventSubjects,
  OrderCreatedEvent,
  OrderStatus,
} from "@bookmyseat/common";

import { queueGroupName } from "../ticket-service-queue-group-name";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

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

    // Emit new event notifying the ticket updation event associated with the order creation event
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      version: ticket.version,
      title: ticket.title,
      price: ticket.price,
      orderId: ticket.orderId,
    });

    // Acknowledge the event
    msg.ack();
  }
}
