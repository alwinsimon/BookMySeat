import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { OrderCancelledEvent, OrderStatus } from "@bookmyseat/common";

import { OrderCancelledListener } from "../order-cancelled-listener";
import { natsClient } from "../../../nats-client";
import { Ticket } from "../../../models/ticket";

const mockOrderId = new mongoose.Types.ObjectId().toHexString();
const mockUserId = new mongoose.Types.ObjectId().toHexString();

const testSetUpHelper = async () => {
  // Create an instance of the listener.
  const listener = new OrderCancelledListener(natsClient.client);

  // Create and Save a Ticket.
  const ticket = Ticket.build({
    title: "Sample Ticket",
    price: 10,
    userId: mockUserId,
  });

  ticket.set({ orderId: mockOrderId });

  await ticket.save();

  // Create a fake data event.
  const data: OrderCancelledEvent["data"] = {
    id: mockOrderId,
    version: 0,
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  };

  // Create a fake Message Object to mimic the Message object of node-nats-streaming library.

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, ticket, data, msg, mockOrderId };
};

it("Order Cancelled Listener Test: Set the OrderId of the cancelled Ticket to undefined in response to Order Cancelled Event.", async () => {
  const { listener, ticket, data, msg, mockOrderId } = await testSetUpHelper();

  // Invoke the onMessage function with the Data object and Message object.
  await listener.onMessage(data, msg);

  // Write assertions to make sure that a Ticket was created
  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket).toBeDefined();
  expect(updatedTicket!.orderId).not.toBeDefined();
});

it("Order Cancelled Listener Test: Successfully Acknowledges the event after successfully Removing Order Id of the Ticket.", async () => {
  // Write assertions to make sure that the .ack() function was called.
  const { listener, data, msg } = await testSetUpHelper();

  // Invoke the onMessage function
  await listener.onMessage(data, msg);

  // Write assertions to make sure that the .ack() function was called.
  expect(msg.ack).toHaveBeenCalled();
});

it("Order Cancelled Listener Test: Publishes a Ticket Updated Event.", async () => {
  // Write assertions to make sure that the a ticket updated event is published by Order created listener.
  // This is to update the version of ticket stored in various services.
  const { listener, ticket, data, msg } = await testSetUpHelper();

  // Invoke the onMessage function
  await listener.onMessage(data, msg);

  // Make sure that the publish method was invoked successfully
  expect(natsClient.client.publish).toHaveBeenCalled();

});
