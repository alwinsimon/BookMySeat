import { Stan } from "node-nats-streaming";
import { Subjects } from "./subjects";

interface Event {
  subject: Subjects;
  data: any;
}

export abstract class Publisher<T extends Event> {
  // Abstract properties that the sub-class SHOULD implement.
  abstract subject: T["subject"];
  abstract onEventPublish(subject: T["subject"], data: T["data"]): void;

  // Private properties that can be modified only within this class.
  private client: Stan;

  constructor(client: Stan) {
    this.client = client;
  }

  publish(data: T["data"]) {
    this.client.publish(this.subject, JSON.stringify(data), () => {
      console.log(`Publish event in channel: ${this.subject} with Data:`, data);
    });
  }
}
