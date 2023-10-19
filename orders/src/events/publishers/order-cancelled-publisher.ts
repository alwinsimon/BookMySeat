import {
  Publisher,
  EventSubjects,
  OrderCancelledEvent,
} from "@bookmyseat/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = EventSubjects.OrderCancelled;
}
