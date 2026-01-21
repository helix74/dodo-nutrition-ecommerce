# Implementation Plan: Order Workflow

> **Feature**: 006c-admin-orders  
> **Date**: 2026-01-18

---

## Proposed Changes

### Server Actions

#### [NEW] lib/actions/orders.ts

```typescript
export async function updateOrderStatus(
  orderId: string,
  newStatus: OrderStatusValue,
);
```

- Uses Sanity writeClient
- Updates status field
- Returns success/error

---

### Components

#### [NEW] components/admin/QuickStatusActions.tsx

Quick action buttons based on current status:

- Shows only valid next status options
- Uses dodo-yellow for primary actions
- Uses dodo-red for cancel
- Auto-publishes on click

---

### Pages

#### [MODIFY] app/(admin)/admin/orders/[id]/page.tsx

- Add COD-specific fields to projection (phone, gouvernorat, notes)
- Replace StatusSelect with QuickStatusActions
- Add COD info section in sidebar

---

## Verification Plan

### Manual Testing

1. Create COD order from checkout
2. Go to /admin/orders
3. Open order detail
4. Click "Confirmer" → status updates
5. Click "Expédier" → status updates
6. Verify COD info displays correctly

### Build

- `pnpm build` passes
