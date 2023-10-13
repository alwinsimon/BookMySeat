import { Stan } from "node-nats-streaming";
import { Subjects } from "../event-subjects/subjects";

interface Event {
  subject: Subjects;
  data: any;
}

export abstract class Publisher<T extends Event> {
  // Abstract properties that the sub-class SHOULD implement.
  abstract subject: T["subject"];

  // Private properties that can be modified only within this class.
  private client: Stan;

  constructor(client: Stan) {
    this.client = client;
  }

  publish(data: T["data"]): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client.publish(this.subject, JSON.stringify(data), (err) => {
        if (err) {
          return reject(err);
        }

        console.log(
          `Published event in channel: ${this.subject} with Data:`,
          data
        );

        resolve();
      });
    });
  }
}
