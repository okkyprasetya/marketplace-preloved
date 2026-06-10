import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { ProductForm } from "@/components/product-form";
import { getSellerProduct } from "@/services/product-service";

export const dynamic = "force-dynamic";

type EditProductPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditProductPage({ params }: EditProductPageProps) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=/seller/products");
  }

  if (session.user.role !== "seller") {
    redirect("/");
  }

  const { id } = await params;
  const product = await getSellerProduct(session.user.id, id);

  if (!product) {
    redirect("/seller/products");
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-orange-600">
          Seller products
        </p>
        <h1 className="mt-2 text-3xl font-bold text-gray-950">Edit product</h1>
      </div>
      <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <ProductForm product={product} />
      </section>
    </main>
  );
}
