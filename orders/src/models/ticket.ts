import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { Order, OrderStatus } from "./order";

// An interface that describes the properties that are required to create a new Ticket
interface TicketAttrs {
  id: string;
  title: string;
  price: number;
}

// An interface that describes the properties that a Ticket Document has.
export interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  version: number;
  isReserved(): Promise<boolean>;
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

ticketSchema.statics.build = (attributes: TicketAttrs) => {
  return new Ticket({
    _id: attributes.id,
    title: attributes.title,
    price: attributes.price,
  });
};

ticketSchema.methods.isReserved = async function () {
  const existingOrderWithSameTicket = await Order.findOne({
    ticket: this, // this keyword here refers to the ticket document we called the isReserved method.
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete,
      ],
    },
  });

  // Will return the a boolean value true if the ticket is already reserved and false otherwise.
  return !!existingOrderWithSameTicket;
};

const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", ticketSchema);

export { Ticket };
