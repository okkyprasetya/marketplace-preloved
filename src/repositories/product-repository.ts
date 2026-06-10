import { Types, type FilterQuery, type PipelineStage } from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import { Product, type ProductDocument } from "@/models/product";
import type { ProductInput } from "@/lib/validation/product";

export type ProductSearchParams = {
  query?: string;
  limit?: number;
};

export type ProductCatalogRecord = {
  _id: Types.ObjectId;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  seller: Types.ObjectId;
  sellerName: string | null;
  createdAt: Date;
  updatedAt: Date;
};

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildSearchMatch(query?: string): FilterQuery<ProductDocument> {
  const trimmedQuery = query?.trim();
  const baseMatch: FilterQuery<ProductDocument> = { isDeleted: { $ne: true } };

  if (!trimmedQuery) {
    return baseMatch;
  }

  const searchRegex = new RegExp(escapeRegex(trimmedQuery), "i");

  return {
    ...baseMatch,
    $or: [{ name: searchRegex }, { description: searchRegex }],
  };
}

function productProjectionPipeline(): PipelineStage[] {
  return [
    {
      $lookup: {
        from: "users",
        localField: "seller",
        foreignField: "_id",
        as: "sellerRecord",
      },
    },
    {
      $unwind: {
        path: "$sellerRecord",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        name: 1,
        description: 1,
        price: 1,
        imageUrl: 1,
        seller: 1,
        createdAt: 1,
        updatedAt: 1,
        sellerName: "$sellerRecord.name",
      },
    },
  ];
}

export async function findProducts({
  query,
  limit = 24,
}: ProductSearchParams = {}) {
  await connectToDatabase();

  const safeLimit = Math.min(Math.max(limit, 1), 60);
  const pipeline: PipelineStage[] = [
    { $match: buildSearchMatch(query) },
    { $sort: { createdAt: -1 } },
    { $limit: safeLimit },
    ...productProjectionPipeline(),
  ];

  return Product.aggregate<ProductCatalogRecord>(pipeline);
}

export async function findProductById(id: string) {
  if (!Types.ObjectId.isValid(id)) {
    return null;
  }

  await connectToDatabase();

  const [product] = await Product.aggregate<ProductCatalogRecord>([
    { $match: { _id: new Types.ObjectId(id), isDeleted: { $ne: true } } },
    ...productProjectionPipeline(),
    { $limit: 1 },
  ]);

  return product ?? null;
}

export async function findProductsBySeller(sellerId: string) {
  await connectToDatabase();

  return Product.find({
    seller: new Types.ObjectId(sellerId),
    isDeleted: { $ne: true },
  })
    .sort({ createdAt: -1 })
    .lean<ProductDocument[]>();
}

export async function createSellerProduct(sellerId: string, input: ProductInput) {
  await connectToDatabase();

  return Product.create({
    ...input,
    seller: new Types.ObjectId(sellerId),
  });
}

export async function updateSellerProduct(
  sellerId: string,
  productId: string,
  input: ProductInput,
) {
  if (!Types.ObjectId.isValid(productId)) {
    return null;
  }

  await connectToDatabase();

  return Product.findOneAndUpdate(
    {
      _id: new Types.ObjectId(productId),
      seller: new Types.ObjectId(sellerId),
      isDeleted: { $ne: true },
    },
    { $set: input },
    { new: true },
  ).lean<ProductDocument>();
}

export async function softDeleteSellerProduct(sellerId: string, productId: string) {
  if (!Types.ObjectId.isValid(productId)) {
    return null;
  }

  await connectToDatabase();

  return Product.findOneAndUpdate(
    {
      _id: new Types.ObjectId(productId),
      seller: new Types.ObjectId(sellerId),
      isDeleted: { $ne: true },
    },
    { $set: { isDeleted: true } },
    { new: true },
  ).lean<ProductDocument>();
}

export async function findSellerProductById(sellerId: string, productId: string) {
  if (!Types.ObjectId.isValid(productId)) {
    return null;
  }

  await connectToDatabase();

  return Product.findOne({
    _id: new Types.ObjectId(productId),
    seller: new Types.ObjectId(sellerId),
    isDeleted: { $ne: true },
  }).lean<ProductDocument>();
}
