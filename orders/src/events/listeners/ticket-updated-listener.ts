import { Message } from "node-nats-streaming";
import {
  Listener,
  EventSubjects,
  TicketUpdatedEvent,
} from "@bookmyseat/common";

import { Ticket } from "../../models/ticket";
import { queueGroupName } from "../order-service-queue-group-name";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  readonly subject = EventSubjects.TicketUpdated;

  queueGroupName = queueGroupName;

  async onMessage(data: TicketUpdatedEvent["data"], msg: Message) {
    try {
      // Destructure the ticket id, title, and price from data argument.
      const { id, title, price } = data;

      // Find, Update and Save the updated ticket data to the Database.
      const ticket = await Ticket.findById(id);

      if (!ticket) {
        throw new Error("Ticket not found !!!");
      }

      ticket.set({ title, price });
      await ticket.save();

      // Acknowledge the ticketCreated events to NATS server.
      msg.ack();

    } catch (error) {
      console.error("Error processing TicketUpdatedEvent:", error);
    }
  }
}
