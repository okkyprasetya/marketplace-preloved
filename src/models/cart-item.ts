import { model, models, Schema, Types, type InferSchemaType, type Model } from "mongoose";

const cartItemSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
  },
  {
    timestamps: true,
  },
);

cartItemSchema.index({ userId: 1, productId: 1 }, { unique: true });

export type CartItemDocument = InferSchemaType<typeof cartItemSchema> & {
  _id: Types.ObjectId;
};

export const CartItem =
  (models.CartItem as Model<CartItemDocument> | undefined) ??
  model<CartItemDocument>("CartItem", cartItemSchema);
