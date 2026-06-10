import { apiError, apiSuccess } from "@/lib/api-response";
import { requireRole } from "@/lib/authorization";
import { checkoutCart } from "@/services/order-service";

export async function POST() {
  const session = await requireRole("buyer");

  if (!session) {
    return apiError("Buyer access is required", ["Unauthorized"], 401);
  }

  try {
    const order = await checkoutCart(session.user.id);

    if (!order) {
      return apiError("Cart is empty", ["Add products before checkout"], 400);
    }

    return apiSuccess("Order created", { order }, 201);
  } catch (error) {
    console.error("Failed to create order", error);
    return apiError("Failed to create order", ["Server error"], 500);
  }
}
