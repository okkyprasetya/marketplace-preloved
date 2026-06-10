import { apiError, apiSuccess } from "@/lib/api-response";
import { requireRole } from "@/lib/authorization";
import { payBuyerOrder } from "@/services/order-service";

type PaymentRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(_request: Request, context: PaymentRouteContext) {
  const session = await requireRole("buyer");

  if (!session) {
    return apiError("Buyer access is required", ["Unauthorized"], 401);
  }

  const { id } = await context.params;

  try {
    const order = await payBuyerOrder(session.user.id, id);

    if (!order) {
      return apiError("Order not found", ["Not found"], 404);
    }

    return apiSuccess("Payment completed", { order });
  } catch (error) {
    console.error("Failed to process payment", error);
    return apiError("Failed to process payment", ["Server error"], 500);
  }
}
