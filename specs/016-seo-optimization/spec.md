# Spec 016: SEO Optimization

> **Status**: In Progress  
> **Priority**: 🔴 Critical (for Google ranking)  
> **Impact**: Better search visibility, more organic traffic

---

## Problem Statement

Current SEO is basic (6/10):

- Product pages missing dynamic meta tags
- No structured data (JSON-LD)
- No sitemap.xml
- Missing Open Graph tags for social sharing

---

## Goals

1. **Meta Tags**: Dynamic meta title/description per product/page
2. **Structured Data**: JSON-LD for products and organization
3. **Sitemap**: Auto-generated sitemap.xml
4. **Open Graph**: Rich social previews
5. **Robots.txt**: Proper crawl instructions

---

## Technical Approach

### 1. Product Pages - Dynamic Metadata

Add `generateMetadata` function to product pages using product data.

### 2. JSON-LD Structured Data

Add Product schema with:

- Name, description, price
- Images, brand, availability
- Review ratings

Add Organization schema on homepage.

### 3. Sitemap Generation

Use Next.js built-in sitemap.ts for auto-generation.

### 4. Open Graph

Meta tags for Facebook, Twitter card preview.

---

## Success Criteria

- [ ] Product pages have unique meta titles/descriptions
- [ ] JSON-LD visible in page source
- [ ] /sitemap.xml returns valid XML
- [ ] Social share shows rich preview
- [ ] Build passes
