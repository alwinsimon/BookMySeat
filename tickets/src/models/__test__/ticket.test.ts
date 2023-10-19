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
  const firstFetchedTicket = await Ticket.findById(ticket.id);
  const secondFetchedTicket = await Ticket.findById(ticket.id);

  // Make Two Separate Changes to the Ticket
  firstFetchedTicket!.set({ price: 10 });
  secondFetchedTicket!.set({ price: 20 });

  // Save changes to the first fetched ticket and expect a successful SAVE
  await firstFetchedTicket!.save();

  // Save changes to the Second fetched ticket and expect a error while SAVE - Indicating version mismatch
  try {
    await secondFetchedTicket!.save();
  } catch (err) {
    return;
  }

  // Throw a error if the test reach this point execution without catching the error inside catch block and returning from there.
  throw new Error(
    "Optimistic Concurrency Control Test Failed if the test reached This line of code"
  );
});
