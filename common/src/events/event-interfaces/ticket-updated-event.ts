import { EventSubjects } from "../event-subjects";

export interface TicketUpdatedEvent {
  subject: EventSubjects.TicketUpdated;
  data: {
    id: string;
    version: number;
    title: string;
    price: number;
    orderId?: string;
  };
}
