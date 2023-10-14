import { Publisher, Subjects, TicketCreatedEvent } from "@bookmyseat/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
