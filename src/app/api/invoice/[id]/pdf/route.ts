import { apiError } from "@/lib/api-response";
import { requireRole } from "@/lib/authorization";
import { createInvoicePdf } from "@/lib/pdf";
import { getBuyerInvoice } from "@/services/order-service";

type InvoicePdfRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_request: Request, context: InvoicePdfRouteContext) {
  const session = await requireRole("buyer");

  if (!session) {
    return apiError("Buyer access is required", ["Unauthorized"], 401);
  }

  const { id } = await context.params;

  try {
    const invoice = await getBuyerInvoice(session.user.id, id);

    if (!invoice) {
      return apiError("Invoice not found", ["Not found"], 404);
    }

    const pdf = await createInvoicePdf(invoice);
    const body = new Uint8Array(pdf);

    return new Response(body, {
      headers: {
        "Content-Disposition": `attachment; filename="${invoice.invoiceNumber}.pdf"`,
        "Content-Type": "application/pdf",
      },
    });
  } catch (error) {
    console.error("Failed to generate invoice PDF", error);
    return apiError("Failed to generate invoice PDF", ["Server error"], 500);
  }
}
