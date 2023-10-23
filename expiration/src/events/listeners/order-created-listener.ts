import { Message } from "node-nats-streaming";
import { Listener, EventSubjects, OrderCreatedEvent } from "@bookmyseat/common";
import { queueGroupName } from "../expiration-service-queue-group-name";
import { expirationQueue } from "../../queues/expiration-queue";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = EventSubjects.OrderCreated;

  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    // Calculate the delay time (in Millie seconds) based on the expiresAt value received in event data.
    const delayBeforePublishingEvent =
      new Date(data.expiresAt).getTime() - new Date().getTime();

    // Add a new job to expiration queue for sending it to redis server for holding till delay time expiration
    await expirationQueue.add(
      { orderId: data.id },
      { delay: delayBeforePublishingEvent }
    );

    // Acknowledge the event
    msg.ack();
  }
}
