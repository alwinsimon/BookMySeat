import {
  Publisher,
  EventSubjects,
  PaymentCreatedEvent,
} from "@bookmyseat/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = EventSubjects.PaymentCreated;
}
