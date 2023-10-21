import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { OrderCreatedEvent, OrderStatus } from "@bookmyseat/common";

import { OrderCreatedListener } from "../order-created-listener";
import { natsClient } from "../../../nats-client";
import { Ticket } from "../../../models/ticket";

const mockOrderId = new mongoose.Types.ObjectId().toHexString();
const mockUserId = new mongoose.Types.ObjectId().toHexString();

const testSetUpHelper = async () => {
  // Create an instance of the listener.
  const listener = new OrderCreatedListener(natsClient.client);

  // Create and Save a Ticket.
  const ticket = Ticket.build({
    title: "Sample Ticket",
    price: 10,
    userId: mockUserId,
  });

  await ticket.save();

  // Create a fake data event.
  const data: OrderCreatedEvent["data"] = {
    id: mockOrderId,
    version: 0,
    status: OrderStatus.Created,
    userId: mockUserId,
    expiresAt: "Some-String",
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

  return { listener, ticket, data, msg };
};

it("Order Created Listener Test: Set the OrderId of the Ordered Ticket in response to Order Created Event.", async () => {
  const { listener, ticket, data, msg } = await testSetUpHelper();

  // Invoke the onMessage function with the Data object and Message object.
  await listener.onMessage(data, msg);

  // Write assertions to make sure that a Ticket was created
  const updatedTicket = await Ticket.findById(data.ticket.id);

  expect(updatedTicket).toBeDefined();
  expect(updatedTicket!.orderId).toEqual(data.id);
});

it("Order Created Listener Test: Successfully Acknowledges the event after successfully Saving Order Id to Ticket.", async () => {
  // Write assertions to make sure that the .ack() function was called.
  const { listener, data, msg } = await testSetUpHelper();

  // Invoke the onMessage function
  await listener.onMessage(data, msg);

  // Write assertions to make sure that the .ack() function was called.
  expect(msg.ack).toHaveBeenCalled();
});

it("Order Created Listener Test: Publishes a Ticket Updated Event.", async () => {
  // Write assertions to make sure that the a ticket updated event is published by Order created listener.
  // This is to update the version of ticket stored in various services.
  const { listener, ticket, data, msg } = await testSetUpHelper();

  // Invoke the onMessage function
  await listener.onMessage(data, msg);

  // Make sure that the publish method was invoked successfully
  expect(natsClient.client.publish).toHaveBeenCalled();

  // Make sure that the data passed to the publish method is appropriate data
  const ticketUpdatedData = JSON.parse(
    (natsClient.client.publish as jest.Mock).mock.calls[0][1]
  );

  expect(ticketUpdatedData.orderId).toEqual(data.id);
});
