import request from "supertest";

import { app } from "../../app";
import { response } from "express";

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
      price: "100"
    })
    .expect(400);

  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.testUserSignUp())
    .send({
      price: "100"
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
      price: "-100"
    })
    .expect(400);

  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.testUserSignUp())
    .send({
      title: "Sample Title"
    })
    .expect(400);
});

it("Tickets POST Route Test: /api/tickets Successfully Create a Ticket when Valid Parameters is provided.", async () => {});
