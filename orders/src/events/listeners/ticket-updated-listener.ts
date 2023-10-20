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
      // Find, Update and Save the updated ticket data to the Database.
      const ticket = await Ticket.findByEvent(data);

      if (!ticket) {
        throw new Error("Ticket not found !!!");
      }

      // Destructure data from data argument.
      const { title, price } = data;

      ticket.set({ title, price });
      await ticket.save();

      // Acknowledge the ticketCreated events to NATS server.
      msg.ack();
    } catch (error) {
      console.error("Error processing TicketUpdatedEvent:", error);
    }
  }
}
