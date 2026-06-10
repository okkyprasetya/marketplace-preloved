import PDFDocument from "pdfkit";
import type { InvoiceDetail } from "@/services/order-service";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export async function createInvoicePdf(invoice: InvoiceDetail) {
  const document = new PDFDocument({ margin: 48 });
  const chunks: Buffer[] = [];

  document.on("data", (chunk: Buffer) => chunks.push(chunk));

  const finished = new Promise<Buffer>((resolve, reject) => {
    document.on("end", () => resolve(Buffer.concat(chunks)));
    document.on("error", reject);
  });

  document.fontSize(22).text("Marketplace Lite Invoice", { align: "left" });
  document.moveDown();
  document.fontSize(11).text(`Invoice Number: ${invoice.invoiceNumber}`);
  document.text(`Date: ${new Date(invoice.createdAt).toLocaleDateString("en-US")}`);
  document.text(`Status: ${invoice.status}`);
  document.moveDown();
  document.text(`Buyer: ${invoice.buyer.name}`);
  document.text(`Email: ${invoice.buyer.email}`);
  document.moveDown();

  document.fontSize(14).text("Items");
  document.moveDown(0.5);

  invoice.items.forEach((item) => {
    document
      .fontSize(11)
      .text(`${item.productName}`)
      .text(
        `${item.quantity} x ${currencyFormatter.format(item.price)} = ${currencyFormatter.format(
          item.subtotal,
        )}`,
      );
    document.moveDown(0.5);
  });

  document.moveDown();
  document.fontSize(16).text(`Total: ${currencyFormatter.format(invoice.totalAmount)}`, {
    align: "right",
  });

  document.end();

  return finished;
}
