"use client";

import { CreditCard } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type CheckoutResponse = {
  success: boolean;
  message: string;
  errors?: string[];
  data?: {
    order: {
      id: string;
    };
  };
};

export function CheckoutButton() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function checkout() {
    setIsSubmitting(true);
    const response = await fetch("/api/checkout", {
      method: "POST",
    });
    const payload = (await response.json().catch(() => null)) as CheckoutResponse | null;
    setIsSubmitting(false);

    if (!response.ok || !payload?.success || !payload.data?.order.id) {
      toast.error(payload?.errors?.[0] ?? payload?.message ?? "Checkout failed");
      return;
    }

    toast.success(payload.message);
    router.push(`/payment/${payload.data.order.id}`);
    router.refresh();
  }

  return (
    <Button disabled={isSubmitting} onClick={checkout} type="button">
      <CreditCard aria-hidden="true" className="size-4" />
      {isSubmitting ? "Creating order..." : "Create order"}
    </Button>
  );
}
