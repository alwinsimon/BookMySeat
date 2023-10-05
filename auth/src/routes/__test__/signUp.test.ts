import request from "supertest";

import { app } from "../../app";

it("Sign-Up Route Test: Valid Credentials - Returns a 201 on successful sign-up.", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "tester@test.com",
      password: "password@123",
    })
    .expect(201);
});

it("Sign-Up Route Test: Invalid Email - Returns a 400 on success.", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "tester",
      password: "password@123",
    })
    .expect(400);
});

it("Sign-Up Route Test: Invalid Password - Returns a 400 on success.", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "tester",
      password: "123",
    })
    .expect(400);
});


it("Sign-Up Route Test: Missing Email or Password - Returns a 400 on success.", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "tester@test.com"
    })
    .expect(400);
  await request(app)
    .post("/api/users/signup")
    .send({
      password: "password@123",
    })
    .expect(400);
});


it("Sign-Up Route Test: Missing Email and Password - Returns a 400 on success.", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({})
    .expect(400);
});
