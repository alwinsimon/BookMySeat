import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import jwt from "jsonwebtoken";

import { app } from "../app";

// Declaring the function testUserSignUp to the global scope so that it can be accessed anywhere within this application
declare global {
  var testUserSignUp: () => string[];
}

let mongo: any; // Declaring it in the beginning to avoid scope issues while using inside different functions.

// This function will be executed before starting the testing process.
beforeAll(async () => {
  // Setting environment variables in the test environment
  process.env.JWT_KEY = "testjwtKey";

  // Creating a instance of the Mongo Memory server to use as DB for Testing purposes
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri, {});
});

// This function is called before each test.
beforeEach(async () => {
  // Clearing all the collections existing in the DB before next test
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

// This function is called after all tests have finished.
afterAll(async () => {
  // Stop the instance of DB
  if (mongo) {
    await mongo.stop();
  }

  // Close the mongoose connection
  await mongoose.connection.close();
});

// Create a global function to be used in tests for sign-up a test user and get a cookie to be used in the test
// This avoids repetition of sign-up logic in multiple tests for obtaining cookie for authenticated user test.
global.testUserSignUp = () => {
  /*
    This function will mimmic the cookie creation by Auth Service and will return a string.
    This string can be used as the cookie for authentication in test environment.
  */

  // Build a Payload with { id, email } to create a JWT
  const payload = {
    id: "GFjytfKLUYG76r7568967IUYt876t087",
    email: "tester@test.com",
  };

  // Create a JWT with the payload
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // Build a Session Object with JWT. e.g. { jwt: MY_TOKEN }
  const session = { jwt: token };

  // Convert that session object into JSON
  const sessionJSON = JSON.stringify(session);

  // Take JSON and encode it as base64
  const base64EncodedSessionObject = Buffer.from(sessionJSON).toString("base64");

  // Return the base64 encoded string, which can be used as cookie with the data encoded.
  return [`session=${base64EncodedSessionObject}`];
};
