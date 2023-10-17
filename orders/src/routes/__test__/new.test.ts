import request from "supertest";
import mongoose from "mongoose";

import { app } from "../../app";

import { Ticket } from "../../models/ticket";

const mockTicketId = new mongoose.Types.ObjectId().toHexString();

it("Orders POST Route Test: Has a route handler listening to /api/orders for POST Requests.", async () => {
  // Make a request to the route and make sure that we are not getting a 404 which indicates the absence of the route
  const response = await request(app).post("/api/orders").send({});
  expect(response.status).not.toEqual(404);
});

it("Orders POST Route Test: /api/orders can only be accessed only if the user is Signed-In.", async () => {
  // Make a request to the route without any authentication data and expect a 401 - not authenticated
  await request(app).post("/api/orders").send({}).expect(401);
});

it("Orders POST Route Test: /api/orders can be accessed if the user is Signed-In.", async () => {
  // Make a request to the route with authentication data and expect that it dosen't return a 401 - not authenticated
  const response = await request(app)
    .post("/api/orders")
    .set("Cookie", global.testUserSignUp())
    .send({ ticketID: mockTicketId });
  expect(response.status).not.toEqual(401);
});

it("Orders POST Route Test: /api/orders Returns Error if an Invalid ticketId is Provided.", async () => {
  // Make a request to the route with authentication data and invalid Title
  await request(app)
    .post("/api/orders")
    .set("Cookie", global.testUserSignUp())
    .send({
      ticketId: "",
    })
    .expect(400);

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.testUserSignUp())
    .send({})
    .expect(400);
});

it("Orders POST Route Test: /api/orders Returns error if the ticket does not exist.", async () => {
  const response = await request(app)
    .post("/api/orders")
    .set("Cookie", global.testUserSignUp())
    .send({
      ticketId: mockTicketId,
    })
    .expect(404);
});

it("Orders POST Route Test: /api/orders Create a Order and Reserve Ticket if Valid Parameters is provided.", async () => {
  // Create a ticket and save it to DB
  const ticket = await Ticket.build({
    title: "Test Ticket",
    price: 100,
  });
  ticket.save();
  const ticketId = ticket.id;

  // Reserve the ticket by creating a order
  const order = await request(app)
    .post("/api/orders")
    .set("Cookie", global.testUserSignUp())
    .send({
      ticketId: ticketId,
    })
    .expect(201);
});

it("Orders POST Route Test: /api/orders Returns a 400 error if the Ticket is already Reserved.", async () => {
  // Create a ticket and save it to DB
  const ticket = await Ticket.build({
    title: "Test Ticket",
    price: 100,
  });
  ticket.save();
  const ticketId = ticket.id;

  // Reserve the ticket by creating a order
  const order = await request(app)
    .post("/api/orders")
    .set("Cookie", global.testUserSignUp())
    .send({
      ticketId: ticketId,
    })
    .expect(201);

  // Try to create a new order with same ticketId and expect a 400 since the ticket is already reserved by previous order
  const response = await request(app)
    .post("/api/orders")
    .set("Cookie", global.testUserSignUp())
    .send({
      ticketId: ticketId,
    })
    .expect(400);
  expect(response.body.errors[0].message).toEqual(
    "Ticket is already reserved."
  );
});

it.todo("Test to verify Event Publishing logic.");
