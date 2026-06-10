import {
  addCartItem,
  findCartItemsByUser,
  removeCartItem,
  updateCartItemQuantity,
} from "@/repositories/cart-repository";

export type CartLineItem = {
  id: string;
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
  };
  quantity: number;
  subtotal: number;
};

export type CartSummary = {
  items: CartLineItem[];
  total: number;
};

export async function getCart(userId: string): Promise<CartSummary> {
  const items = await findCartItemsByUser(userId);
  const mappedItems = items.map<CartLineItem>((item) => ({
    id: item._id.toString(),
    product: {
      id: item.product._id.toString(),
      name: item.product.name,
      description: item.product.description,
      price: item.product.price,
      imageUrl: item.product.imageUrl,
    },
    quantity: item.quantity,
    subtotal: item.product.price * item.quantity,
  }));

  return {
    items: mappedItems,
    total: mappedItems.reduce((sum, item) => sum + item.subtotal, 0),
  };
}

export async function addProductToCart(
  userId: string,
  productId: string,
  quantity: number,
) {
  return addCartItem(userId, productId, quantity);
}

export async function updateCartQuantity(
  userId: string,
  cartItemId: string,
  quantity: number,
) {
  return updateCartItemQuantity(userId, cartItemId, quantity);
}

export async function deleteCartItem(userId: string, cartItemId: string) {
  return removeCartItem(userId, cartItemId);
}
