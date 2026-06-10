import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { ProductForm } from "@/components/product-form";

export default async function NewProductPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=/seller/products/new");
  }

  if (session.user.role !== "seller") {
    redirect("/");
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-orange-600">
          Seller products
        </p>
        <h1 className="mt-2 text-3xl font-bold text-gray-950">Create product</h1>
      </div>
      <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <ProductForm />
      </section>
    </main>
  );
}
