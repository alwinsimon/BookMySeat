import { Message } from "node-nats-streaming";
import { Listener, EventSubjects, OrderCreatedEvent } from "@bookmyseat/common";

import { queueGroupName } from "../payments-service-queue-group-name";
import { Order } from "../../models/order";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = EventSubjects.OrderCreated;

  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    // Create and save the order to the DB from the Event Data received.
    const order = Order.build({
      id: data.id,
      version: data.version,
      status: data.status,
      userId: data.userId,
      price: data.ticket.price,
    });

    await order.save();

    // Acknowledge the event
    msg.ack();
  }
}
