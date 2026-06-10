"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { productSchema, type ProductInput } from "@/lib/validation/product";
import type { SellerProduct } from "@/services/product-service";

type ProductFormProps = {
  product?: SellerProduct;
};

type ApiMutationResponse = {
  success: boolean;
  message: string;
  errors?: string[];
};

export function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const isEditing = Boolean(product);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProductInput>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name ?? "",
      description: product?.description ?? "",
      price: product?.price ?? 1,
      imageUrl: product?.imageUrl ?? "",
    },
  });

  async function onSubmit(values: ProductInput) {
    setServerError(null);

    const response = await fetch(
      isEditing && product ? `/api/seller/products/${product.id}` : "/api/seller/products",
      {
        method: isEditing ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      },
    );

    const payload = (await response.json().catch(() => null)) as ApiMutationResponse | null;

    if (!response.ok || !payload?.success) {
      setServerError(payload?.errors?.[0] ?? payload?.message ?? "Product could not be saved");
      return;
    }

    toast.success(payload.message);
    router.push("/seller/products");
    router.refresh();
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <Label htmlFor="name">Name</Label>
        <Input className="mt-2" id="name" {...register("name")} />
        {errors.name ? <p className="mt-1 text-sm text-red-600">{errors.name.message}</p> : null}
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <textarea
          className="mt-2 min-h-32 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-950 outline-none ring-orange-500 transition-colors placeholder:text-gray-400 focus:ring-2"
          id="description"
          {...register("description")}
        />
        {errors.description ? (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        ) : null}
      </div>

      <div>
        <Label htmlFor="price">Price</Label>
        <Input
          className="mt-2"
          id="price"
          min="0"
          step="0.01"
          type="number"
          {...register("price")}
        />
        {errors.price ? <p className="mt-1 text-sm text-red-600">{errors.price.message}</p> : null}
      </div>

      <div>
        <Label htmlFor="imageUrl">Image URL</Label>
        <Input className="mt-2" id="imageUrl" type="url" {...register("imageUrl")} />
        {errors.imageUrl ? (
          <p className="mt-1 text-sm text-red-600">{errors.imageUrl.message}</p>
        ) : null}
      </div>

      {serverError ? (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{serverError}</p>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <Button disabled={isSubmitting} type="submit">
          {isSubmitting ? "Saving..." : isEditing ? "Save changes" : "Create product"}
        </Button>
        <Button asChild type="button" variant="outline">
          <a href="/seller/products">Cancel</a>
        </Button>
      </div>
    </form>
  );
}
