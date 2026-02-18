# Spec 022 — Admin Dashboard Analytics & BI

> **Date**: 2026-02-16
> **Status**: ✅ Complete
> **Priority**: Before Launch

---

## Goal

Enhance admin dashboard with real analytics: KPIs (AOV, low stock, top category), revenue chart, orders by city (gouvernorat), order status distribution, and persistent AI Business Insights in French.

---

## Scope

- Enhanced KPIs: average order value, low stock count, out of stock, top category
- Revenue chart (last 30 days)
- Orders by gouvernorat (horizontal bar, top 10)
- Order status donut chart
- AI Insights: session storage persistence, "Rafraîchir" button, French responses

---

## Done

- [x] EnhancedKPIs widget
- [x] RevenueChart (recharts area)
- [x] OrdersByCity (recharts bar)
- [x] OrderStatusChart (recharts donut)
- [x] ChartsSection server wrapper
- [x] lib/sanity/queries/analytics.ts, lib/actions/admin-analytics.ts
- [x] AIInsightsCard: sessionStorage cache, French prompt
