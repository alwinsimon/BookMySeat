import request from "supertest";

import { app } from "../../app";
import { Ticket } from "../../models/ticket";

it("Orders GET Route Test: Has a route handler listening to /api/orders for GET Requests.", async () => {
  // Make a request to the route and make sure that we are not getting a 404 which indicates the absence of the route
  const response = await request(app).get("/api/orders");
  expect(response.status).not.toEqual(404);
});

it("Orders GET Route Test: /api/orders can only be accessed only if the user is Signed-In.", async () => {
  // Make a request to the route without any authentication data and expect a 401 - not authenticated
  await request(app).get("/api/orders").expect(401);
});

it("Orders GET Route Test: /api/orders can be accessed if the user is Signed-In.", async () => {
  // Make a request to the route with authentication data and expect that it dosen't return a 401 - not authenticated
  const response = await request(app)
    .get("/api/orders")
    .set("Cookie", global.testUserSignUp());
  expect(response.status).not.toEqual(401);
});

it("Orders GET Route Test: /api/orders Fetches and returns all the orders of signed-in user.", async () => {
  // Helper function to build and return a ticket.
  const buildTicket = async () => {
    const ticket = await Ticket.build({
      title: "Test Ticket",
      price: 100,
    });
    await ticket.save();

    return ticket;
  };

  // Create 3 tickets and save it to DB
  const ticketOne = await buildTicket();
  const ticketTwo = await buildTicket();
  const ticketThree = await buildTicket();

  // Create two different users and save the cookies for the user in a variable
  const userOne = global.testUserSignUp();
  const userTwo = global.testUserSignUp();

  // Create One Order as User #1 and destructure the response body as orderOne
  const { body: orderOne } = await request(app)
    .post("/api/orders")
    .set("Cookie", userOne)
    .send({
      ticketId: ticketOne.id,
    })
    .expect(201);

  // Create Two Orders as User #2 and destructure the response body as orderTwo and orderThree
  const { body: orderTwo } = await request(app)
    .post("/api/orders")
    .set("Cookie", userTwo)
    .send({
      ticketId: ticketTwo.id,
    })
    .expect(201);

  const { body: orderThree } = await request(app)
    .post("/api/orders")
    .set("Cookie", userTwo)
    .send({
      ticketId: ticketThree.id,
    })
    .expect(201);

  // Make request to get orders for User #2
  const response = await request(app).get("/api/orders").set("Cookie", userTwo);
  expect(response.status).toEqual(200);

  // Make sure that the two orders for User #2 is only returned and not of User #1.
  expect(response.body.length).toEqual(2);

  expect(response.body[0].id).toEqual(orderTwo.id);
  expect(response.body[1].id).toEqual(orderThree.id);

  expect(response.body[0].ticket.id).toEqual(orderTwo.ticket.id);
  expect(response.body[1].ticket.id).toEqual(orderThree.ticket.id);
});

it.todo("Test to verify Event Publishing logic.");
