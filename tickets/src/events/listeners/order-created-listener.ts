import { Message } from "node-nats-streaming";
import {
  Listener,
  EventSubjects,
  OrderCreatedEvent,
  OrderStatus,
} from "@bookmyseat/common";

import { queueGroupName } from "../ticket-service-queue-group-name";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = EventSubjects.OrderCreated;

  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    
  }
}
