# Implementation Plan: AI-Powered Admin Dashboard

> **Feature**: 006-admin-dashboard  
> **Date**: 2026-01-18

---

## Phase 1: Analytics Foundation (Start Here)

### Priority Order

1. **Revenue Stats Widget** - Show revenue today/week/month
2. **Order Stats Widget** - Orders by status
3. **Revenue Chart** - Line chart with time selector
4. **Top Products Widget** - Best sellers list

---

## Proposed Changes

### API Layer

#### [NEW] lib/sanity/queries/analytics.ts

GROQ queries for:

- Revenue by date range
- Orders count by status
- Top selling products
- Stock levels summary

---

### Components

#### [NEW] components/admin/widgets/RevenueStats.tsx

- Revenue today/week/month/total
- Percentage change vs previous period
- Uses dodo-yellow for positive, dodo-red for negative

#### [NEW] components/admin/widgets/OrderStats.tsx

- Orders by status: pending/confirmed/shipped/delivered
- Click to filter orders list

#### [NEW] components/admin/charts/RevenueChart.tsx

- Line chart using Recharts
- Time selector: 7 days / 30 days / 12 months
- Dodo color scheme

#### [NEW] components/admin/widgets/TopProducts.tsx

- Top 5 selling products
- Show units sold and revenue
- Link to product edit

---

### Pages

#### [MODIFY] app/(admin)/admin/page.tsx

Replace current layout with new widgets:

```tsx
<div className="space-y-6">
  {/* Stats Row */}
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
    <RevenueStats />
    <OrderStats />
  </div>

  {/* Chart */}
  <RevenueChart />

  {/* Two Column */}
  <div className="grid lg:grid-cols-2 gap-6">
    <TopProducts />
    <RecentOrders />
  </div>

  {/* AI Insights */}
  <AIInsightsCard />
</div>
```

---

## Verification Plan

### Manual Testing

1. Check revenue calculations against Sanity data
2. Verify chart displays correctly
3. Test time range selectors
4. Confirm mobile responsiveness
5. Verify French labels

### Build

- `pnpm build` passes
