# Spec 023 — Admin Dashboard Pre-ERP MVP

> **Date**: 2026-02-16
> **Status**: ✅ Complete
> **Priority**: Before Launch

---

## Goal

MVP for pre-ERP: suppliers management, invoice tracking, low stock alerts visible on dashboard and sidebar.

---

## Scope

- Suppliers: Sanity schema (supplierType), GROQ, admin page /admin/suppliers
- Invoices: Sanity schema (invoiceType), GROQ, admin page /admin/invoices
- Stock alerts: LowStockDashboardWidget, LowStockBadge on Inventaire link

---

## Done

- [x] supplierType.ts, invoiceType.ts, registered in schema + structure
- [x] lib/sanity/queries/suppliers.ts, invoices.ts
- [x] getSuppliers, getInvoices in admin-data
- [x] admin/suppliers/page.tsx, admin/invoices/page.tsx
- [x] LowStockDashboardWidget, LowStockBadge
- [x] Sidebar: Fournisseurs, Factures
