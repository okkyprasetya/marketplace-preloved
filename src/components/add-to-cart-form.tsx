"use client";

import { ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type AddToCartFormProps = {
  productId: string;
  canAddToCart: boolean;
};

type CartResponse = {
  success: boolean;
  message: string;
  errors?: string[];
};

export function AddToCartForm({ productId, canAddToCart }: AddToCartFormProps) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function addToCart() {
    if (!canAddToCart) {
      router.push("/login?callbackUrl=/products");
      return;
    }

    setIsSubmitting(true);
    const response = await fetch("/api/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productId, quantity }),
    });
    const payload = (await response.json().catch(() => null)) as CartResponse | null;
    setIsSubmitting(false);

    if (!response.ok || !payload?.success) {
      toast.error(payload?.errors?.[0] ?? payload?.message ?? "Product could not be added");
      return;
    }

    toast.success(payload.message);
    router.refresh();
  }

  return (
    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
      <Input
        aria-label="Quantity"
        className="sm:w-24"
        min="1"
        onChange={(event) => setQuantity(Number(event.target.value))}
        type="number"
        value={quantity}
      />
      <Button disabled={isSubmitting} onClick={addToCart} type="button">
        <ShoppingCart aria-hidden="true" className="size-4" />
        {isSubmitting ? "Adding..." : "Add to cart"}
      </Button>
    </div>
  );
}
