import { Types, type PipelineStage } from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import { CartItem } from "@/models/cart-item";
import { Product } from "@/models/product";

export type CartProductRecord = {
  _id: Types.ObjectId;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
};

export type CartItemRecord = {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  productId: Types.ObjectId;
  quantity: number;
  product: CartProductRecord;
  createdAt: Date;
  updatedAt: Date;
};

function cartLookupPipeline(): PipelineStage[] {
  return [
    {
      $lookup: {
        from: "products",
        localField: "productId",
        foreignField: "_id",
        as: "product",
      },
    },
    {
      $unwind: "$product",
    },
    {
      $match: {
        "product.isDeleted": { $ne: true },
      },
    },
    {
      $project: {
        userId: 1,
        productId: 1,
        quantity: 1,
        createdAt: 1,
        updatedAt: 1,
        product: {
          _id: "$product._id",
          name: "$product.name",
          description: "$product.description",
          price: "$product.price",
          imageUrl: "$product.imageUrl",
        },
      },
    },
  ];
}

export async function findCartItemsByUser(userId: string) {
  await connectToDatabase();

  return CartItem.aggregate<CartItemRecord>([
    { $match: { userId: new Types.ObjectId(userId) } },
    { $sort: { createdAt: -1 } },
    ...cartLookupPipeline(),
  ]);
}

export async function addCartItem(userId: string, productId: string, quantity: number) {
  if (!Types.ObjectId.isValid(productId)) {
    return null;
  }

  await connectToDatabase();

  const product = await Product.exists({
    _id: new Types.ObjectId(productId),
    isDeleted: { $ne: true },
  });

  if (!product) {
    return null;
  }

  await CartItem.findOneAndUpdate(
    {
      userId: new Types.ObjectId(userId),
      productId: new Types.ObjectId(productId),
    },
    { $inc: { quantity } },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  );

  return true;
}

export async function updateCartItemQuantity(
  userId: string,
  cartItemId: string,
  quantity: number,
) {
  if (!Types.ObjectId.isValid(cartItemId)) {
    return false;
  }

  await connectToDatabase();

  const item = await CartItem.findOneAndUpdate(
    {
      _id: new Types.ObjectId(cartItemId),
      userId: new Types.ObjectId(userId),
    },
    { $set: { quantity } },
    { new: true },
  );

  return Boolean(item);
}

export async function removeCartItem(userId: string, cartItemId: string) {
  if (!Types.ObjectId.isValid(cartItemId)) {
    return false;
  }

  await connectToDatabase();

  const result = await CartItem.deleteOne({
    _id: new Types.ObjectId(cartItemId),
    userId: new Types.ObjectId(userId),
  });

  return result.deletedCount === 1;
}
