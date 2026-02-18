# Spec 026 — SEO & Discovery

> **Date**: 2026-02-16
> **Status**: ✅ Complete
> **Priority**: Before Launch

---

## Goal

Dynamic meta, JSON-LD, sitemap.xml, Open Graph, and dedicated SEO pages for categories and brands.

---

## Scope

- JSON-LD: Product, Organization, BreadcrumbList (components/seo/JsonLd.tsx)
- app/sitemap.ts: products, categories, brands, packs, static pages
- generateMetadata on product, category, brand pages
- Open Graph / Twitter tags site-wide and per page
- app/(app)/categories/[slug], app/(app)/brands/[slug]: full landing pages with ProductGrid
- GROQ: CATEGORY_BY_SLUG with description/productCount, BRAND_BY_SLUG, PRODUCTS_BY_CATEGORY_SLUG, PRODUCTS_BY_BRAND_SLUG

---

## Done

- [x] JsonLd.tsx, OrganizationJsonLd on homepage
- [x] sitemap.ts
- [x] Product metadata + ProductJsonLd
- [x] categories/[slug], brands/[slug] pages
- [x] brands.ts queries, categories/products queries extended
- [x] Index pages link to /categories/[slug], /brands/[slug]
