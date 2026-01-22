# Implementation Plan: Wishlist Feature

## Goal

Implement a fully functional Wishlist feature allowing users to save products for later, persisted via local storage.

## User Review Required

> [!NOTE]
> This implementation uses **Local Storage** only. Wishlists will not sync across devices (e.g., phone to desktop) even if logged in. This is chosen for MVP speed and simplicity.

## Proposed Changes

### 1. Store Setup

#### [NEW] [wishlist-store.ts](file:///c:/Users/Mohamed%20Ali%20Jardak/.gemini/antigravity/scratch/ecommerce-ai/lib/store/wishlist-store.ts)

- Define `WishlistItem` and `WishlistState` interfaces.
- Create Zustand store with `persist` middleware.

#### [NEW] [wishlist-store-provider.tsx](file:///c:/Users/Mohamed%20Ali%20Jardak/.gemini/antigravity/scratch/ecommerce-ai/lib/store/wishlist-store-provider.tsx)

- Create React Context provider for the store.

#### [MODIFY] [layout.tsx](file:///c:/Users/Mohamed%20Ali%20Jardak/.gemini/antigravity/scratch/ecommerce-ai/app/layout.tsx)

- Wrap application in `WishlistStoreProvider`.

### 2. UI Components

#### [NEW] [WishlistButton.tsx](file:///c:/Users/Mohamed%20Ali%20Jardak/.gemini/antigravity/scratch/ecommerce-ai/components/app/WishlistButton.tsx)

- Reusable component with Heart icon.
- Handles toggle logic and toast notifications.

#### [MODIFY] [Header.tsx](file:///c:/Users/Mohamed%20Ali%20Jardak/.gemini/antigravity/scratch/ecommerce-ai/components/app/Header.tsx)

- Update Wishlist icon to link to `/wishlist`.
- Optional: Add badge count.

#### [MODIFY] [ProductCard.tsx](file:///c:/Users/Mohamed%20Ali%20Jardak/.gemini/antigravity/scratch/ecommerce-ai/components/app/ProductCard.tsx)

- Add `WishlistButton` to the top-right corner.

#### [MODIFY] [products/[slug]/page.tsx](<file:///c:/Users/Mohamed%20Ali%20Jardak/.gemini/antigravity/scratch/ecommerce-ai/app/(app)/products/[slug]/page.tsx>)

- Add `WishlistButton` near the "Add to Cart" button.

### 3. Page Implementation

#### [NEW] [wishlist/page.tsx](<file:///c:/Users/Mohamed%20Ali%20Jardak/.gemini/antigravity/scratch/ecommerce-ai/app/(app)/wishlist/page.tsx>)

- Main wishlist page.
- Grid of products using `ProductCard`.
- Empty state with CTA.

## Verification Plan

### Automated Tests

- None for this UI-heavy feature.

### Manual Verification

1.  **Guest Flow**:
    - Add item to wishlist -> Refresh page -> Item should remain.
    - Remove item -> Item should disappear.
2.  **Navigation**:
    - Click Header Wishlist icon -> Go to `/wishlist`.
3.  **Interaction**:
    - Click Heart on ProductCard -> Toast appears, icon turns red.
    - Click Heart again -> Toast appears, icon turns outline.
