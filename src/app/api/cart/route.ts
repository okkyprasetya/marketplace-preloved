import { apiError, apiSuccess } from "@/lib/api-response";
import { requireRole } from "@/lib/authorization";
import { addToCartSchema } from "@/lib/validation/cart";
import { addProductToCart, getCart } from "@/services/cart-service";

export async function GET() {
  const session = await requireRole("buyer");

  if (!session) {
    return apiError("Buyer access is required", ["Unauthorized"], 401);
  }

  try {
    const cart = await getCart(session.user.id);

    return apiSuccess("Cart loaded", { cart });
  } catch (error) {
    console.error("Failed to load cart", error);
    return apiError("Failed to load cart", ["Server error"], 500);
  }
}

export async function POST(request: Request) {
  const session = await requireRole("buyer");

  if (!session) {
    return apiError("Buyer access is required", ["Unauthorized"], 401);
  }

  const payload = await request.json().catch(() => null);
  const parsed = addToCartSchema.safeParse(payload);

  if (!parsed.success) {
    return apiError(
      "Invalid cart data",
      parsed.error.errors.map((error) => error.message),
      400,
    );
  }

  try {
    const added = await addProductToCart(
      session.user.id,
      parsed.data.productId,
      parsed.data.quantity,
    );

    if (!added) {
      return apiError("Product not found", ["Not found"], 404);
    }

    const cart = await getCart(session.user.id);

    return apiSuccess("Product added to cart", { cart }, 201);
  } catch (error) {
    console.error("Failed to add product to cart", error);
    return apiError("Failed to add product to cart", ["Server error"], 500);
  }
}
