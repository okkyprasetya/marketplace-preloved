import {
  createSellerProduct,
  findProductById,
  findProducts,
  findProductsBySeller,
  findSellerProductById,
  softDeleteSellerProduct,
  updateSellerProduct,
  type ProductCatalogRecord,
} from "@/repositories/product-repository";
import type { ProductInput } from "@/lib/validation/product";
import type { ProductDocument } from "@/models/product";

export type ProductListItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  seller: {
    id: string;
    name: string;
  };
  createdAt: string;
};

export type ProductDetail = ProductListItem & {
  updatedAt: string;
};

export type SellerProduct = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
};

function mapProductRecord(record: ProductCatalogRecord): ProductDetail {
  return {
    id: record._id.toString(),
    name: record.name,
    description: record.description,
    price: record.price,
    imageUrl: record.imageUrl,
    seller: {
      id: record.seller.toString(),
      name: record.sellerName ?? "Unknown seller",
    },
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
}

function mapSellerProduct(product: ProductDocument): SellerProduct {
  return {
    id: product._id.toString(),
    name: product.name,
    description: product.description,
    price: product.price,
    imageUrl: product.imageUrl,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
  };
}

export async function listProducts(query?: string): Promise<ProductListItem[]> {
  const products = await findProducts({ query });

  return products.map((product) => {
    const detail = mapProductRecord(product);

    return {
      id: detail.id,
      name: detail.name,
      description: detail.description,
      price: detail.price,
      imageUrl: detail.imageUrl,
      seller: detail.seller,
      createdAt: detail.createdAt,
    };
  });
}

export async function getProductDetail(id: string): Promise<ProductDetail | null> {
  const product = await findProductById(id);

  if (!product) {
    return null;
  }

  return mapProductRecord(product);
}

export async function listSellerProducts(sellerId: string): Promise<SellerProduct[]> {
  const products = await findProductsBySeller(sellerId);

  return products.map(mapSellerProduct);
}

export async function getSellerProduct(
  sellerId: string,
  productId: string,
): Promise<SellerProduct | null> {
  const product = await findSellerProductById(sellerId, productId);

  return product ? mapSellerProduct(product) : null;
}

export async function createProductForSeller(
  sellerId: string,
  input: ProductInput,
): Promise<SellerProduct> {
  const product = await createSellerProduct(sellerId, input);

  return mapSellerProduct(product);
}

export async function updateProductForSeller(
  sellerId: string,
  productId: string,
  input: ProductInput,
): Promise<SellerProduct | null> {
  const product = await updateSellerProduct(sellerId, productId, input);

  return product ? mapSellerProduct(product) : null;
}

export async function deleteProductForSeller(
  sellerId: string,
  productId: string,
): Promise<boolean> {
  const product = await softDeleteSellerProduct(sellerId, productId);

  return Boolean(product);
}
