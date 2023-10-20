import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

// An interface that describes the properties that are required to create a new Ticket.
interface TicketAttrs {
  title: string;
  price: number;
  userId: string;
}

// An interface that describes the properties that a Ticket Model has after it is created in DB.
interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  userId: string;
  version: number;
}

// An interface that describes the properties that a Ticket Document has.
interface TicketModel extends mongoose.Model<TicketDoc> {
  build(ticketAttributes: TicketAttrs): TicketDoc;
}

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

// Modifying the default "__v" feild for version control in mongoose with "version"
ticketSchema.set("versionKey", "version");

// Add the update-if-current plugin to the schema for automatic version based document updations.
ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.statics.build = (ticketAttributes: TicketAttrs) => {
  return new Ticket(ticketAttributes);
};

const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", ticketSchema);

export { Ticket };
