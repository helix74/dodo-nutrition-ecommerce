# Specification: Product Schema Redesign (Feature 002)

## Goal

Reorganize and optimize the Product schema in `sanity/schemaTypes/productType.ts` to:

1. **Simplify data entry** in Sanity Studio for employees
2. **Enable rich SEO storytelling** with Portable Text
3. **Clean up redundant/useless fields**
4. **Organize fields into logical groups**

---

## Current State Analysis

### Existing Fields (29 total)

The current schema has fields from a generic furniture e-commerce template plus nutrition-specific fields. Some are redundant or incorrectly organized.

### Key Issues Identified

| Issue                            | Field(s)          | Resolution                             |
| -------------------------------- | ----------------- | -------------------------------------- |
| `metaKeywords` is useless        | `metaKeywords`    | **DELETE** (Google ignores since 2009) |
| `longDescription` is plain text  | `longDescription` | **UPGRADE** to Portable Text           |
| Field groups need reorganization | All               | Restructure for clarity                |

---

## Proposed Schema Structure

### Field Groups (7 tabs in Studio)

```
1. BASIC INFO     → name, slug, brand, category, description
2. SPECIFICATIONS → unit, quantity, servings, flavors
3. STORYTELLING   → content (Portable Text), benefits, dosage, allergens, certifications
4. MEDIA          → images
5. PRICING        → priceRetail, priceSlashed, pricePurchase, priceWholesale
6. INVENTORY      → stock, featured
7. SEO            → metaTitle, metaDescription
```

---

## Detailed Field Changes

### DELETE

| Field          | Reason                                      |
| -------------- | ------------------------------------------- |
| `metaKeywords` | Google has ignored meta keywords since 2009 |

### RENAME/UPGRADE

| Old Field         | New Field | Type Change                      |
| ----------------- | --------- | -------------------------------- |
| `longDescription` | `content` | `text` → `array` (Portable Text) |

### REORGANIZE (Same fields, better groups)

| Field            | Old Group | New Group      |
| ---------------- | --------- | -------------- |
| `unit`           | nutrition | specifications |
| `quantity`       | nutrition | specifications |
| `servings`       | nutrition | specifications |
| `flavors`        | nutrition | specifications |
| `benefits`       | nutrition | storytelling   |
| `allergens`      | nutrition | storytelling   |
| `certifications` | nutrition | storytelling   |
| `dosage`         | nutrition | storytelling   |

---

## Portable Text Schema for `content`

The new `content` field will support:

- **Headings** (H2, H3, H4)
- **Paragraphs** with bold, italic, links
- **Bullet and numbered lists**
- **Tables** (for nutrition facts)
- **Block quotes** (for testimonials)
- **Custom blocks** (future: ingredient cards, FAQ accordions)

---

## SEO Strategy

| Purpose          | Primary Field     | Fallback                      |
| ---------------- | ----------------- | ----------------------------- |
| Page Title       | `metaTitle`       | If empty → `name`             |
| Page Description | `metaDescription` | If empty → `description`      |
| Rich Content     | `content`         | Portable Text renders as HTML |

Next.js `generateMetadata` will auto-generate from product data if meta fields are empty.

---

## User Stories

- **As an Employee**, I want clear tabs in Sanity Studio so I can quickly add products without confusion.
- **As the SEO**, I want rich content blocks so I can create storytelling product pages with tables and headings.
- **As a Developer**, I want Portable Text so I can render beautiful HTML on the frontend.
- **As a Manager**, I want pricing fields organized together for quick reference.

---

## Success Criteria

- [ ] `metaKeywords` field removed
- [ ] `longDescription` renamed to `content` with Portable Text type
- [ ] All fields organized into 7 logical groups
- [ ] Sanity Studio shows clear, organized tabs
- [ ] Existing data migrates cleanly (no data loss)

---

## Out of Scope (Future)

- Role-based field visibility (hide business fields from employees)
- Pack/Bundle schema
- Image upload automation
