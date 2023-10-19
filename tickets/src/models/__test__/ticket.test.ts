import { Ticket } from "../ticket";

it("Successfully Implements Optimistic Concurrency Control", async () => {
  // Create an instance of a ticket
  const ticket = Ticket.build({
    title: "Sample Ticket",
    price: 5,
    userId: "sampleUserID",
  });

  // Save the ticket to DB
  await ticket.save();

  // Fetch the same ticket twice (in different variables)
  const firstticket = await Ticket.findById(ticket.id);
  const secondticket = await Ticket.findById(ticket.id);

  // Make Two Separate Changes to the Ticket
  firstticket!.set({ price: 10 });
  secondticket!.set({ price: 20 });

  // Save changes to the first fetched ticket and expect a successful SAVE
  await firstticket!.save();

  // Save changes to the Second fetched ticket and expect a error while SAVE - Indicating version mismatch
  try {
    await secondticket!.save();
  } catch (err) {
    return;
  }

  // Throw a error if the test reach this point execution without catching the error inside catch block and returning from there.
  throw new Error(
    "Optimistic Concurrency Control Test Failed if the test reached This line of code"
  );
});

it("Successfully Increments the Version Number on Multiple Manipulation of same record", async () => {
  // Create an instance of a ticket
  const ticket = Ticket.build({
    title: "Sample Ticket",
    price: 5,
    userId: "sampleUserID",
  });

  // Save the ticket to DB
  await ticket.save();

  // Expect the version number to be Zero
  expect(ticket.version).toEqual(0);

  // Update the ticket once
  ticket.set({ price: 10 });

  // Save changes to the ticket and expect a successful SAVE
  await ticket.save();

  // Expect he version number to be incremented once
  expect(ticket.version).toEqual(1);

  // Update the ticket again
  ticket.set({ price: 20 });

  // Save changes to the ticket and expect a successful SAVE
  await ticket.save();

  // Expect he version number to be incremented once
  expect(ticket.version).toEqual(2);
});
