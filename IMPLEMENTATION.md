# Marketplace Lite MVP Implementation

## Phase 1 - Foundation

Status: Complete

- Created the Next.js 15 App Router project foundation.
- Added Auth.js Credentials authentication.
- Added MongoDB/Mongoose connection handling.
- Added the User model with buyer, seller, and admin roles.
- Added login and registration pages.
- Stored role information in the authenticated session.

Verification:

- `npm run typecheck`
- `npm run lint`
- `npm run build`

## Phase 2 - Product Catalog

Status: Complete

- Added the Product model with name, description, price, image URL, and seller fields.
- Added a product repository for MongoDB search and detail lookups.
- Added a product service for catalog-safe DTO mapping.
- Added public product API endpoints:
  - `GET /api/products`
  - `GET /api/products/[id]`
- Added product listing page at `/products`.
- Added product detail page at `/products/[id]`.
- Added search by product name and description.

Verification:

- `npm run typecheck`
- `npm run lint`
- `npm run build`

## Phase 3 - Seller Product Management

Status: Complete

- Added seller-scoped product management APIs:
  - `GET /api/seller/products`
  - `POST /api/seller/products`
  - `GET /api/seller/products/[id]`
  - `PATCH /api/seller/products/[id]`
  - `DELETE /api/seller/products/[id]`
- Added product validation with Zod.
- Added seller product listing page at `/seller/products`.
- Added create product page at `/seller/products/new`.
- Added edit product page at `/seller/products/edit/[id]`.
- Added soft-delete support so deleted products are hidden from seller and public catalog views.
- Restricted seller product management to authenticated seller accounts.

Verification:

- `npm run typecheck`
- `npm run lint`
- `npm run build`

## Phase 4 - Shopping Cart

Status: Complete

- Added the CartItem model with buyer, product, and quantity fields.
- Added cart repository and service layers.
- Added buyer-scoped cart APIs:
  - `GET /api/cart`
  - `POST /api/cart`
  - `PATCH /api/cart/[id]`
  - `DELETE /api/cart/[id]`
- Added add-to-cart functionality on product detail pages.
- Added cart page at `/cart`.
- Added remove item and quantity update controls.
- Added subtotal and total calculations.
- Restricted cart management to authenticated buyer accounts.

Verification:

- `npm run typecheck`
- `npm run lint`
- `npm run build`

## Phase 5 - Checkout

Status: Complete

- Added Order and OrderItem models.
- Added order repository and service layers.
- Added checkout API:
  - `POST /api/checkout`
- Added checkout page at `/checkout`.
- Checkout creates a `PENDING_PAYMENT` order from the buyer cart.
- Checkout stores order items and total amount.
- Checkout clears the buyer cart after order creation.

Verification:

- `npm run typecheck`
- `npm run lint`
- `npm run build`

## Phase 6 - Dummy Payment

Status: Complete

- Added dummy payment API:
  - `POST /api/payment/[id]`
- Added payment page at `/payment/[id]`.
- Added Virtual Account Dummy and QRIS Dummy display options.
- Added Pay Now action.
- Payment updates order status to `PAID`.
- Successful payment redirects buyers to the invoice page.

Verification:

- `npm run typecheck`
- `npm run lint`
- `npm run build`

## Phase 7 - Invoice

Status: Complete

- Added invoice page at `/invoice/[id]`.
- Invoice displays invoice number, buyer, products, quantities, prices, total, date, and status.
- Added PDF generation with PDFKit.
- Added invoice PDF download API:
  - `GET /api/invoice/[id]/pdf`

Verification:

- `npm run typecheck`
- `npm run lint`
- `npm run build`
