import { apiError, apiSuccess } from "@/lib/api-response";
import { requireRole } from "@/lib/authorization";
import { productSchema } from "@/lib/validation/product";
import {
  deleteProductForSeller,
  getSellerProduct,
  updateProductForSeller,
} from "@/services/product-service";

type SellerProductRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_request: Request, context: SellerProductRouteContext) {
  const session = await requireRole("seller");

  if (!session) {
    return apiError("Seller access is required", ["Unauthorized"], 401);
  }

  const { id } = await context.params;

  try {
    const product = await getSellerProduct(session.user.id, id);

    if (!product) {
      return apiError("Product not found", ["Not found"], 404);
    }

    return apiSuccess("Seller product loaded", { product });
  } catch (error) {
    console.error("Failed to load seller product", error);
    return apiError("Failed to load seller product", ["Server error"], 500);
  }
}

export async function PATCH(request: Request, context: SellerProductRouteContext) {
  const session = await requireRole("seller");

  if (!session) {
    return apiError("Seller access is required", ["Unauthorized"], 401);
  }

  const { id } = await context.params;
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
    const product = await updateProductForSeller(session.user.id, id, parsed.data);

    if (!product) {
      return apiError("Product not found", ["Not found"], 404);
    }

    return apiSuccess("Product updated", { product });
  } catch (error) {
    console.error("Failed to update product", error);
    return apiError("Failed to update product", ["Server error"], 500);
  }
}

export async function DELETE(_request: Request, context: SellerProductRouteContext) {
  const session = await requireRole("seller");

  if (!session) {
    return apiError("Seller access is required", ["Unauthorized"], 401);
  }

  const { id } = await context.params;

  try {
    const deleted = await deleteProductForSeller(session.user.id, id);

    if (!deleted) {
      return apiError("Product not found", ["Not found"], 404);
    }

    return apiSuccess("Product deleted", { id });
  } catch (error) {
    console.error("Failed to delete product", error);
    return apiError("Failed to delete product", ["Server error"], 500);
  }
}
