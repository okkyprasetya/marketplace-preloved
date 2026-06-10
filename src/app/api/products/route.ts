import { NextResponse } from "next/server";
import { listProducts } from "@/services/product-service";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") ?? undefined;

  try {
    const products = await listProducts(query);

    return NextResponse.json({ products });
  } catch (error) {
    console.error("Failed to load products", error);

    return NextResponse.json(
      { message: "Failed to load products" },
      { status: 500 },
    );
  }
}
