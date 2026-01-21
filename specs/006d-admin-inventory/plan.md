# Implementation Plan: Inventory Management

> **Feature**: 006d-admin-inventory  
> **Date**: 2026-01-18

---

## Proposed Changes

### Page Updates

#### [MODIFY] app/(admin)/admin/inventory/page.tsx

- Add stock status tabs (Tous / Stock faible / Rupture)
- Update filter logic based on tab
- French labels

---

### Component Updates

#### [MODIFY] components/admin/StockInput.tsx

- Add +/- quick buttons
- Keep color coding

#### [MODIFY] components/admin/ProductRow.tsx

- Add visual stock bar
- Show low/out of stock badges

---

## Quick Implementation Steps

### Step 1: Add Stock Tabs

```tsx
const STOCK_TABS = [
  { value: "all", label: "Tous" },
  { value: "low", label: "Stock faible", filter: "stock > 0 && stock <= 10" },
  { value: "out", label: "Rupture", filter: "stock <= 0" },
];
```

### Step 2: Update StockInput with +/-

Add Minus/Plus buttons next to input.

### Step 3: French Labels

- "Inventory" → "Inventaire"
- "Manage your product stock" → "Gérer vos stocks"
- "New Product" → "Nouveau produit"
- "Search products" → "Rechercher..."

---

## Verification Plan

### Manual Testing

1. Verify tabs filter correctly
2. Test +/- buttons update stock
3. Check color coding still works
4. Verify French labels

### Build

- `pnpm build` passes
