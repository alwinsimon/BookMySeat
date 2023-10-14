import { Publisher, Subjects, TicketUpdatedEvent } from "@bookmyseat/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
