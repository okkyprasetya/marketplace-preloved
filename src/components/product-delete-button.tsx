"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type ProductDeleteButtonProps = {
  productId: string;
};

type DeleteResponse = {
  success: boolean;
  message: string;
  errors?: string[];
};

export function ProductDeleteButton({ productId }: ProductDeleteButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  async function deleteProduct() {
    const confirmed = window.confirm("Delete this product?");

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);
    const response = await fetch(`/api/seller/products/${productId}`, {
      method: "DELETE",
    });
    const payload = (await response.json().catch(() => null)) as DeleteResponse | null;
    setIsDeleting(false);

    if (!response.ok || !payload?.success) {
      toast.error(payload?.errors?.[0] ?? payload?.message ?? "Product could not be deleted");
      return;
    }

    toast.success(payload.message);
    router.refresh();
  }

  return (
    <Button disabled={isDeleting} onClick={deleteProduct} size="sm" type="button" variant="outline">
      <Trash2 aria-hidden="true" className="size-4" />
      {isDeleting ? "Deleting..." : "Delete"}
    </Button>
  );
}
