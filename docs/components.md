# 🎨 Component Library Reference

> **Complete list of all React components in Dodo Nutrition.**

---

## 📁 Structure Overview

```
components/
├── ui/          # Shadcn/UI base components (22)
├── app/         # Business logic components (29)
├── admin/       # Admin dashboard components
├── home/        # Homepage sections
├── layout/      # Header, Footer, Navigation
├── loaders/     # Skeleton loaders
└── providers/   # Context providers
```

---

## 🧩 UI Components (Shadcn/UI)

Base primitives from [ui.shadcn.com](https://ui.shadcn.com):

| Component      | Path                   | Usage                      |
| -------------- | ---------------------- | -------------------------- |
| `Button`       | `ui/button.tsx`        | CTAs, actions              |
| `Card`         | `ui/card.tsx`          | Product cards, info cards  |
| `Input`        | `ui/input.tsx`         | Forms                      |
| `Badge`        | `ui/badge.tsx`         | Stock status, promo labels |
| `Sheet`        | `ui/sheet.tsx`         | Cart drawer, chat drawer   |
| `Dialog`       | `ui/dialog.tsx`        | Modals                     |
| `AlertDialog`  | `ui/alert-dialog.tsx`  | Confirmations              |
| `DropdownMenu` | `ui/dropdown-menu.tsx` | User menu, filters         |
| `Select`       | `ui/select.tsx`        | Dropdowns                  |
| `Tabs`         | `ui/tabs.tsx`          | Product info tabs          |
| `Carousel`     | `ui/carousel.tsx`      | Featured products          |
| `Tooltip`      | `ui/tooltip.tsx`       | Hover info                 |
| `Skeleton`     | `ui/skeleton.tsx`      | Loading states             |
| `Slider`       | `ui/slider.tsx`        | Price filters              |
| `Switch`       | `ui/switch.tsx`        | Toggles                    |
| `Table`        | `ui/table.tsx`         | Admin tables               |
| `Label`        | `ui/label.tsx`         | Form labels                |
| `Textarea`     | `ui/textarea.tsx`      | Multi-line input           |
| `Collapsible`  | `ui/collapsible.tsx`   | Expandable sections        |
| `Sonner`       | `ui/sonner.tsx`        | Toast notifications        |
| `Spinner`      | `ui/spinner.tsx`       | Loading indicator          |
| `EmptyState`   | `ui/empty-state.tsx`   | No results display         |

---

## 🛒 App Components

### Cart System

| Component         | Path                      | Description               |
| ----------------- | ------------------------- | ------------------------- |
| `CartSheet`       | `app/CartSheet.tsx`       | Slide-out cart drawer     |
| `CartItem`        | `app/CartItem.tsx`        | Individual cart line item |
| `CartSummary`     | `app/CartSummary.tsx`     | Subtotal, shipping, total |
| `AddToCartButton` | `app/AddToCartButton.tsx` | Add product to cart       |
| `CheckoutButton`  | `app/CheckoutButton.tsx`  | Proceed to checkout       |

### Product Display

| Component              | Path                           | Description                      |
| ---------------------- | ------------------------------ | -------------------------------- |
| `ProductCard`          | `app/ProductCard.tsx`          | Grid card with image, price, CTA |
| `ProductGrid`          | `app/ProductGrid.tsx`          | Responsive product grid          |
| `ProductFilters`       | `app/ProductFilters.tsx`       | Category, price, brand filters   |
| `ProductGallery`       | `app/ProductGallery.tsx`       | Image carousel on detail page    |
| `ProductInfo`          | `app/ProductInfo.tsx`          | Name, description, specs         |
| `ProductSection`       | `app/ProductSection.tsx`       | Section wrapper                  |
| `StockBadge`           | `app/StockBadge.tsx`           | In stock / Low stock / Out       |
| `StackedProductImages` | `app/StackedProductImages.tsx` | Stacked image display            |

### Homepage

| Component          | Path                       | Description           |
| ------------------ | -------------------------- | --------------------- |
| `FeaturedCarousel` | `app/FeaturedCarousel.tsx` | Hero product carousel |
| `CategoryTiles`    | `app/CategoryTiles.tsx`    | Category grid         |

### AI Chat

| Component            | Path                         | Description               |
| -------------------- | ---------------------------- | ------------------------- |
| `ChatSheet`          | `app/ChatSheet.tsx`          | AI assistant drawer       |
| `AskAISimilarButton` | `app/AskAISimilarButton.tsx` | "Find similar" AI trigger |
| `chat/*`             | `app/chat/`                  | Chat message components   |

### Layout

| Component  | Path               | Description                      |
| ---------- | ------------------ | -------------------------------- |
| `Header`   | `app/Header.tsx`   | Navigation, cart icon, user menu |
| `AppShell` | `app/AppShell.tsx` | Main layout wrapper              |

### Skeletons (Loading States)

| Component                  | Description          |
| -------------------------- | -------------------- |
| `ProductGridSkeleton`      | Loading grid         |
| `ProductGallerySkeleton`   | Loading gallery      |
| `ProductInfoSkeleton`      | Loading product info |
| `ProductFiltersSkeleton`   | Loading filters      |
| `FeaturedCarouselSkeleton` | Loading carousel     |
| `CategoryTilesSkeleton`    | Loading categories   |
| `OrderCardSkeleton`        | Loading order card   |
| `OrderDetailSkeleton`      | Loading order detail |
| `CheckoutSkeleton`         | Loading checkout     |
| `SuccessPageSkeleton`      | Loading success page |

---

## 🎨 Design Tokens

### Colors (from `globals.css`)

```css
--dodo-yellow: #fee257; /* Primary CTA */
--dodo-yellow-hover: #ffe97a;
--dodo-red: #f01b24; /* Destructive, Promo */
--dodo-red-hover: #ff3b44;
--background: #0a0a0a; /* Dark mode default */
--foreground: #ffffff;
```

### Utility Classes

```css
.btn-dodo      /* Yellow CTA button */
/* Yellow CTA button */
.badge-promo   /* Red promo badge */
.card-dodo; /* Card with yellow hover glow */
```

---

## 📖 Usage Examples

### Product Card

```tsx
import { ProductCard } from "@/components/app/ProductCard";

<ProductCard product={product} onAddToCart={handleAddToCart} />;
```

### Add to Cart Button

```tsx
import { AddToCartButton } from "@/components/app/AddToCartButton";

<AddToCartButton product={product} quantity={1} />;
```

### Cart Sheet

```tsx
import { CartSheet } from "@/components/app/CartSheet";

<CartSheet />;
```

---

**Last Updated**: 2026-01-14
