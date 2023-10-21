import { EventSubjects } from "../event-subjects";
import { OrderStatus } from "../custom-types/order-status";

export interface OrderCancelledEvent {
  subject: EventSubjects.OrderCancelled;
  data: {
    id: string;
    version: number;
    ticket: {
      id: string;
      price: number;
    }
  }
}
