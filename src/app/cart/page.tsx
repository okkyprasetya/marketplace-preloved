import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { CartItems } from "@/components/cart-items";
import { Button } from "@/components/ui/button";
import { getCart, type CartSummary } from "@/services/cart-service";

export const dynamic = "force-dynamic";

export default async function CartPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=/cart");
  }

  if (session.user.role !== "buyer") {
    redirect("/");
  }

  let cart: CartSummary = { items: [], total: 0 };
  let errorMessage: string | null = null;

  try {
    cart = await getCart(session.user.id);
  } catch {
    errorMessage = "Cart is unavailable. Configure MONGODB_URI to load cart data.";
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-orange-600">
          Shopping cart
        </p>
        <h1 className="mt-2 text-3xl font-bold text-gray-950">Your cart</h1>
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
            Add products from the catalog to review quantities and totals here.
          </p>
          <Button asChild className="mt-5">
            <Link href="/products">Browse products</Link>
          </Button>
        </section>
      ) : null}

      {cart.items.length > 0 ? <CartItems cart={cart} /> : null}
    </main>
  );
}
