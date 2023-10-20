import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { TicketUpdatedEvent } from "@bookmyseat/common";

import { TicketUpdatedListener } from "../ticket-updated-listener";
import { natsClient } from "../../../nats-client";
import { Ticket } from "../../../models/ticket";

const mockTicketId = new mongoose.Types.ObjectId().toHexString();

const testSetUpHelper = async () => {
  // Create an instance of the listener.
  const listener = new TicketUpdatedListener(natsClient.client);

  // Creates and saves a ticket
  const ticket = Ticket.build({
    id: mockTicketId,
    title: "Sample Ticket",
    price: 10,
  });

  await ticket.save();

  // Create a fake data event.
  const data: TicketUpdatedEvent["data"] = {
    id: mockTicketId,
    version: ticket.version + 1,
    title: "Updated Ticket",
    price: 20,
  };

  // Create a fake Message Object to mimic the Message object of node-nats-streaming library.

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, ticket, data, msg };
};

it("Ticket Updated Listener Test: Finds and Updates a Ticket in response to Ticket Updated Event.", async () => {
  const { listener, ticket, data, msg } = await testSetUpHelper();

  // Invoke the onMessage function with the Data object and Message object.
  await listener.onMessage(data, msg);

  // Write assertions to make sure that a Ticket was updated
  const updatedTicket = await Ticket.findById(data.id);

  expect(updatedTicket).toBeDefined();
  expect(updatedTicket!.title).toEqual(data.title);
  expect(updatedTicket!.price).toEqual(data.price);
  expect(updatedTicket!.version).toEqual(data.version);
});

it("Ticket Updated Listener Test: Successfully Acknowledges the event after successfully Updating Ticket.", async () => {
  const { listener, data, msg } = await testSetUpHelper();

  // Invoke the onMessage function
  await listener.onMessage(data, msg);

  // Write assertions to make sure that the .ack() function was called.
  expect(msg.ack).toHaveBeenCalled();
});

it("Ticket Updated Listener Test: Prevents Acknowledging the event if the version number is not in sequence.", async () => {
  const { listener, data, msg, ticket } = await testSetUpHelper();

  // Manually set the version number into a future number by incrementing it
  data.version = 10;

  // Invoke the onMessage function and expect that msg.ack() function not to be called due to version sequence mismatch.
  try {
    await listener.onMessage(data, msg);
  } catch (err) {
    console.error(
      "This error might be logged, even if test is running fine: ",
      err
    );
  }

  // Write assertions to make sure that the .ack() function was NOT called.
  expect(msg.ack).not.toHaveBeenCalled();
});
