import { Message } from "node-nats-streaming";
import {
  Listener,
  EventSubjects,
  PaymentCreatedEvent,
  NotFoundError,
  OrderStatus,
} from "@bookmyseat/common";

import { queueGroupName } from "../order-service-queue-group-name";
import { Order } from "../../models/order";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  readonly subject = EventSubjects.PaymentCreated;

  queueGroupName = queueGroupName;

  async onMessage(data: PaymentCreatedEvent["data"], msg: Message) {
    try {
      // Destructure the ticket id, title, and price from data argument.
      const { id, version, orderId, stripeId } = data;

      const order = await Order.findById(data.orderId);

      if (!order) {
        throw new NotFoundError();
      }

      order.set({ status: OrderStatus.Complete });

      await order.save();

      // Acknowledge the Payment Created event to NATS server.
      msg.ack();
    } catch (error) {
      console.error("Error processing PaymentCreatedEvent", error);
    }
  }
}
