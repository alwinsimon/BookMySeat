import { EventSubjects } from "../event-subjects";
import { OrderStatus } from "../custom-types/order-status";

export interface OrderCreatedEvent {
  subject: EventSubjects.OrderCreated;
  data: {
    id: string;
    version: number;
    status: OrderStatus;
    userId: string;
    expiresAt: string;
    ticket: {
      id: string;
      price: number;
    }
  }
}
