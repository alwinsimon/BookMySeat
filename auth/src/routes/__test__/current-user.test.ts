import request from "supertest";

import { app } from "../../app";
import { response } from "express";

it("Current-User Route Test: Check for Valid User Data Return - Returns current user data on success.", async () => {
  // Sign-Up to Create a New User
  const signUpResponse = await request(app)
    .post("/api/users/signup")
    .send({
      email: "tester@test.com",
      password: "password@123",
    })
    .expect(201);
  const cookieFromSignUp = signUpResponse.get("Set-Cookie");
  // GET request to current user route
  const response = await request(app)
    .get("/api/users/currentuser")
    .set("Cookie", cookieFromSignUp)
    .send()
    .expect(200);
  expect(response.body.currentUser.email).toEqual("tester@test.com");
});
