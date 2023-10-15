import { Message, Stan } from "node-nats-streaming";
import { EventSubjects } from "../event-subjects";

interface Event {
  subject: EventSubjects;
  data: any;
}

export abstract class Listener<T extends Event> {
  // Abstract properties that the sub-class SHOULD implement.
  abstract subject: T["subject"];
  abstract queueGroupName: string;
  abstract onMessage(data: T["data"], msg: Message): void;

  // Private properties that can be modified only within this class.
  private client: Stan;

  // Protected properties that can be modified by sub-classes if necessary.
  protected ackWait = 5 * 1000; //  Time is in milliseconds.

  constructor(client: Stan) {
    this.client = client;
  }

  subscriptionOptions() {
    return this.client
      .subscriptionOptions()
      .setDeliverAllAvailable()
      .setManualAckMode(true)
      .setAckWait(this.ackWait)
      .setDurableName(this.queueGroupName);
  }

  listen() {
    // Create a subscription using the client that was received by the constructor.
    const subscription = this.client.subscribe(
      this.subject,
      this.queueGroupName,
      this.subscriptionOptions()
    );

    subscription.on("message", (msg: Message) => {
      console.log(
        `Message #${msg.getSequence()} in channel ${
          this.subject
        } received by Queue Group: ${this.queueGroupName}.`
      );

      const parsedData = this.parseMessage(msg);

      this.onMessage(parsedData, msg);
    });
  }

  parseMessage(msg: Message) {
    const data = msg.getData();

    // Type of data received can be either string or Buffer. So parse it accordingly.
    if (typeof data === "string") {
      return JSON.parse(data);
    } else {
      // If the type of data is not a String, then it will be a Buffer, so we need to convert it to a JSON data.
      return JSON.parse(data.toString("utf-8"));
    }
  }
}
