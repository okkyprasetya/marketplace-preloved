"use client";

import { CreditCard, Minus, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { CartSummary } from "@/services/cart-service";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

type CartItemsProps = {
  cart: CartSummary;
};

type CartMutationResponse = {
  success: boolean;
  message: string;
  errors?: string[];
};

export function CartItems({ cart }: CartItemsProps) {
  const router = useRouter();
  const [pendingId, setPendingId] = useState<string | null>(null);

  async function mutateCartItem(
    cartItemId: string,
    options: {
      method: "PATCH" | "DELETE";
      quantity?: number;
    },
  ) {
    setPendingId(cartItemId);
    const response = await fetch(`/api/cart/${cartItemId}`, {
      method: options.method,
      headers:
        options.method === "PATCH"
          ? {
              "Content-Type": "application/json",
            }
          : undefined,
      body: options.method === "PATCH" ? JSON.stringify({ quantity: options.quantity }) : undefined,
    });
    const payload = (await response.json().catch(() => null)) as CartMutationResponse | null;
    setPendingId(null);

    if (!response.ok || !payload?.success) {
      toast.error(payload?.errors?.[0] ?? payload?.message ?? "Cart could not be updated");
      return;
    }

    toast.success(payload.message);
    router.refresh();
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-4">
        {cart.items.map((item) => (
          <article
            className="grid gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:grid-cols-[120px_1fr]"
            key={item.id}
          >
            <div
              aria-label={item.product.name}
              className="aspect-square rounded-md bg-gray-100 bg-cover bg-center"
              role="img"
              style={{ backgroundImage: `url("${item.product.imageUrl}")` }}
            />
            <div className="min-w-0">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="font-semibold text-gray-950">{item.product.name}</h2>
                  <p className="mt-1 line-clamp-2 text-sm leading-5 text-gray-600">
                    {item.product.description}
                  </p>
                </div>
                <p className="font-semibold text-orange-600">
                  {currencyFormatter.format(item.product.price)}
                </p>
              </div>
              <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center rounded-md border border-gray-300">
                  <Button
                    disabled={pendingId === item.id || item.quantity <= 1}
                    onClick={() =>
                      mutateCartItem(item.id, {
                        method: "PATCH",
                        quantity: item.quantity - 1,
                      })
                    }
                    size="sm"
                    type="button"
                    variant="ghost"
                  >
                    <Minus aria-hidden="true" className="size-4" />
                  </Button>
                  <span className="w-12 text-center text-sm font-semibold">{item.quantity}</span>
                  <Button
                    disabled={pendingId === item.id}
                    onClick={() =>
                      mutateCartItem(item.id, {
                        method: "PATCH",
                        quantity: item.quantity + 1,
                      })
                    }
                    size="sm"
                    type="button"
                    variant="ghost"
                  >
                    <Plus aria-hidden="true" className="size-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-sm font-semibold text-gray-950">
                    Subtotal {currencyFormatter.format(item.subtotal)}
                  </p>
                  <Button
                    disabled={pendingId === item.id}
                    onClick={() => mutateCartItem(item.id, { method: "DELETE" })}
                    size="sm"
                    type="button"
                    variant="outline"
                  >
                    <Trash2 aria-hidden="true" className="size-4" />
                    Remove
                  </Button>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      <aside className="h-fit rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-950">Cart summary</h2>
        <div className="mt-5 space-y-3 text-sm">
          {cart.items.map((item) => (
            <div className="flex justify-between gap-4" key={item.id}>
              <span className="text-gray-600">
                {item.product.name} x {item.quantity}
              </span>
              <span className="font-semibold text-gray-950">
                {currencyFormatter.format(item.subtotal)}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-5 flex justify-between border-t border-gray-200 pt-5 text-base font-bold text-gray-950">
          <span>Total</span>
          <span>{currencyFormatter.format(cart.total)}</span>
        </div>
        <Button asChild className="mt-5 w-full">
          <Link href="/checkout">
            <CreditCard aria-hidden="true" className="size-4" />
            Checkout
          </Link>
        </Button>
      </aside>
    </section>
  );
}
