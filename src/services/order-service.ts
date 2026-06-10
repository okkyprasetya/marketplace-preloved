import {
  createOrderFromCart,
  findInvoiceByIdForBuyer,
  findOrderByIdForBuyer,
  updateOrderStatusForBuyer,
  type OrderDetailRecord,
  type OrderItemRecord,
} from "@/repositories/order-repository";
import { getCart } from "@/services/cart-service";

export type OrderSummary = {
  id: string;
  invoiceNumber: string;
  totalAmount: number;
  status: "PENDING_PAYMENT" | "PAID";
  createdAt: string;
};

export type InvoiceItem = {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
};

export type InvoiceDetail = OrderSummary & {
  buyer: {
    name: string;
    email: string;
  };
  items: InvoiceItem[];
};

function generateInvoiceNumber() {
  const randomSegment = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `INV-${Date.now()}-${randomSegment}`;
}

function mapOrder(order: {
  _id: { toString(): string };
  invoiceNumber: string;
  totalAmount: number;
  status: "PENDING_PAYMENT" | "PAID";
  createdAt: Date;
}): OrderSummary {
  return {
    id: order._id.toString(),
    invoiceNumber: order.invoiceNumber,
    totalAmount: order.totalAmount,
    status: order.status,
    createdAt: order.createdAt.toISOString(),
  };
}

function mapOrderItem(item: OrderItemRecord): InvoiceItem {
  return {
    id: item._id.toString(),
    productId: item.productId.toString(),
    productName: item.productName,
    quantity: item.quantity,
    price: item.price,
    subtotal: item.price * item.quantity,
  };
}

function mapInvoice(order: OrderDetailRecord): InvoiceDetail {
  return {
    ...mapOrder(order),
    buyer: {
      name: order.buyer?.name ?? "Unknown buyer",
      email: order.buyer?.email ?? "-",
    },
    items: order.items.map(mapOrderItem),
  };
}

export async function checkoutCart(buyerId: string): Promise<OrderSummary | null> {
  const cart = await getCart(buyerId);

  if (cart.items.length === 0) {
    return null;
  }

  const order = await createOrderFromCart({
    buyerId,
    invoiceNumber: generateInvoiceNumber(),
    totalAmount: cart.total,
    items: cart.items,
  });

  return mapOrder(order);
}

export async function getBuyerOrder(
  buyerId: string,
  orderId: string,
): Promise<OrderSummary | null> {
  const order = await findOrderByIdForBuyer(orderId, buyerId);

  return order ? mapOrder(order) : null;
}

export async function payBuyerOrder(
  buyerId: string,
  orderId: string,
): Promise<OrderSummary | null> {
  const order = await updateOrderStatusForBuyer(orderId, buyerId, "PAID");

  return order ? mapOrder(order) : null;
}

export async function getBuyerInvoice(
  buyerId: string,
  orderId: string,
): Promise<InvoiceDetail | null> {
  const order = await findInvoiceByIdForBuyer(orderId, buyerId);

  return order ? mapInvoice(order) : null;
}
