import request from "supertest";
import mongoose from "mongoose";

import { app } from "../../app";

import { natsClient } from "../../nats-client";
import { Order, OrderStatus } from "../../models/order";

const mockOrderId = new mongoose.Types.ObjectId().toHexString();
const mockUserId = new mongoose.Types.ObjectId().toHexString();
const mockTokenString = new mongoose.Types.ObjectId().toHexString();

it("Payments POST Route Test: Has a route handler listening to /api/payments for POST Requests.", async () => {
  // Make a request to the route and make sure that we are not getting a 404 which indicates the absence of the route
  const response = await request(app).post("/api/payments").send({});
  expect(response.status).not.toEqual(404);
});

it("Payments POST Route Test: /api/payments can only be accessed only if the user is Signed-In.", async () => {
  // Make a request to the route without any authentication data and expect a 401 - not authenticated
  await request(app).post("/api/payments").send({}).expect(401);
});

it("Payments POST Route Test: /api/payments can be accessed if the user is Signed-In.", async () => {
  // Make a request to the route with authentication data and expect that it dosen't return a 401 - not authenticated
  const response = await request(app)
    .post("/api/payments")
    .set("Cookie", global.testUserSignUp())
    .send({ token: mockTokenString, orderId: mockOrderId });
  expect(response.status).not.toEqual(401);
});

it("Payments POST Route Test: /api/payments Returns 400 if the request parameters are invalid.", async () => {
  // Make a request to the route with authentication data and invalid Token or Order Id.
  await request(app)
    .post("/api/payments")
    .set("Cookie", global.testUserSignUp())
    .send({ token: mockTokenString })
    .expect(400);

  await request(app)
    .post("/api/payments")
    .set("Cookie", global.testUserSignUp())
    .send({ orderId: mockOrderId })
    .expect(400);

  await request(app)
    .post("/api/payments")
    .set("Cookie", global.testUserSignUp())
    .send({})
    .expect(400);
});

it("Payments POST Route Test: /api/payments Returns 404 if the requested order dosen't exist.", async () => {
  // Make a request to the route with authentication data and invalid Order Id
  await request(app)
    .post("/api/payments")
    .set("Cookie", global.testUserSignUp())
    .send({ token: mockTokenString, orderId: mockOrderId })
    .expect(404);
});

it("Payments POST Route Test: /api/payments Returns 401 if the ticket does not belong to the requested user.", async () => {
  const orderOwnerId = new mongoose.Types.ObjectId().toHexString();

  const order = Order.build({
    id: mockOrderId,
    version: 0,
    status: OrderStatus.AwaitingPayment,
    userId: orderOwnerId,
    price: 369,
  });
  await order.save();

  const response = await request(app)
    .post("/api/payments")
    .set("Cookie", global.testUserSignUp())
    .send({ token: mockTokenString, orderId: order.id })
    .expect(401);
});

it("Payments POST Route Test: /api/payments Returns a 400 if the requested order is cancelled already.", async () => {

  // Create a order with mockUserId and status as cancelled
  const order = Order.build({
    id: mockOrderId,
    version: 0,
    status: OrderStatus.Cancelled,
    userId: mockUserId,
    price: 369,
  });
  await order.save();

  // Try to generate a payment for the above created cancelled order as the SAME user (use mockUserId in testUserSignUp)
  const response = await request(app)
    .post("/api/payments")
    .set("Cookie", global.testUserSignUp(mockUserId))
    .send({ token: mockTokenString, orderId: order.id })
    .expect(400);
});
