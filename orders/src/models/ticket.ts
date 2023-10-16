import mongoose from "mongoose";

// An interface that describes the properties that are required to create a new Ticket
interface TicketAttrs {
  title: string;
  price: number;
}

// An interface that describes the properties that a Ticket Document has.
export interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
}

// An interface that decribes the properties that a Ticket Model has.
interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attributes: TicketAttrs): TicketDoc;
}

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      min: 0,
      required: true,
    }
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

ticketSchema.statics.build = (attributes: TicketAttrs) => {
  return new Ticket(attributes);
};

const Ticket = mongoose.model<TicketDoc, TicketModel>("Order", ticketSchema);

export { Ticket };
