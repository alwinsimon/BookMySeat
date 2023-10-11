import request from "supertest";

import { app } from "../../app";

import { Ticket } from "../../models/ticket";

const createTicket = () => {
  return request(app)
    .post("/api/tickets")
    .set("Cookie", global.testUserSignUp())
    .send({
      title: "Sample Ticket",
      price: 100,
    })
    .expect(201);
};

it("Tickets GET Route Test: Returns all the available tickets in the DB.", async () => {
  // Make a request to the route and make sure that we are getting all the available tickets back
  await createTicket();
  await createTicket();
  await createTicket();

  const response = await request(app)
    .get("/api/tickets")
    .set("Cookie", global.testUserSignUp())
    .send()
    .expect(200);

  expect(response.body.length).toEqual(3);
});
