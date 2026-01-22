# Specification: Wishlist Feature

## 1. Overview

The Wishlist feature allows users to save products they are interested in for later purchase. It serves as a "save for later" functionality, distinct from the shopping cart.

## 2. Goals

- Allow users to add/remove products to/from a wishlist.
- Persist wishlist data across sessions (using local storage).
- Display a dedicated Wishlist page.
- Show wishlist status on product cards and product pages.
- Provide easy "Move to Cart" functionality.

## 3. User Stories

- **As a Guest**, I want to add items to my wishlist so I can find them later without creating an account.
- **As a User**, I want to see which items are in my wishlist while browsing the shop.
- **As a User**, I want to easily move items from my wishlist to my cart when I'm ready to buy.

## 4. Technical Approach

### 4.1 State Management

We will use **Zustand** with `persist` middleware, similar to the existing `cart-store`.

- **Store Name**: `wishlist-store`
- **Persistence**: `localStorage` (key: `wishlist-storage`)
- **Sync**: No backend sync for MVP (keep it simple and fast).

### 4.2 Components

1.  **WishlistStoreProvider**: Wrapper to provide the store context.
2.  **WishlistButton**: A reusable heart icon button to toggle wishlist state.
    - _Props_: `product` (object)
    - _UI_: Filled heart if active, outline if not.
3.  **WishlistPage**: The `/wishlist` page displaying saved items.
    - _Empty State_: "Votre wishlist est vide" + CTA to Shop.
    - _Grid_: Reuses `ProductCard` or a simplified list view.

### 4.3 Integration Points

- **Header**: Update Heart icon to show count (optional) and link to `/wishlist`.
- **ProductCard**: Add `WishlistButton` (top right, overlay).
- **ProductPage**: Add `WishlistButton` next to "Add to Cart".

## 5. Data Structure

```typescript
interface WishlistItem {
  productId: string;
  name: string;
  price: number;
  image?: string;
  slug: string;
  addedAt: number;
}

interface WishlistState {
  items: WishlistItem[];
  addItem: (item: WishlistItem) => void;
  removeItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}
```

## 6. UI/UX Design

- **Colors**: Use `dodo-red` (#f01b24) for the active heart state.
- **Animations**: Subtle scale animation on click.
- **Toast**: Show success toast "Ajouté à la wishlist" / "Retiré de la wishlist".
