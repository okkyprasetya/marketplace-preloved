import { Pencil, Plus } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { ProductDeleteButton } from "@/components/product-delete-button";
import { Button } from "@/components/ui/button";
import { listSellerProducts, type SellerProduct } from "@/services/product-service";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";



export default async function SellerProductsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=/seller/products");
  }

  if (session.user.role !== "seller") {
    redirect("/");
  }

  let products: SellerProduct[] = [];
  let errorMessage: string | null = null;

  try {
    products = await listSellerProducts(session.user.id);
  } catch {
    errorMessage =
      "Seller products are unavailable. Configure MONGODB_URI to load products from MongoDB.";
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-orange-600">
            Seller products
          </p>
          <h1 className="mt-2 text-3xl font-bold text-gray-950">Manage products</h1>
        </div>
        <Button asChild>
          <Link href="/seller/products/new">
            <Plus aria-hidden="true" className="size-4" />
            New product
          </Link>
        </Button>
      </div>

      {errorMessage ? (
        <section className="rounded-lg border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
          {errorMessage}
        </section>
      ) : null}

      {!errorMessage && products.length === 0 ? (
        <section className="rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-xl font-semibold text-gray-950">No products yet</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-600">
            Create your first product to publish it in the public catalog.
          </p>
        </section>
      ) : null}

      {products.length > 0 ? (
        <section className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="grid grid-cols-[1fr_120px_180px] gap-4 border-b border-gray-200 bg-gray-50 px-5 py-3 text-sm font-semibold text-gray-600">
            <span>Product</span>
            <span>Price</span>
            <span className="text-right">Actions</span>
          </div>
          <div className="divide-y divide-gray-200">
            {products.map((product) => (
              <div
                className="grid grid-cols-[1fr_120px_180px] items-center gap-4 px-5 py-4"
                key={product.id}
              >
                <div className="min-w-0">
                  <p className="truncate font-semibold text-gray-950">{product.name}</p>
                  <p className="mt-1 line-clamp-1 text-sm text-gray-600">
                    {product.description}
                  </p>
                </div>
                <p className="font-semibold text-orange-600">{formatCurrency(product.price)}</p>
                <div className="flex justify-end gap-2">
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/seller/products/edit/${product.id}`}>
                      <Pencil aria-hidden="true" className="size-4" />
                      Edit
                    </Link>
                  </Button>
                  <ProductDeleteButton productId={product.id} />
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
