import { Types } from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import { CartItem } from "@/models/cart-item";
import { Order, type OrderDocument, type OrderStatus } from "@/models/order";
import { OrderItem } from "@/models/order-item";
import type { CartLineItem } from "@/services/cart-service";

export type OrderItemRecord = {
  _id: Types.ObjectId;
  orderId: Types.ObjectId;
  productId: Types.ObjectId;
  productName: string;
  quantity: number;
  price: number;
  createdAt: Date;
  updatedAt: Date;
};

export type OrderDetailRecord = OrderDocument & {
  items: OrderItemRecord[];
  buyer: {
    name: string;
    email: string;
  } | null;
};

type CreateOrderInput = {
  buyerId: string;
  invoiceNumber: string;
  totalAmount: number;
  items: CartLineItem[];
};

export async function createOrderFromCart(input: CreateOrderInput) {
  await connectToDatabase();

  const order = await Order.create({
    buyerId: new Types.ObjectId(input.buyerId),
    invoiceNumber: input.invoiceNumber,
    totalAmount: input.totalAmount,
    status: "PENDING_PAYMENT",
  });

  await OrderItem.insertMany(
    input.items.map((item) => ({
      orderId: order._id,
      productId: new Types.ObjectId(item.product.id),
      productName: item.product.name,
      quantity: item.quantity,
      price: item.product.price,
    })),
  );

  await CartItem.deleteMany({ userId: new Types.ObjectId(input.buyerId) });

  return order;
}

export async function findOrderByIdForBuyer(orderId: string, buyerId: string) {
  if (!Types.ObjectId.isValid(orderId)) {
    return null;
  }

  await connectToDatabase();

  const order = await Order.findOne({
    _id: new Types.ObjectId(orderId),
    buyerId: new Types.ObjectId(buyerId),
  }).lean<OrderDocument>();

  if (!order) {
    return null;
  }

  const items = await OrderItem.find({ orderId: order._id }).lean<OrderItemRecord[]>();

  return {
    ...order,
    items,
    buyer: null,
  };
}

export async function findInvoiceByIdForBuyer(orderId: string, buyerId: string) {
  if (!Types.ObjectId.isValid(orderId)) {
    return null;
  }

  await connectToDatabase();

  const [order] = await Order.aggregate<OrderDetailRecord>([
    {
      $match: {
        _id: new Types.ObjectId(orderId),
        buyerId: new Types.ObjectId(buyerId),
      },
    },
    {
      $lookup: {
        from: "orderitems",
        localField: "_id",
        foreignField: "orderId",
        as: "items",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "buyerId",
        foreignField: "_id",
        as: "buyerRecord",
      },
    },
    {
      $unwind: {
        path: "$buyerRecord",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        buyerId: 1,
        invoiceNumber: 1,
        totalAmount: 1,
        status: 1,
        createdAt: 1,
        updatedAt: 1,
        items: 1,
        buyer: {
          name: "$buyerRecord.name",
          email: "$buyerRecord.email",
        },
      },
    },
  ]);

  return order ?? null;
}

export async function updateOrderStatusForBuyer(
  orderId: string,
  buyerId: string,
  status: OrderStatus,
) {
  if (!Types.ObjectId.isValid(orderId)) {
    return null;
  }

  await connectToDatabase();

  return Order.findOneAndUpdate(
    {
      _id: new Types.ObjectId(orderId),
      buyerId: new Types.ObjectId(buyerId),
    },
    { $set: { status } },
    { new: true },
  ).lean<OrderDocument>();
}
