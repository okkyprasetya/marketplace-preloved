import { Download, WalletCards } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { getBuyerInvoice, type InvoiceDetail } from "@/services/order-service";

export const dynamic = "force-dynamic";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

type InvoicePageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function InvoicePage({ params }: InvoicePageProps) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "buyer") {
    redirect("/");
  }

  const { id } = await params;
  let invoice: InvoiceDetail | null = null;
  let errorMessage: string | null = null;

  try {
    invoice = await getBuyerInvoice(session.user.id, id);
  } catch {
    errorMessage = "Invoice is unavailable. Configure MONGODB_URI to load invoice data.";
  }

  if (!invoice && !errorMessage) {
    redirect("/cart");
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-orange-600">
            Invoice
          </p>
          <h1 className="mt-2 text-3xl font-bold text-gray-950">Order invoice</h1>
        </div>
        {invoice ? (
          <Button asChild>
            <a href={`/api/invoice/${invoice.id}/pdf`}>
              <Download aria-hidden="true" className="size-4" />
              Download PDF
            </a>
          </Button>
        ) : null}
      </div>

      {errorMessage ? (
        <section className="rounded-lg border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
          {errorMessage}
        </section>
      ) : null}

      {invoice ? (
        <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="grid gap-5 border-b border-gray-200 pb-6 md:grid-cols-3">
            <div>
              <p className="text-sm font-medium text-gray-500">Invoice Number</p>
              <p className="mt-1 font-semibold text-gray-950">{invoice.invoiceNumber}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Buyer</p>
              <p className="mt-1 font-semibold text-gray-950">{invoice.buyer.name}</p>
              <p className="mt-1 text-sm text-gray-600">{invoice.buyer.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Date</p>
              <p className="mt-1 font-semibold text-gray-950">
                {new Date(invoice.createdAt).toLocaleDateString("en-US")}
              </p>
            </div>
          </div>

          <div className="mt-6 overflow-hidden rounded-lg border border-gray-200">
            <div className="grid grid-cols-[1fr_90px_120px_120px] gap-4 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-600">
              <span>Product</span>
              <span>Qty</span>
              <span>Price</span>
              <span className="text-right">Subtotal</span>
            </div>
            <div className="divide-y divide-gray-200">
              {invoice.items.map((item) => (
                <div
                  className="grid grid-cols-[1fr_90px_120px_120px] gap-4 px-4 py-4 text-sm"
                  key={item.id}
                >
                  <span className="font-medium text-gray-950">{item.productName}</span>
                  <span className="text-gray-700">{item.quantity}</span>
                  <span className="text-gray-700">{currencyFormatter.format(item.price)}</span>
                  <span className="text-right font-semibold text-gray-950">
                    {currencyFormatter.format(item.subtotal)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="inline-flex w-fit items-center gap-2 rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-semibold text-gray-700">
              <WalletCards aria-hidden="true" className="size-4" />
              {invoice.status}
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-500">Total</p>
              <p className="text-2xl font-bold text-orange-600">
                {currencyFormatter.format(invoice.totalAmount)}
              </p>
            </div>
          </div>

          {invoice.status === "PENDING_PAYMENT" ? (
            <Button asChild className="mt-6" variant="outline">
              <Link href={`/payment/${invoice.id}`}>Go to payment</Link>
            </Button>
          ) : null}
        </section>
      ) : null}
    </main>
  );
}
