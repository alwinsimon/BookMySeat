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
    // Destructure the ticket title and price from data argument
    const { title, price } = data;

    // Save the ticket to Database
    const ticket = Ticket.build({
      title,
      price,
    });
    await ticket.save();
  }
}
