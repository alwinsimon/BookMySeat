import nats, { Message } from "node-nats-streaming";
import { randomBytes } from "crypto";

// Generate Random Name for listener so that multiple instances of the same listener can be instantiated.
const listenerName = "Listner--" + randomBytes(4).toString("hex");

const stan = nats.connect("ticketing", listenerName, {
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  console.log(`Listener: ${listenerName} ==> Connected to NATS`);

  const serviceQueueGroup = "order-service-queue-group";

  const subscription = stan.subscribe("ticket:created", serviceQueueGroup);

  subscription.on("message", (msg: Message) => {
    console.log(`Message received: ${msg.getSubject()}`);

    const data = msg.getData();

    if (typeof data === "string") {
      console.log(
        `Received Event #${msg.getSequence()} in Service Queue Group: ${serviceQueueGroup}, with data: ${data}`
      );
    }
  });
});
