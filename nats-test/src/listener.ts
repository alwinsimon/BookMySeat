import nats, { Message } from "node-nats-streaming";
import { randomBytes } from "crypto";

// Generate Random Name for listener so that multiple instances of the same listener can be instantiated.
const listenerName = "Listner--" + randomBytes(4).toString("hex");

const stan = nats.connect("ticketing", listenerName, {
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  console.log(`Listener: ${listenerName} ==> Connected to NATS`);

  stan.on("close", () => {
    console.log(`NATS Connection of Listener: ${listenerName} closed !!!`);

    process.exit();
  });

  const serviceQueueGroup = "order-service-queue-group";
  const durableName = "order-service-durable-name";

  const subscriptionOptions = stan
    .subscriptionOptions()
    .setManualAckMode(true)
    .setDeliverAllAvailable()
    .setDurableName(durableName);

  const subscription = stan.subscribe(
    "ticket:created",
    serviceQueueGroup,
    subscriptionOptions
  );

  subscription.on("message", (msg: Message) => {
    console.log(`Message received: ${msg.getSubject()}`);

    const data = msg.getData();

    if (typeof data === "string") {
      console.log(
        `Received Event #${msg.getSequence()} in Service Queue Group: ${serviceQueueGroup}, with data: ${data}`
      );
    }

    msg.ack();
  });
});

process.on("SIGINT", () => stan.close());
process.on("SIGTERM", () => stan.close());
