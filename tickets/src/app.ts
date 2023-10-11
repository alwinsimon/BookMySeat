import express from "express";
import "express-async-errors"; // Package used to handle async errors
import { json } from "body-parser";
import cookieSession from "cookie-session";

import { errorHandler, NotFoundError, currentUser } from "@bookmyseat/common";

import { createTicketRouter } from "./routes/new";
import { showTicketRouter } from "./routes/show";
import { indexTicketRouter } from "./routes";

const app = express();

// Configuring express app to trust proxied requests from ingress-nginx.
app.set("trust proxy", true);

app.use(json());

app.use(
  cookieSession({
    signed: false, // To keep the data inside cookie un-encrypted.
    secure: process.env.NODE_ENV !== "test" /* To keep it a https only cookie.
    The value will be false in test environment to allow sending cookie over http also.*/,
  })
);

// Check all the request for cookie and if cookie exist, attach a currentUser property (with auth details) to the request object.
app.use(currentUser);

app.use(createTicketRouter);
app.use(showTicketRouter);
app.use(indexTicketRouter);

// Resource Not Found Error Configuration
app.all("*", () => {
  throw new NotFoundError();
});

// Custom Error Handler Configuration
app.use(errorHandler);

export { app };
