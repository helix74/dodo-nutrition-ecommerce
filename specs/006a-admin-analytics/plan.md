# Plan: Admin Analytics (006a)

## Goal

Implement real-time analytics widgets for the admin dashboard to provide immediate visibility into store performance.

## Components

### 1. RevenueStats

- **Data**: Revenue today, this week, this month, total.
- **Visual**: Cards with value and label.
- **Source**: `ANALYTICS_SUMMARY_QUERY`

### 2. OrderStats

- **Data**: Count of orders by status (pending, confirmed, shipped, delivered, cancelled).
- **Visual**: Progress bars or grid of counts.
- **Source**: `ORDERS_BY_STATUS_QUERY`

### 3. StockSummary

- **Data**: Low stock items, out of stock items.
- **Visual**: Alert list.
- **Source**: `PRODUCTS_STOCK_SUMMARY_QUERY`

### 4. RecentOrdersWidget

- **Data**: Last 5 orders.
- **Visual**: Simple table/list.
- **Source**: `RECENT_ORDERS_DASHBOARD_QUERY`

## Implementation Steps

1. Create GROQ queries in `lib/sanity/queries/analytics.ts`.
2. Create widget components in `components/admin/widgets/`.
3. Integrate widgets into `app/(admin)/admin/page.tsx`.
4. Add loading skeletons.
