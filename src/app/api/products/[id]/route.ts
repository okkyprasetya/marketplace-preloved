import { NextResponse } from "next/server";
import { getProductDetail } from "@/services/product-service";

type ProductRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_request: Request, context: ProductRouteContext) {
  const { id } = await context.params;

  try {
    const product = await getProductDetail(id);

    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ product });
  } catch (error) {
    console.error("Failed to load product", error);

    return NextResponse.json(
      { message: "Failed to load product" },
      { status: 500 },
    );
  }
}
