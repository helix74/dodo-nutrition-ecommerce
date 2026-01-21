# Feature 006c: Admin Order Workflow

> **Status**: 📋 Planning  
> **Date**: 2026-01-18  
> **Parent**: 006-admin-dashboard  
> **Priority**: 🔴 High

---

## Overview

Improve order management with quick actions, better workflow, and enhanced UI.

---

## Current State

### What Exists:

| Component     | Location             | Features                          |
| ------------- | -------------------- | --------------------------------- |
| Orders list   | `/admin/orders`      | Tab filtering, search, pagination |
| Order detail  | `/admin/orders/[id]` | Items, address, status select     |
| StatusSelect  | Component            | Dropdown with auto-publish        |
| AddressEditor | Component            | Editable address fields           |

### What's Missing:

- Quick status actions (one-click buttons)
- Bulk operations
- Order timeline/history
- Print functionality
- COD-specific fields display (phone, gouvernorat, notes)

---

## Proposed Improvements

### 1. Quick Status Buttons (Priority)

**Goal**: Update status with one click, not dropdown

```
┌─────────────────────────────────────────────────────┐
│ Order #COD-xxx                                       │
│                                                      │
│ [✓ Confirmer] [📦 Expédier] [✓ Livré] [✗ Annuler]   │
│                                                      │
└─────────────────────────────────────────────────────┘
```

**Workflow**:

- `pending` → `confirmed` (Confirmer)
- `confirmed` → `shipped` (Expédier)
- `shipped` → `delivered` (Livré)
- Any → `cancelled` (Annuler)

### 2. COD Order Info Display

Show COD-specific fields on order detail:

- Phone number
- Gouvernorat
- Delivery notes

### 3. Bulk Operations (Optional)

Select multiple orders and update status together.

### 4. Order Timeline (Optional)

Show history of status changes with timestamps.

---

## Implementation Plan

### Phase 3.1: Quick Status Buttons

| Task                                  | Description                                 |
| ------------------------------------- | ------------------------------------------- |
| Create `QuickStatusActions` component | Buttons for each status transition          |
| Add server action                     | `updateOrderStatus(orderId, newStatus)`     |
| Update order detail page              | Replace dropdown with buttons               |
| French labels                         | "Confirmer", "Expédier", "Livré", "Annuler" |

### Phase 3.2: COD Info Display

| Task                    | Description                     |
| ----------------------- | ------------------------------- |
| Update projection       | Add phone, gouvernorat, notes   |
| Create COD info section | Display in order detail sidebar |

### Phase 3.3: Bulk Operations (Future)

- Checkbox selection
- Bulk status update action

---

## Files to Create/Modify

### New

- `components/admin/QuickStatusActions.tsx`
- `lib/actions/orders.ts` (server action)

### Modify

- `app/(admin)/admin/orders/[id]/page.tsx`
- `app/(admin)/admin/orders/page.tsx` (optional: quick actions in list)

---

## Success Criteria

- [ ] Admin can update status with one click
- [ ] COD order info visible
- [ ] Buttons use proper Dodo colors
- [ ] French labels throughout
- [ ] Changes auto-publish immediately
