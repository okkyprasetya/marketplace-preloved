import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { CheckoutButton } from "@/components/checkout-button";
import { Button } from "@/components/ui/button";
import { getCart, type CartSummary } from "@/services/cart-service";

export const dynamic = "force-dynamic";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export default async function CheckoutPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=/checkout");
  }

  if (session.user.role !== "buyer") {
    redirect("/");
  }

  let cart: CartSummary = { items: [], total: 0 };
  let errorMessage: string | null = null;

  try {
    cart = await getCart(session.user.id);
  } catch {
    errorMessage = "Checkout is unavailable. Configure MONGODB_URI to load cart data.";
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-orange-600">
          Checkout
        </p>
        <h1 className="mt-2 text-3xl font-bold text-gray-950">Review your order</h1>
      </div>

      {errorMessage ? (
        <section className="rounded-lg border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
          {errorMessage}
        </section>
      ) : null}

      {!errorMessage && cart.items.length === 0 ? (
        <section className="rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-xl font-semibold text-gray-950">Your cart is empty</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-600">
            Add products before creating an order.
          </p>
          <Button asChild className="mt-5">
            <Link href="/products">Browse products</Link>
          </Button>
        </section>
      ) : null}

      {cart.items.length > 0 ? (
        <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="divide-y divide-gray-200">
            {cart.items.map((item) => (
              <div className="flex justify-between gap-4 py-4 first:pt-0" key={item.id}>
                <div>
                  <p className="font-semibold text-gray-950">{item.product.name}</p>
                  <p className="mt-1 text-sm text-gray-600">
                    {item.quantity} x {currencyFormatter.format(item.product.price)}
                  </p>
                </div>
                <p className="font-semibold text-gray-950">
                  {currencyFormatter.format(item.subtotal)}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-6">
            <div>
              <p className="text-sm font-medium text-gray-500">Total</p>
              <p className="text-2xl font-bold text-orange-600">
                {currencyFormatter.format(cart.total)}
              </p>
            </div>
            <CheckoutButton />
          </div>
        </section>
      ) : null}
    </main>
  );
}
