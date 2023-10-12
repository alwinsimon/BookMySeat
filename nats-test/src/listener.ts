import nats, { Message } from "node-nats-streaming";
import { randomBytes } from "crypto";

const stan = nats.connect("ticketing", randomBytes(4).toString('hex'), {
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  console.log("Listener connected to NATS");

  const subscription = stan.subscribe("ticket:created");

  subscription.on("message", (msg: Message) => {
    console.log(`Message received: ${msg.getSubject()}`);

    const data = msg.getData();

    if (typeof data === "string") {
      console.log(
        `Received Event #${msg.getSequence()}, with data: ${data}`
      );
    }
  });
});
