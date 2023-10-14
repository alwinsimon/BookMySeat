import request from "supertest";

import { app } from "../../app";

import { Ticket } from "../../models/ticket";

import { natsClient } from "../../nats-client";

it("Tickets POST Route Test: Has a route handler listening to /api/tickets for POST Requests.", async () => {
  // Make a request to the route and make sure that we are not getting a 404 which indicates the absence of the route
  const response = await request(app).post("/api/tickets").send({});
  expect(response.status).not.toEqual(404);
});

it("Tickets POST Route Test: /api/tickets can only be accessed only if the user is Signed-In.", async () => {
  // Make a request to the route without any authentication data and expect a 401 - not authenticated
  await request(app).post("/api/tickets").send({}).expect(401);
});

it("Tickets POST Route Test: /api/tickets can be accessed if the user is Signed-In.", async () => {
  // Make a request to the route with authentication data and expect that it dosen't return a 401 - not authenticated
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.testUserSignUp())
    .send({});
  expect(response.status).not.toEqual(401);
});

it("Tickets POST Route Test: /api/tickets Returns Error if an Invalid Title is Provided.", async () => {
  // Make a request to the route with authentication data and invalid Title
  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.testUserSignUp())
    .send({
      title: "",
      price: "100",
    })
    .expect(400);

  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.testUserSignUp())
    .send({
      price: "100",
    })
    .expect(400);
});

it("Tickets POST Route Test: /api/tickets Returns Error if an Invalid Price is Provided.", async () => {
  // Make a request to the route with authentication data and invalid Title
  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.testUserSignUp())
    .send({
      title: "Sample Title",
      price: "-100",
    })
    .expect(400);

  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.testUserSignUp())
    .send({
      title: "Sample Title",
    })
    .expect(400);
});

it("Tickets POST Route Test: /api/tickets Successfully Create a Ticket when Valid Parameters is provided.", async () => {
  // Get all the tickets that are available in the DB before test.
  let tickets = await Ticket.find({});

  // Since the above query will be run on Test MongoDB, There won't be any tickets.
  expect(tickets.length).toEqual(0);

  const title = "Sample Ticket";
  const price = 100.5;

  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.testUserSignUp())
    .send({
      title: title,
      price: price,
    })
    .expect(201);

  tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1);
  expect(tickets[0].title).toEqual(title);
  expect(tickets[0].price).toEqual(price);
});

it("Tickets POST Route Test: /api/tickets Successfully Publishes a Ticket Created Event When a Ticket is created.", async () => {

  const title = "Sample Ticket";
  const price = 100.5;

  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.testUserSignUp())
    .send({
      title: title,
      price: price,
    })
    .expect(201);
  
  expect(natsClient.client.publish).toHaveBeenCalled();
  
});