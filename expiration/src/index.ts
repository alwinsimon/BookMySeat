import { natsClient } from "./nats-client";

const startServer = async () => {
  // Server Configuration
  const PORT = 3000;
  const SERVICE_NAME = "TICKETS";

  // Check if ENV Variables exist
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

  } catch (err) {
    console.error(
      `Error Connecting ${SERVICE_NAME} Service to NATS CLUSTER: ${NATS_CLUSTER_ID}:`,
      err
    );
  }

};

startServer();
