import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { ProductSearchForm } from "@/components/product-search-form";
import { Button } from "@/components/ui/button";
import { listProducts, type ProductListItem } from "@/services/product-service";

export const dynamic = "force-dynamic";

type ProductsPageProps = {
  searchParams: Promise<{
    q?: string;
  }>;
};

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";
  let products: ProductListItem[] = [];
  let errorMessage: string | null = null;

  try {
    products = await listProducts(query);
  } catch {
    errorMessage =
      "Product catalog is unavailable. Configure MONGODB_URI to load products from MongoDB.";
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-orange-600">
            Product catalog
          </p>
          <h1 className="mt-2 text-3xl font-bold text-gray-950">Browse products</h1>
        </div>
        <div className="w-full md:max-w-xl">
          <ProductSearchForm query={query} />
        </div>
      </div>

      {errorMessage ? (
        <section className="rounded-lg border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
          {errorMessage}
        </section>
      ) : null}

      {!errorMessage && products.length === 0 ? (
        <section className="rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-xl font-semibold text-gray-950">
            {query ? "No matching products" : "No products yet"}
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-600">
            {query
              ? "Try a different keyword or clear the search field."
              : "Products created in MongoDB will appear here for shoppers to browse."}
          </p>
          {query ? (
            <Button asChild className="mt-5" variant="outline">
              <Link href="/products">Clear search</Link>
            </Button>
          ) : null}
        </section>
      ) : null}

      {products.length > 0 ? (
        <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </section>
      ) : null}
    </main>
  );
}
