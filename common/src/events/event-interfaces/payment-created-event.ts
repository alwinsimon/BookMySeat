import { EventSubjects } from "../event-subjects";

export interface PaymentCreatedEvent {
  subject: EventSubjects.PaymentCreated;
  data: {
    id: string;
    version: number;
    orderId: string;
    stripeId: string;
  };
}
