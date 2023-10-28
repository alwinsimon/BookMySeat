import { Publisher, EventSubjects, TicketUpdatedEvent } from "@bookmyseat/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = EventSubjects.TicketUpdated;
}
