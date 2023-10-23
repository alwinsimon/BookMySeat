import { EventSubjects } from "../event-subjects";
import { OrderStatus } from "../custom-types/order-status";

export interface OrderExpiredEvent {
  subject: EventSubjects.OrderExpired;
  data: {
    orderId: string;
  }
}
