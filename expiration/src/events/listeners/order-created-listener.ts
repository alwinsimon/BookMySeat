import { Message } from "node-nats-streaming";
import { Listener, EventSubjects, OrderCreatedEvent } from "@bookmyseat/common";
import { queueGroupName } from "../expiration-service-queue-group-name";
import { expirationQueue } from "../../queues/expiration-queue";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = EventSubjects.OrderCreated;

  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    // Process the data
    await expirationQueue.add({ orderId: data.id });

    // Acknowledge the event
    msg.ack();
  }
}
