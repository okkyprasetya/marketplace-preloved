import { model, models, Schema, Types, type InferSchemaType, type Model } from "mongoose";

export const orderStatuses = ["PENDING_PAYMENT", "PAID"] as const;
export type OrderStatus = (typeof orderStatuses)[number];

const orderSchema = new Schema(
  {
    buyerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: orderStatuses,
      default: "PENDING_PAYMENT",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

export type OrderDocument = InferSchemaType<typeof orderSchema> & {
  _id: Types.ObjectId;
};

export const Order =
  (models.Order as Model<OrderDocument> | undefined) ??
  model<OrderDocument>("Order", orderSchema);
