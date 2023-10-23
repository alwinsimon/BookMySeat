import { Publisher, EventSubjects, OrderExpiredEvent } from "@bookmyseat/common";

export class ExpirationCompletePublisher extends Publisher<OrderExpiredEvent>{
  readonly subject = EventSubjects.OrderExpired;
}