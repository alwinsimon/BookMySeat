import express from "express";
import "express-async-errors"; // Package used to handle async errors
import { json } from "body-parser";

import mongoose from "mongoose";

import { currentUserRouter } from "./routes/current-user";
import { signInRouter } from "./routes/signIn";
import { signOutRouter } from "./routes/signOut";
import { signUpRouter } from "./routes/signUp";

import { NotFoundError } from "./errors/not-found-error";
import { errorHandler } from "./middlewares/error-handler";

const app = express();

app.use(json());

const PORT = 3000;

app.use(currentUserRouter);
app.use(signInRouter);
app.use(signOutRouter);
app.use(signUpRouter);

// Resource Not Found Error Configuration
app.all("*", () => {
  throw new NotFoundError();
});

// Custom Error Handler Configuration
app.use(errorHandler);

const startAuthServer = async () => {
  try {
    // ========================Connecting to Auth DB========================
    await mongoose.connect("mongodb://auth-mongo-srv:27017/auth");
    console.log("Connected to Auth MongoDB successfully !!!!!");
  } catch (err) {
    console.error("Error Connecting to Auth DB:", err);
  }

  // ========================Starting Auth Server========================
  app.listen(PORT, () => {
    console.log(`AUTH SERVICE listening on PORT: ${PORT} !!!!!`);
  });
};

startAuthServer();
