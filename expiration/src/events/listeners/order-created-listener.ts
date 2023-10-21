import { Message } from "node-nats-streaming";
import { Listener, EventSubjects, OrderCreatedEvent } from "@bookmyseat/common";
import { queueGroupName } from "../expiration-service-queue-group-name";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = EventSubjects.OrderCreated;

  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    // Process the data

    // Acknowledge the event
    msg.ack();
  }
}
