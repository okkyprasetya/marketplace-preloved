"use client";

import { CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type PayNowButtonProps = {
  orderId: string;
  disabled?: boolean;
};

type PaymentResponse = {
  success: boolean;
  message: string;
  errors?: string[];
};

export function PayNowButton({ orderId, disabled = false }: PayNowButtonProps) {
  const router = useRouter();
  const [isPaying, setIsPaying] = useState(false);

  async function payNow() {
    setIsPaying(true);
    const response = await fetch(`/api/payment/${orderId}`, {
      method: "POST",
    });
    const payload = (await response.json().catch(() => null)) as PaymentResponse | null;
    setIsPaying(false);

    if (!response.ok || !payload?.success) {
      toast.error(payload?.errors?.[0] ?? payload?.message ?? "Payment failed");
      return;
    }

    toast.success(payload.message);
    router.push(`/invoice/${orderId}`);
    router.refresh();
  }

  return (
    <Button disabled={disabled || isPaying} onClick={payNow} type="button">
      <CheckCircle2 aria-hidden="true" className="size-4" />
      {isPaying ? "Processing..." : "Pay now"}
    </Button>
  );
}
