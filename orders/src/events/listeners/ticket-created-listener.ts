import { Message } from "node-nats-streaming";
import {
  Listener,
  EventSubjects,
  TicketCreatedEvent,
} from "@bookmyseat/common";

import { Ticket } from "../../models/ticket";
import { natsClient } from "../../nats-client";
import { queueGroupName } from "../order-service-queue-group-name";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject = EventSubjects.TicketCreated;

  queueGroupName = queueGroupName;

  async onMessage(data: TicketCreatedEvent["data"], msg: Message) {
    try {
      // Destructure the ticket id, title, and price from data argument.
      const { id, title, price } = data;

      // Save the ticket to the Database.
      const ticket = Ticket.build({
        id,
        title,
        price,
      });
      await ticket.save();

      // Acknowledge the ticketCreated events to NATS server.
      msg.ack();
    } catch (error) {
      console.error("Error processing TicketCreatedEvent", error);
    }
  }
}
