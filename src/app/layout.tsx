import type { Metadata } from "next";
import Link from "next/link";
import { Toaster } from "sonner";
import { AuthStatus } from "@/components/auth-status";
import "./globals.css";

export const metadata: Metadata = {
  title: "Marketplace Lite",
  description: "A simple Shopee-inspired marketplace MVP.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <header className="border-b border-gray-200 bg-white">
          <nav className="mx-auto flex min-h-20 max-w-6xl items-center justify-between px-4">
            <Link className="text-xl font-bold text-orange-600" href="/">
              Marketplace Preloved
            </Link>
            <div className="flex items-center gap-5">
              <Link className="text-sm font-medium text-gray-700 hover:text-gray-950" href="/products">
                Products
              </Link>
              <Link className="text-sm font-medium text-gray-700 hover:text-gray-950" href="/cart">
                Cart
              </Link>
              <Link
                className="text-sm font-medium text-gray-700 hover:text-gray-950"
                href="/checkout"
              >
                Checkout
              </Link>
              <Link
                className="text-sm font-medium text-gray-700 hover:text-gray-950"
                href="/seller/products"
              >
                Seller
              </Link>
              <AuthStatus />
            </div>
          </nav>
        </header>
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
