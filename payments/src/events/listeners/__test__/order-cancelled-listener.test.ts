import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { OrderCancelledEvent, OrderStatus } from "@bookmyseat/common";

import { natsClient } from "../../../nats-client";
import { Order } from "../../../models/order";
import { OrderCancelledListener } from "../order-cancelled-listener";

const mockOrderId = new mongoose.Types.ObjectId().toHexString();
const mockTicketId = new mongoose.Types.ObjectId().toHexString();
const mockUserId = new mongoose.Types.ObjectId().toHexString();

const testSetUpHelper = async () => {
  // Create an instance of the listener.
  const listener = new OrderCancelledListener(natsClient.client);

  // Create a order
  const order = Order.build({
    id: mockOrderId,
    version: 0,
    status: OrderStatus.Created,
    userId: mockUserId,
    price: 369,
  });

  await order.save();

  // Create a fake data event.
  const data: OrderCancelledEvent["data"] = {
    id: order.id,
    version: 1,
    ticket: {
      id: mockTicketId,
      price: 369,
    },
  };

  // Create a fake Message Object to mimic the Message object of node-nats-streaming library.

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg, order };
};

it("Order Cancelled Listener Test: Mark a order in DB as cancelled in response to Order Cancelled Event.", async () => {
  const { listener, data, msg, order } = await testSetUpHelper();

  // Invoke the onMessage function with the Data object and Message object.
  await listener.onMessage(data, msg);

  // Write assertions to make sure that the Order was cancelled
  const updatedOrder = await Order.findById(data.id);

  expect(updatedOrder).toBeDefined();
  expect(updatedOrder!.id).toEqual(order.id);
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it("Order Cancelled Listener Test: Successfully Acknowledges the event after successfully Saving Order changes to DB.", async () => {
  // Write assertions to make sure that the .ack() function was called.
  const { listener, data, msg } = await testSetUpHelper();

  // Invoke the onMessage function
  await listener.onMessage(data, msg);

  // Write assertions to make sure that the .ack() function was called.
  expect(msg.ack).toHaveBeenCalled();
});
