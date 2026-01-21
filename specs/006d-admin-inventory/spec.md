# Feature 006d: Admin Inventory Management

> **Status**: 📋 Planning  
> **Date**: 2026-01-18  
> **Parent**: 006-admin-dashboard  
> **Priority**: 🟠 Medium

---

## Overview

Enhance inventory management with visual stock indicators, quick stock updates, and filtering by stock status.

---

## Current State

### What Exists:

| Feature        | Component               | Status         |
| -------------- | ----------------------- | -------------- |
| Product list   | `/admin/inventory`      | ✅ Works       |
| Stock input    | `StockInput.tsx`        | ✅ Color coded |
| Product editor | `/admin/inventory/[id]` | ✅ Works       |
| Search         | `AdminSearch`           | ✅ Works       |

### What's Missing:

- Stock status tabs (All / Low Stock / Out of Stock)
- Visual stock bars in product row
- Quick +/- stock buttons
- French labels

---

## Proposed Improvements

### Phase 4.1: Stock Status Tabs

Filter products by stock status:

```
[Tous] [Stock faible ⚠️] [Rupture 🔴]
```

### Phase 4.2: Visual Stock Indicators

Add progress bar showing stock level:

```
Product Name     [████████░░] 80/100  [+] [-]
Whey Protein     [███░░░░░░░] 3/100   [+] [-]  ⚠️
Creatine         [░░░░░░░░░░] 0/100   [+] [-]  🔴
```

### Phase 4.3: Quick Stock Actions

Buttons to quickly increment/decrement stock.

### Phase 4.4: French Labels

All text in French.

---

## Implementation Plan

### Phase 4.1: Stock Status Tabs

| Task                | Description                 |
| ------------------- | --------------------------- |
| Add tab component   | Tous, Stock faible, Rupture |
| Update filter logic | Filter by stock levels      |

### Phase 4.2: Visual Stock Indicators

| Task                        | Description               |
| --------------------------- | ------------------------- |
| Create `StockBar` component | Visual progress bar       |
| Integrate into ProductRow   | Show max stock vs current |

### Phase 4.3: Quick Stock Actions

| Task                     | Description         |
| ------------------------ | ------------------- |
| Add +/- buttons          | Next to stock input |
| Server action (optional) | Quick update        |

### Phase 4.4: French Labels

| Task                  | Description   |
| --------------------- | ------------- |
| Update inventory page | French text   |
| Update product row    | French labels |

---

## Files to Modify

### Existing

- `app/(admin)/admin/inventory/page.tsx`
- `components/admin/ProductRow.tsx`
- `components/admin/StockInput.tsx`

### Optional New

- `components/admin/StockBar.tsx`

---

## Success Criteria

- [ ] Can filter by stock status
- [ ] Visual stock bars show levels
- [ ] Quick +/- works
- [ ] French labels throughout
