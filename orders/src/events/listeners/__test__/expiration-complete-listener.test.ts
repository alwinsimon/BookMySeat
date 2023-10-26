import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { OrderExpiredEvent, OrderStatus } from "@bookmyseat/common";

import { natsClient } from "../../../nats-client";
import { OrderExpirationListener } from "../expiration-complete-listener";

import { Order } from "../../../models/order";
import { Ticket } from "../../../models/ticket";

const testSetUpHelper = async () => {
  // Create an instance of the listener.
  const listener = new OrderExpirationListener(natsClient.client);

  const mockTicketId = new mongoose.Types.ObjectId().toHexString();
  const mockUserId = new mongoose.Types.ObjectId().toHexString();

  // Create a Ticket
  const ticket = Ticket.build({
    id: mockTicketId,
    title: "Sample Ticket",
    price: 100,
  });

  await ticket.save();

  // Create a order with the above created Ticket
  const order = Order.build({
    userId: mockUserId,
    status: OrderStatus.Created,
    expiresAt: new Date(),
    ticket: ticket,
  });

  await order.save();

  // Create a fake event data.
  const data: OrderExpiredEvent["data"] = {
    orderId: order.id,
  };

  // Create a fake Message Object to mimic the Message object of node-nats-streaming library.

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, ticket, order, data, msg };
};

it("Order Expiration Listener Test: Updates order status to cancelled after order expiration.", async () => {
  const { listener, order, data, msg } = await testSetUpHelper();

  // Invoke the onMessage function with the Data object and Message object.
  await listener.onMessage(data, msg);

  // Write assertions to make sure that Order is cancelled.
  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it("Order Expiration Listener Test: Successfully emits an Order Cancelled event.", async () => {
  const { listener, order, data, msg } = await testSetUpHelper();

  // Invoke the onMessage function with the Data object and Message object.
  await listener.onMessage(data, msg);

  // Write assertions to make sure that the .ack() function was called.
  expect(natsClient.client.publish).toHaveBeenCalled();

  const eventData = JSON.parse(
    (natsClient.client.publish as jest.Mock).mock.calls[0][1]
  );

  expect(eventData.id).toEqual(order.id);
});

it("Order Expiration Listener Test: Successfully Acknowledges the event after successfully Cancelling the Order.", async () => {
  const { listener, data, msg } = await testSetUpHelper();

  // Invoke the onMessage function with the Data object and Message object.
  await listener.onMessage(data, msg);

  // Write assertions to make sure that the .ack() function was called.
  expect(msg.ack).toHaveBeenCalled();
});
