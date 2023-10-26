import { Message } from "node-nats-streaming";
import {
  Listener,
  EventSubjects,
  OrderExpiredEvent,
  OrderStatus,
} from "@bookmyseat/common";

import { Order } from "../../models/order";
import { queueGroupName } from "../order-service-queue-group-name";
import { OrderCancelledPublisher } from "../publishers/order-cancelled-publisher";
import { natsClient } from "../../nats-client";

export class OrderExpirationListener extends Listener<OrderExpiredEvent> {
  readonly subject = EventSubjects.OrderExpired;

  queueGroupName = queueGroupName;

  async onMessage(data: OrderExpiredEvent["data"], msg: Message) {
    try {
      // Find, Update and Save the updated ticket data to the Database.
      const order = await Order.findById(data.orderId).populate("ticket");

      if (!order) {
        throw new Error("Order not found !!!");
      }

      // If the order is already paid and marked complete, return early and acknowledge the event to NATS.
      if (order.status === OrderStatus.Complete) {
        return msg.ack();
      }

      order.set({ status: OrderStatus.Cancelled });
      await order.save();

      // Emit a Order Cancelled Event
      await new OrderCancelledPublisher(natsClient.client).publish({
        id: order.id,
        version: order.version,
        ticket: { id: order.ticket.id, price: order.ticket.price },
      });

      // Acknowledge the ticketCreated events to NATS server.
      msg.ack();
    } catch (error) {
      console.error("Error processing Order Expired Event:", error);
    }
  }
}
