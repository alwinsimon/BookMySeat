import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { OrderCreatedEvent, OrderStatus } from "@bookmyseat/common";

import { OrderCreatedListener } from "../order-created-listener";
import { natsClient } from "../../../nats-client";
import { Order } from "../../../models/order";

const mockOrderId = new mongoose.Types.ObjectId().toHexString();
const mockUserId = new mongoose.Types.ObjectId().toHexString();
const mockTicketId = new mongoose.Types.ObjectId().toHexString();

const testSetUpHelper = async () => {
  // Create an instance of the listener.
  const listener = new OrderCreatedListener(natsClient.client);

  // Create a fake data event.
  const data: OrderCreatedEvent["data"] = {
    id: mockOrderId,
    version: 0,
    status: OrderStatus.Created,
    userId: mockUserId,
    expiresAt: "Some-String",
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

  return { listener, data, msg, mockOrderId };
};

it("Order Created Listener Test: Save a order to DB in response to Order Created Event.", async () => {
  const { listener, data, msg, mockOrderId } = await testSetUpHelper();

  // Invoke the onMessage function with the Data object and Message object.
  await listener.onMessage(data, msg);

  // Write assertions to make sure that a Order was created
  const order = await Order.findById(data.id);

  expect(order).toBeDefined();
  expect(order!.id).toEqual(mockOrderId);
  expect(order!.price).toEqual(data.ticket.price);
});

it("Order Created Listener Test: Successfully Acknowledges the event after successfully Saving Order to DB.", async () => {
  // Write assertions to make sure that the .ack() function was called.
  const { listener, data, msg } = await testSetUpHelper();

  // Invoke the onMessage function
  await listener.onMessage(data, msg);

  // Write assertions to make sure that the .ack() function was called.
  expect(msg.ack).toHaveBeenCalled();
});
