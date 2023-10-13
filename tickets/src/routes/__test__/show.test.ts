import request from "supertest";
import mongoose from "mongoose";

import { app } from "../../app";

it("Tickets with ID GET Route Test: /api/tickets Returns a 404 if the requested Ticket is Not Found/Valid.", async () => {
  const mockTicketId = new mongoose.Types.ObjectId().toHexString();

  // Make a request to the route and make sure that we are getting a 404 which indicates the absence of a valid ticket.
  const response = await request(app)
    .get(`/api/tickets/${mockTicketId}`)
    .send({});
  expect(response.status).toEqual(404);
});

it("Tickets with ID GET Route Test: /api/tickets Returns the Ticket if the requested Ticket is Found/Valid.", async () => {
  // Make a request to the route and make sure that we are getting a ticket back which indicates the presence of a valid ticket.
  const title = "Sample Ticket";
  const price = 100.5;

  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.testUserSignUp())
    .send({
      title: title,
      price: price,
    })
    .expect(201);

  const ticketGETResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send()
    .expect(200);

  expect(ticketGETResponse.body.title).toEqual(title);
  expect(ticketGETResponse.body.price).toEqual(price);
});
