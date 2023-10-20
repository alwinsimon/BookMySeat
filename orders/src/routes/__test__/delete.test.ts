import request from "supertest";
import { app } from "../../app";

import mongoose from "mongoose";
import { Ticket } from "../../models/ticket";
import { Order, OrderStatus } from "../../models/order";

import { natsClient } from "../../nats-client";

const mockOrderId = new mongoose.Types.ObjectId().toHexString();

it("Orders DELETE Route Test: Has a route handler listening to /api/orders/:orderId for DELETE Requests.", async () => {
  // Make a request to the route and make sure that we are not getting a 404 which indicates the absence of the route
  const response = await request(app).delete(`/api/orders/${mockOrderId}`);
  expect(response.status).not.toEqual(404);
});

it("Orders DELETE Route Test: /api/orders/:orderId can only be accessed only if the user is Signed-In.", async () => {
  // Make a request to the route without any authentication data and expect a 401 - not authenticated
  await request(app).delete(`/api/orders/${mockOrderId}`).expect(401);
});

it("Orders DELETE Route Test: /api/orders/:orderId can be accessed if the user is Signed-In.", async () => {
  // Make a request to the route with authentication data and expect that it dosen't return a 401 - not authenticated
  const response = await request(app)
    .delete(`/api/orders/${mockOrderId}`)
    .set("Cookie", global.testUserSignUp());
  expect(response.status).not.toEqual(401);
});

it("Orders DELETE Route Test: /api/orders/:orderId Fetches and cancels the requested order of signed-in user.", async () => {
  // Create one tickets and save it to DB
  const ticket = await Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "Test Ticket",
    price: 100,
  });
  await ticket.save();

  // Create a user and save the cookies for the user in a variable
  const user = global.testUserSignUp();

  // Create One Order as User and destructure the response body as order
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({
      ticketId: ticket.id,
    })
    .expect(201);

  // Make request to cancel the order as the same user with the same orderId
  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send()
    .expect(204);

  // Make sure that the status was updated in the DB
  const updatedOrder = await Order.findById(order.id);
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it("Orders DELETE Route Test: /api/orders/:orderId Returns an error if a user request to get another users order.", async () => {
  // Create one tickets and save it to DB
  const ticket = await Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "Test Ticket",
    price: 100,
  });
  await ticket.save();

  // Create two users and save the cookies for the users in a variable
  const userOne = global.testUserSignUp();
  const userTwo = global.testUserSignUp();

  // Create One Order as userOne and destructure the response body as order
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", userOne)
    .send({
      ticketId: ticket.id,
    })
    .expect(201);

  // Make request to cancel/delete the order as a different user with the orderId created by userOne
  const response = await request(app)
    .delete(`/api/orders/${order.id}`)
    .set("Cookie", userTwo)
    .send()
    .expect(401);
});

it("Orders DELETE Route Test: /api/orders/:orderId Verify Order Cancelled Event Publishing.", async () => {
  // Create one tickets and save it to DB
  const ticket = await Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "Test Ticket",
    price: 100,
  });
  await ticket.save();

  // Create a user and save the cookies for the user in a variable
  const user = global.testUserSignUp();

  // Create One Order as User and destructure the response body as order
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({
      ticketId: ticket.id,
    })
    .expect(201);

  // Make request to cancel the order as the same user with the same orderId
  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send()
    .expect(204);

  expect(natsClient.client.publish).toHaveBeenCalled();
});
