import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { PayNowButton } from "@/components/pay-now-button";
import { Button } from "@/components/ui/button";
import { getBuyerOrder, type OrderSummary } from "@/services/order-service";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";



type PaymentPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function PaymentPage({ params }: PaymentPageProps) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "buyer") {
    redirect("/");
  }

  const { id } = await params;
  let order: OrderSummary | null = null;
  let errorMessage: string | null = null;

  try {
    order = await getBuyerOrder(session.user.id, id);
  } catch {
    errorMessage = "Payment is unavailable. Configure MONGODB_URI to load order data.";
  }

  if (!order && !errorMessage) {
    redirect("/cart");
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-orange-600">
          Dummy payment
        </p>
        <h1 className="mt-2 text-3xl font-bold text-gray-950">Complete payment</h1>
      </div>

      {errorMessage ? (
        <section className="rounded-lg border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
          {errorMessage}
        </section>
      ) : null}

      {order ? (
        <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3 border-b border-gray-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Invoice</p>
              <p className="mt-1 font-semibold text-gray-950">{order.invoiceNumber}</p>
            </div>
            <div className="sm:text-right">
              <p className="text-sm font-medium text-gray-500">Amount</p>
              <p className="mt-1 text-2xl font-bold text-orange-600">{formatCurrency(order.totalAmount)}</p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-md border border-gray-200 bg-gray-50 p-4">
              <p className="font-semibold text-gray-950">Virtual Account Dummy</p>
              <p className="mt-2 text-sm text-gray-600">VA-0000-1234-5678</p>
            </div>
            <div className="rounded-md border border-gray-200 bg-gray-50 p-4">
              <p className="font-semibold text-gray-950">QRIS Dummy</p>
              <p className="mt-2 text-sm text-gray-600">QRIS-MARKETPLACE-LITE</p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <PayNowButton disabled={order.status === "PAID"} orderId={order.id} />
            <Button asChild variant="outline">
              <Link href={`/invoice/${order.id}`}>
                {order.status === "PAID" ? "View invoice" : "View pending invoice"}
              </Link>
            </Button>
          </div>
        </section>
      ) : null}
    </main>
  );
}
