import {
  Publisher,
  OrderCreatedEvent,
  EventSubjects,
} from "@bookmyseat/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = EventSubjects.OrderCreated;
}
