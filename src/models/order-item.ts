import { model, models, Schema, Types, type InferSchemaType, type Model } from "mongoose";

const orderItemSchema = new Schema(
  {
    orderId: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      index: true,
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    productName: {
      type: String,
      required: true,
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
  },
);

export type OrderItemDocument = InferSchemaType<typeof orderItemSchema> & {
  _id: Types.ObjectId;
};

export const OrderItem =
  (models.OrderItem as Model<OrderItemDocument> | undefined) ??
  model<OrderItemDocument>("OrderItem", orderItemSchema);
