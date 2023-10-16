import mongoose from "mongoose";
import { OrderStatus } from "@bookmyseat/common";

// Exporting OrderStstus from Order model so that it can be used with a single import statement in other files.
export { OrderStatus }

import { TicketDoc } from "./ticket";

// An interface that describes the properties that are required to create a new Order
interface OrderAttrs {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDoc;
}

// An interface that describes the properties that a Order Document has.
interface OrderDoc extends mongoose.Document {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDoc;
}

// An interface that decribes the properties that a Order Model has.
interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attributes: OrderAttrs): OrderDoc;
}

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      // Configuring mongoose to make sure that the status has the value specified in the enum
      enum: Object.values(OrderStatus),
      // Default value
      default: OrderStatus.Created,
      required: true,
    },
    expiresAt: {
      type: mongoose.Schema.Types.Date,
    },
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
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

orderSchema.statics.build = (attributes: OrderAttrs) => {
  return new Order(attributes);
};

const Order = mongoose.model<OrderDoc, OrderModel>("Order", orderSchema);

export { Order };
