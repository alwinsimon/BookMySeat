import { EventSubjects } from "../event-subjects";

export interface TicketUpdatedEvent {
  subject: EventSubjects.TicketUpdated;
  data: {
    id: string;
    title: string;
    price: number;
  };
}
