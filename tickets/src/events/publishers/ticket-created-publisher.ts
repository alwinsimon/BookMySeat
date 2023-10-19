import { Publisher, EventSubjects, TicketCreatedEvent } from "@bookmyseat/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = EventSubjects.TicketCreated;
}
