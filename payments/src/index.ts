import mongoose from "mongoose";

import { app } from "./app";

import { natsClient } from "./nats-client";

import { OrderCreatedListener } from "./events/listeners/order-created-listener";
import { OrderCancelledListener } from "./events/listeners/order-cancelled-listener";

const startServer = async () => {
  // Tickets Server Configuration
  const PORT = 3000;
  const SERVICE_NAME = "PAYMENTS";

  // Check if ENV Variables exist
  if (!process.env.JWT_KEY) {
    throw new Error(`JWT_KEY must be defined in ${SERVICE_NAME} SERVICE !!!`);
  }
  if (!process.env.MONGO_DB_URI) {
    throw new Error(
      `MONGO_DB_URI must be defined in ${SERVICE_NAME} SERVICE !!!`
    );
  }

  if (!process.env.NATS_URL) {
    throw new Error(`NATS_URL must be defined in ${SERVICE_NAME} SERVICE !!!`);
  }

  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error(
      `NATS_CLUSTER_ID must be defined in ${SERVICE_NAME} SERVICE !!!`
    );
  }

  if (!process.env.NATS_CLIENT_ID) {
    throw new Error(
      `NATS_CLIENT_ID must be defined in ${SERVICE_NAME} SERVICE !!!`
    );
  }

  if (!process.env.STRIPE_KEY) {
    throw new Error(
      `STRIPE_KEY (Private API KEY) must be defined in ${SERVICE_NAME} SERVICE !!!`
    );
  }

  try {
    // ========================Connecting to Tickets DB========================
    await mongoose.connect(process.env.MONGO_DB_URI);
    console.log(`Connected to ${SERVICE_NAME} MongoDB successfully !!!!!`);
  } catch (err) {
    console.error(`Error Connecting to ${SERVICE_NAME} DB:`, err);
  }

  // NATS Client Configuration
  const NATS_CLUSTER_ID = process.env.NATS_CLUSTER_ID;
  const NATS_CLIENT_ID = process.env.NATS_CLIENT_ID;
  const NATS_CONNECTION_URL = process.env.NATS_URL;

  try {
    // ========================Connecting to NATS ========================
    await natsClient.connect(
      NATS_CLUSTER_ID,
      NATS_CLIENT_ID,
      NATS_CONNECTION_URL
    );
    console.log(
      `${SERVICE_NAME} Service Connected to NATS CLUSTER: ${NATS_CLUSTER_ID} successfully !!!!!`
    );

    /*
      Event listener which is used to listen for NATS Client Closing Event,
      which on occurrence will execute the callback function and will call process.exit(),
      which will terminate the entire NodeJs process and thereby terminate the container.
      This will make sure that at any point of time, the connection to NATS is lost,
      The entire NodeJs process is terminated properly.
    */
    natsClient.client.on("close", () => {
      console.log(`NATS Connection closed !!!!!`);

      process.exit();
    });

    // Invoking the NATS client close method on the situation where process running receives a SIGINT or SIGTERM message
    process.on("SIGINT", () => natsClient.client.close());
    process.on("SIGTERM", () => natsClient.client.close());

    // Event Listeners Initialization
    new OrderCreatedListener(natsClient.client).listen();
    new OrderCancelledListener(natsClient.client).listen();
  } catch (err) {
    console.error(
      `Error Connecting ${SERVICE_NAME} Service to NATS CLUSTER: ${NATS_CLUSTER_ID}:`,
      err
    );
  }

  // ========================Starting Tickets Server========================
  app.listen(PORT, () => {
    console.log(`${SERVICE_NAME} SERVICE listening on PORT: ${PORT} !!!!!`);
  });
};

startServer();
