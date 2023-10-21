import { Message } from "node-nats-streaming";
import {
  Listener,
  EventSubjects,
  OrderCancelledEvent,
} from "@bookmyseat/common";

import { queueGroupName } from "../ticket-service-queue-group-name";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject = EventSubjects.OrderCancelled;

  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
    // Find the Ticket that is associated with the Order that's cancelled
    const ticket = await Ticket.findById(data.ticket.id);

    // If no ticket exists, throw an error
    if (!ticket) {
      throw new Error("Ticket not found !!!");
    }

    // If ticket exist, mark the oederId of ticket as undefined so as to unreserve and make the ticket available for reservation again.
    ticket.set({ orderId: undefined });

    // Save the Ticket to DB
    await ticket.save();

    // Emit new event notifying the ticket updation event associated with the order cancellation event.
    // This is to update the version of ticket stored in various services.
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
