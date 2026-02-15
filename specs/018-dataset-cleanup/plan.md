# Spec 018: Dataset Cleanup & Product Import — Implementation Plan

> **Parent Spec**: [spec.md](./spec.md)  
> **Status**: ✅ Complete  
> **Last Updated**: 2026-02-14

---

## Overview

Full backend pipeline to go from a messy raw CSV of 120+ products to a clean, deduplicated, schema-compliant Sanity production dataset.

---

## Phase 1: CSV Analysis & Template Design

### 1.1 Analyze Raw CSV

**File**: `data/dodo_nutrition_120_produits_COMPLET.csv`

- Identify all columns and their data quality (HTML, empty values, encoding issues).
- Map each raw column to the target Sanity schema field.
- Identify products with duplicate `name + brand` combinations.

### 1.2 Define Target CSV Template

Create a CSV column spec matching the `productType` schema:

| # | CSV Column | Schema Field | Type | Required |
|---|---|---|---|---|
| 1 | name | name | string | YES |
| 2 | brand | brand (ref) | string | YES |
| 3 | category | category (ref) | string | YES |
| 4 | description | description | text | YES |
| 5 | unit | unit | enum | YES |
| 6 | quantity | quantity | number | YES |
| 7 | servings | servings | number | no |
| 8 | flavors | flavors | string[] | no |
| 9 | benefits | benefits | string[] | no |
| 10 | allergens | allergens | text | no |
| 11 | certifications | certifications | string[] | no |
| 12 | dosage | dosage | text | no |
| 13 | priceRetail | priceRetail | number | YES |
| 14 | pricePurchase | pricePurchase | number | no |
| 15 | priceWholesale | priceWholesale | number | no |
| 16 | priceSlashed | priceSlashed | number | no |
| 17 | stock | stock | number | YES |
| 18 | featured | featured | boolean | no |
| 19 | metaTitle | metaTitle | string | no |
| 20 | metaDescription | metaDescription | text | no |

### 1.3 Define Category Mapping Rules

10 target categories with priority-ordered regex patterns:

1. `proteines` — whey, isolate, casein, protein
2. `creatine` — creatine, créatine
3. `pre-workout` — pre-workout, pump
4. `gainers` — gainer, mass, bulk, weight
5. `bruleurs` — fat, burn, thermo, lipo, carnitine, cla
6. `acides-amines` — bcaa, eaa, amino, glutamine
7. `vitamines` — vitamin, omega, zinc, magnesium, multi
8. `boosters` — testo, tribulus, zma, growth hormone
9. `barres-snacks` — barre, snack, cookie
10. `accessoires` — shaker, ceinture, gant

---

## Phase 2: CSV Cleaning Script

### 2.1 Build Transformation Script

**File**: `scripts/fix-products-csv.ts`

Functions to implement:

| Function | Input | Output | Rules |
|---|---|---|---|
| `stripHtml(html)` | HTML string | Plain text | Remove all tags, line breaks, emojis |
| `createShortDescription(text, cat)` | Raw description | 1-3 sentences | Max 300 chars, no HTML, remove generic templates |
| `cleanBenefits(raw, cat)` | Messy benefits | Pipe-separated | Parse numbered lists/commas, max 8, deduplicate |
| `cleanCertifications(raw)` | Raw certs | Pipe-separated | Validate against allowed list |
| `cleanFlavors(raw)` | Raw flavors | Pipe-separated | Remove "Sans saveur", "N/A" |
| `mapUnit(unit, name)` | CSV unit | Schema enum value | Map synonyms, infer from product name |
| `generatePlaceholderPrices(cat, qty, unit, brand)` | Product metadata | 3 price fields | Realistic TND pricing by category |
| `createMetaTitle(name, brand)` | Name, brand | SEO title | Max 60 chars |
| `createMetaDescription(name, brand, cat)` | Metadata | SEO description | Max 160 chars |

### 2.2 Deduplication

- Build `Set<string>` keyed on `name|brand` (lowercased).
- Keep first occurrence, log removed duplicates.

### 2.3 Output

**File**: `data/products-final.csv` — 119 unique, clean rows.

---

## Phase 3: NDJSON Conversion & Import

### 3.1 Build Conversion Script

**File**: `scripts/csv-to-ndjson.ts`

- Read `data/products-final.csv`.
- Generate brand documents: `brand-{slug}`.
- Generate category documents: `category-{slug}` with titles and descriptions.
- Generate product documents: `product-{brand-slug}-{product-slug}`.
- Parse pipe-separated arrays into JSON arrays.
- Validate all references before writing.

### 3.2 Import to Sanity

```bash
npx sanity dataset import scripts/output/dodo-nutrition.ndjson production --replace
```

- 149 total documents: 21 brands + 9 categories + 119 products.

---

## Phase 4: Duplicate Cleanup

### 4.1 Identify Old Data

- Old products: `product-N` pattern (numeric IDs from previous imports).
- Old categories: duplicates of the newly imported categories.
- Orphan brands: brands with zero product references.
- Test data: orders, reviews, packs created during development.

### 4.2 Build Cleanup Script

**File**: `scripts/force-cleanup.ts`

Strategy:
1. Delete referencing documents first (orders, reviews, packs) to clear reference constraints.
2. Delete old `product-N` products using regex `/^product-\d+$/`.
3. Delete old duplicate categories.
4. Delete orphan brands.

Use `@sanity/client` for programmatic deletion (CLI blocked by reference integrity).

---

## Phase 5: Export & Handoff

### 5.1 Export Products CSV

**File**: `scripts/export-products-csv.ts`

- Query all 119 products from Sanity.
- Map to flat CSV structure.
- Output: `data/products-database.csv`.

### 5.2 Pack Templates

- `data/template-packs.csv` — empty template with correct columns.
- `data/example-packs.csv` — 2 example packs showing correct format.

---

## Dependencies

| Tool | Version | Purpose |
|---|---|---|
| `csv-parse` | (installed) | Parse CSV files |
| `csv-stringify` | (installed) | Generate CSV output |
| `@sanity/client` | (installed) | Programmatic Sanity mutations |
| `sanity` CLI | v3.x | Schema extraction, dataset import |
| Node.js + tsx | v18+ | Script execution |

---

## Execution Order

| # | Phase | Script | Time | Depends On |
|---|---|---|---|---|
| 1 | CSV Analysis | (manual) | 30 min | — |
| 2 | CSV Cleaning | `fix-products-csv.ts` | 2 hours | Phase 1 |
| 3 | NDJSON + Import | `csv-to-ndjson.ts` | 30 min | Phase 2 |
| 4 | Cleanup | `force-cleanup.ts` | 45 min | Phase 3 |
| 5 | Export | `export-products-csv.ts` | 15 min | Phase 4 |

**Total**: ~4 hours

---

## Verification Checkpoints

After each phase:

- [ ] `npx tsc --noEmit` passes
- [ ] `npx sanity schema extract` succeeds
- [ ] Data counts match expectations
- [ ] Reference integrity validated
