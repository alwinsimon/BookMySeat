import nats from "node-nats-streaming";
import { randomBytes } from "crypto";
import { TicketCreatedListener } from "./events/ticket-created-listener";

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

  new TicketCreatedListener(stan).listen();
});

process.on("SIGINT", () => stan.close());
process.on("SIGTERM", () => stan.close());
