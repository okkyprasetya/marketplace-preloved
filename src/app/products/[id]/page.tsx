import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { AddToCartForm } from "@/components/add-to-cart-form";
import { Button } from "@/components/ui/button";
import { getProductDetail, type ProductDetail } from "@/services/product-service";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";



type ProductDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const session = await auth();
  const { id } = await params;
  let product: ProductDetail | null = null;
  let errorMessage: string | null = null;

  try {
    product = await getProductDetail(id);
  } catch {
    errorMessage =
      "Product details are unavailable. Configure MONGODB_URI to load product data.";
  }

  if (!product && !errorMessage) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <Button asChild className="mb-6" variant="ghost">
        <Link href="/products">
          <ArrowLeft aria-hidden="true" className="size-4" />
          Back to products
        </Link>
      </Button>

      {errorMessage ? (
        <section className="rounded-lg border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
          {errorMessage}
        </section>
      ) : null}

      {product ? (
        <section className="grid gap-8 md:grid-cols-[1fr_0.85fr] md:items-start">
          <div
            aria-label={product.name}
            className="aspect-[4/3] rounded-lg border border-gray-200 bg-gray-100 bg-cover bg-center shadow-sm"
            role="img"
            style={{ backgroundImage: `url("${product.imageUrl}")` }}
          />
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wide text-orange-600">
              {product.seller.name}
            </p>
            <h1 className="mt-3 text-3xl font-bold text-gray-950">{product.name}</h1>
            <p className="mt-4 text-2xl font-bold text-orange-600">{formatCurrency(product.price)}</p>
            <p className="mt-6 whitespace-pre-wrap text-base leading-7 text-gray-700">
              {product.description}
            </p>
            <AddToCartForm
              canAddToCart={session?.user.role === "buyer"}
              productId={product.id}
            />
          </div>
        </section>
      ) : null}
    </main>
  );
}
