import Link from "next/link";
import type { ProductListItem } from "@/services/product-service";
import { formatCurrency } from "@/lib/utils";

type ProductCardProps = {
  product: ProductListItem;
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      className="group overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md"
      href={`/products/${product.id}`}
    >
      <div
        aria-label={product.name}
        className="aspect-[4/3] w-full bg-gray-100 bg-cover bg-center"
        role="img"
        style={{ backgroundImage: `url("${product.imageUrl}")` }}
      />
      <div className="p-4">
        <p className="line-clamp-1 text-base font-semibold text-gray-950 group-hover:text-orange-700">
          {product.name}
        </p>
        <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-gray-600">
          {product.description}
        </p>
        <div className="mt-4 flex items-end justify-between gap-3">
          <p className="text-lg font-bold text-orange-600">{formatCurrency(product.price)}</p>
          <p className="line-clamp-1 text-right text-xs font-medium text-gray-500">
            {product.seller.name}
          </p>
        </div>
      </div>
    </Link>
  );
}
