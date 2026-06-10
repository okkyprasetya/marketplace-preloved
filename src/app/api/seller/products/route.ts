import { apiError, apiSuccess } from "@/lib/api-response";
import { requireRole } from "@/lib/authorization";
import { productSchema } from "@/lib/validation/product";
import {
  createProductForSeller,
  listSellerProducts,
} from "@/services/product-service";

export async function GET() {
  const session = await requireRole("seller");

  if (!session) {
    return apiError("Seller access is required", ["Unauthorized"], 401);
  }

  try {
    const products = await listSellerProducts(session.user.id);

    return apiSuccess("Seller products loaded", { products });
  } catch (error) {
    console.error("Failed to load seller products", error);
    return apiError("Failed to load seller products", ["Server error"], 500);
  }
}

export async function POST(request: Request) {
  const session = await requireRole("seller");

  if (!session) {
    return apiError("Seller access is required", ["Unauthorized"], 401);
  }

  const payload = await request.json().catch(() => null);
  const parsed = productSchema.safeParse(payload);

  if (!parsed.success) {
    return apiError(
      "Invalid product data",
      parsed.error.errors.map((error) => error.message),
      400,
    );
  }

  try {
    const product = await createProductForSeller(session.user.id, parsed.data);

    return apiSuccess("Product created", { product }, 201);
  } catch (error) {
    console.error("Failed to create product", error);
    return apiError("Failed to create product", ["Server error"], 500);
  }
}
