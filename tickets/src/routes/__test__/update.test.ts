import request from "supertest";
import mongoose from "mongoose";

import { app } from "../../app";

import { natsClient } from "../../nats-client";

it("Tickets PUT Route Test: Returns 404 if the provided ticket Id dosen't exist in the DB.", async () => {
  // Make a ticket id which is similar to mongodb document id.
  const mockTicketId = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${mockTicketId}`)
    .set("Cookie", global.testUserSignUp())
    .send({
      title: "Sample Ticket - Modified",
      price: 100,
    })
    .expect(404);
});

it("Tickets PUT Route Test: Returns 401 if the User is not authenticated.", async () => {
  // Make a ticket id which is similar to mongodb document id.
  const mockTicketId = new mongoose.Types.ObjectId().toHexString();

  // Make request without authentication details (cookie)
  await request(app)
    .put(`/api/tickets/${mockTicketId}`)
    .send({
      title: "Sample Ticket - Modified",
      price: 100,
    })
    .expect(401);
});

it("Tickets PUT Route Test: Returns 401 if the User does not own the requested ticket.", async () => {
  const ticketTitle = "Sample Ticket";
  const modifiedTicketTitle = "Sample Ticket - Modified";

  // Make a valid request to create a new ticket
  const response = await request(app)
    .post(`/api/tickets/`)
    .set("Cookie", global.testUserSignUp())
    .send({
      title: ticketTitle,
      price: 100,
    })
    .expect(201);

  // Make a request as a different user to update the Ticket and expect a 401 - not authorised
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", global.testUserSignUp())
    .send({
      title: modifiedTicketTitle,
      price: 369,
    })
    .expect(401);

  // Make a request to retrive the first created ticket and make sure that ticket was not modified
  const ticketCheck = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send()
    .expect(200);

  expect(ticketCheck.body.title).toEqual(ticketTitle);
});

it("Tickets PUT Route Test: Returns 400 if the User provides a invalid title or price.", async () => {
  const ticketTitle = "Sample Ticket";
  const ticketPrice = 100;

  const invalidTicketTitle = "";
  const invalidTicketPrice = -250;

  // Make a cookie to get a consistent user
  const cookie = global.testUserSignUp();

  // Make a valid request to create a new ticket
  const response = await request(app)
    .post(`/api/tickets/`)
    .set("Cookie", cookie)
    .send({
      title: ticketTitle,
      price: ticketPrice,
    })
    .expect(201);

  // Make a request to update the Ticket with invalid title and expect a 400 - Bad Request
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: invalidTicketTitle,
      price: ticketPrice,
    })
    .expect(400);

  // Make a request to update the Ticket without title and expect a 400 - Bad Request
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      price: ticketPrice,
    })
    .expect(400);

  // Make a request to update the Ticket with invalid price and expect a 400 - Bad Request
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: ticketTitle,
      price: invalidTicketPrice,
    })
    .expect(400);

  // Make a request to update the Ticket without price and expect a 400 - Bad Request
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: ticketTitle,
    })
    .expect(400);
});

it("Tickets PUT Route Test: Updates the requested Ticket with valid inputs.", async () => {
  const ticketTitle = "Sample Ticket";
  const ticketPrice = 100;

  const modifiedTicketTitle = "Modified Ticket";
  const modifiedTicketPrice = 250;

  // Make a cookie to get a consistent user
  const cookie = global.testUserSignUp();

  // Make a valid request to create a new ticket
  const response = await request(app)
    .post(`/api/tickets/`)
    .set("Cookie", cookie)
    .send({
      title: ticketTitle,
      price: ticketPrice,
    })
    .expect(201);

  // Make a request to update the Ticket with valid title and expect a 200 - successful response
  const modifiedTicket = await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: modifiedTicketTitle,
      price: modifiedTicketPrice,
    })
    .expect(200);

  expect(modifiedTicket.body.title).toEqual(modifiedTicketTitle);
  expect(modifiedTicket.body.price).toEqual(modifiedTicketPrice);

  // Make a request to update the Ticket with invalid title and expect a 400 - Bad Request
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send()
    .expect(400);
});

it("Tickets PUT Route Test: /api/tickets Successfully Publishes a Ticket Updated Event When a Ticket is updated.", async () => {
  const ticketTitle = "Sample Ticket";
  const ticketPrice = 100;

  const modifiedTicketTitle = "Modified Ticket";
  const modifiedTicketPrice = 250;

  // Make a cookie to get a consistent user
  const cookie = global.testUserSignUp();

  // Make a valid request to create a new ticket
  const response = await request(app)
    .post(`/api/tickets/`)
    .set("Cookie", cookie)
    .send({
      title: ticketTitle,
      price: ticketPrice,
    })
    .expect(201);

  // Make a request to update the Ticket with valid title and expect a 200 - successful response
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: modifiedTicketTitle,
      price: modifiedTicketPrice,
    })
    .expect(200);

  expect(natsClient.client.publish).toHaveBeenCalled();
});
