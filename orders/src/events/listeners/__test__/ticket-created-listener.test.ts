import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { TicketCreatedEvent } from "@bookmyseat/common";

import { TicketCreatedListener } from "../ticket-created-listener";
import { natsClient } from "../../../nats-client";
import { Ticket } from "../../../models/ticket";

const mockTicketId = new mongoose.Types.ObjectId().toHexString();
const mockUserId = new mongoose.Types.ObjectId().toHexString();

const testSetUpHelper = async () => {
  // Create an instance of the listener.
  const listener = new TicketCreatedListener(natsClient.client);

  // Create a fake data event.
  const data: TicketCreatedEvent["data"] = {
    id: mockTicketId,
    version: 0,
    title: "Sample Ticket",
    price: 10,
    userId: mockUserId,
  };

  // Create a fake Message Object to mimic the Message object of node-nats-streaming library.

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it("Ticket Created Listener Test: Creates and Saves a Ticket in response to Ticket Created Event.", async () => {
  const { listener, data, msg } = await testSetUpHelper();

  // Invoke the onMessage function with the Data object and Message object.
  await listener.onMessage(data, msg);

  // Write assertions to make sure that a Ticket was created
  const ticket = await Ticket.findById(data.id);

  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual(data.title);
  expect(ticket!.price).toEqual(data.price);
});

it("Ticket Created Listener Test: Successfully Acknowledges the event after successfully Saving Ticket.", async () => {
  // Write assertions to make sure that the .ack() function was called.
  const { listener, data, msg } = await testSetUpHelper();

  // Invoke the onMessage function
  await listener.onMessage(data, msg);

  // Write assertions to make sure that the .ack() function was called.
  expect(msg.ack).toHaveBeenCalled();
});
