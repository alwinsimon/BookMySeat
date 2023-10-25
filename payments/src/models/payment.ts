import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

// An interface that describes the properties that are required to create a new Payment
interface PaymentAttrs {
  orderId: string;
  stripeId: string;
}

// An interface that describes the properties that a Payment Document has.
interface PaymentDoc extends mongoose.Document {
  orderId: string;
  stripeId: string;
  version: number;
}

// An interface that describes the properties that a Payment Model has.
interface PaymentModel extends mongoose.Model<PaymentDoc> {
  build(attributes: PaymentAttrs): PaymentDoc;
}

const paymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
    },
    stripeId: {
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
paymentSchema.set("versionKey", "version");

// Add the update-if-current plugin to the schema for automatic version based document updations.
paymentSchema.plugin(updateIfCurrentPlugin);

paymentSchema.statics.build = (attributes: PaymentAttrs) => {
  return new Payment({
    orderId: attributes.orderId,
    stripeId: attributes.stripeId,
  });
};

const Payment = mongoose.model<PaymentDoc, PaymentModel>(
  "Payment",
  paymentSchema
);

export { Payment };
