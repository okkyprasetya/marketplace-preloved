import { apiError, apiSuccess } from "@/lib/api-response";
import { requireRole } from "@/lib/authorization";
import { updateCartItemSchema } from "@/lib/validation/cart";
import { deleteCartItem, getCart, updateCartQuantity } from "@/services/cart-service";

type CartItemRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(request: Request, context: CartItemRouteContext) {
  const session = await requireRole("buyer");

  if (!session) {
    return apiError("Buyer access is required", ["Unauthorized"], 401);
  }

  const { id } = await context.params;
  const payload = await request.json().catch(() => null);
  const parsed = updateCartItemSchema.safeParse(payload);

  if (!parsed.success) {
    return apiError(
      "Invalid quantity",
      parsed.error.errors.map((error) => error.message),
      400,
    );
  }

  try {
    const updated = await updateCartQuantity(session.user.id, id, parsed.data.quantity);

    if (!updated) {
      return apiError("Cart item not found", ["Not found"], 404);
    }

    const cart = await getCart(session.user.id);

    return apiSuccess("Cart item updated", { cart });
  } catch (error) {
    console.error("Failed to update cart item", error);
    return apiError("Failed to update cart item", ["Server error"], 500);
  }
}

export async function DELETE(_request: Request, context: CartItemRouteContext) {
  const session = await requireRole("buyer");

  if (!session) {
    return apiError("Buyer access is required", ["Unauthorized"], 401);
  }

  const { id } = await context.params;

  try {
    const deleted = await deleteCartItem(session.user.id, id);

    if (!deleted) {
      return apiError("Cart item not found", ["Not found"], 404);
    }

    const cart = await getCart(session.user.id);

    return apiSuccess("Cart item removed", { cart });
  } catch (error) {
    console.error("Failed to remove cart item", error);
    return apiError("Failed to remove cart item", ["Server error"], 500);
  }
}
