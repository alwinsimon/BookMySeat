import { EventSubjects } from "../event-subjects";

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
