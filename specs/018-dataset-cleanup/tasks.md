# Spec 018: Dataset Cleanup & Product Import — Tasks

> **Parent Spec**: [spec.md](./spec.md)  
> **Status**: ✅ 100% Complete  
> **Last Verified**: 2026-02-14

---

## Phase 1: CSV Analysis & Template ✅

### 1.1 Raw CSV Analysis

- [x] Read `data/dodo_nutrition_120_produits_COMPLET.csv`
- [x] Identify all 120+ rows and column structure
- [x] Document data quality issues (HTML in descriptions, empty prices, messy benefits)
- [x] Identify 1 duplicate product (`name + brand` collision)
- [x] Map raw CSV columns to Sanity schema fields

### 1.2 Template & Guide

- [x] Create CSV column specification (20 columns mapped to schema)
- [x] Define 10 target categories with regex-based matching rules
- [x] Document array field format (pipe `|` separator)
- [x] Document enum values for `unit` field
- [x] Create markdown guide for AI agent data transformation

---

## Phase 2: CSV Cleaning Script ✅

### 2.1 Core Script

**File**: `scripts/fix-products-csv.ts`

- [x] Create script structure with `csv-parse/sync` and `csv-stringify/sync`
- [x] Implement `CATEGORY_RULES` — 10 categories with priority-ordered regex patterns
- [x] Implement `GENERIC_TEMPLATES` — detect and replace SEO-stuffed descriptions
- [x] Implement `CATEGORY_DESCRIPTIONS` — fallback descriptions per category
- [x] Implement `FEATURED_PRODUCTS` — Set of 8 featured `name|brand` pairs

### 2.2 Cleaning Functions

- [x] `stripHtml()` — remove all HTML tags, line breaks, emojis
- [x] `createShortDescription()` — extract first paragraph, max 300 chars, sentence boundary
- [x] `cleanBenefits()` — parse numbered lists/commas/pipes, max 8, deduplicate
- [x] `cleanCertifications()` — validate against `VALID_CERTS` list, standardize names
- [x] `cleanFlavors()` — remove "Sans saveur", "N/A", clean strings
- [x] `mapUnit()` — map ml→millilitre, softgel→gélule, etc., infer from product name
- [x] `cleanAllergens()` — strip HTML, truncate to 500 chars
- [x] `cleanDosage()` — strip HTML, truncate to 500 chars
- [x] `generatePlaceholderPrices()` — realistic TND pricing by category, quantity, unit, brand
- [x] `createMetaTitle()` — SEO title, max 60 chars, includes brand
- [x] `createMetaDescription()` — SEO description, max 160 chars, includes category

### 2.3 Deduplication

- [x] Build `Set<string>` keyed on `name.toLowerCase()|brand.toLowerCase()`
- [x] Filter duplicates (keep first occurrence)
- [x] Log removed duplicates to console
- [x] Result: 120 → 119 unique products

### 2.4 Output

- [x] Generate `data/products-final.csv` with 119 clean rows
- [x] Verify all required fields present and non-empty
- [x] Verify all categories map to one of 10 target slugs
- [x] Verify unit values are valid schema enums
- [x] Verify metaTitle ≤ 60 chars, metaDescription ≤ 160 chars

---

## Phase 3: NDJSON Conversion & Import ✅

### 3.1 Conversion Script

**File**: `scripts/csv-to-ndjson.ts`

- [x] Read `data/products-final.csv`
- [x] Generate 21 brand documents with `brand-{slug}` IDs
- [x] Generate 9 category documents with `category-{slug}` IDs and titles/descriptions
- [x] Generate 119 product documents with `product-{brand-slug}-{product-slug}` IDs
- [x] Parse pipe-separated arrays (`|`) into JSON arrays for flavors, benefits, certifications
- [x] Convert numeric strings to actual numbers (quantity, servings, prices, stock)
- [x] Build reference objects: `{ _type: "reference", _ref: "brand-{slug}" }`
- [x] Build slug objects: `{ _type: "slug", current: "{slug}" }`
- [x] Remove `undefined` or empty values from documents
- [x] Validate all brand/category references point to generated documents
- [x] Write `scripts/output/dodo-nutrition.ndjson` (149 documents)

### 3.2 Sanity Import

- [x] Run `npx sanity dataset import scripts/output/dodo-nutrition.ndjson production --replace`
- [x] Verify 149 documents imported successfully
- [x] Verify product count in Sanity matches expected 119

---

## Phase 4: Duplicate Cleanup ✅

### 4.1 Analysis Script

**File**: `scripts/cleanup-sanity.ts`

- [x] Query all products, categories, brands from Sanity
- [x] Identify old `product-N` (numeric ID) products
- [x] Identify duplicate categories
- [x] Identify orphan brands
- [x] Identify test data (orders, reviews, packs)
- [x] Generate deletion report

### 4.2 Force Cleanup Script

**File**: `scripts/force-cleanup.ts`

- [x] Implement `@sanity/client` for programmatic deletion
- [x] Delete referencing documents first (orders, reviews, test packs)
- [x] Delete 80 old `product-N` products (regex: `/^product-\d+$/`)
- [x] Delete 4 duplicate old categories
- [x] Delete 1 orphan brand (`brand-william-bonac`)
- [x] Delete draft documents (`drafts.*`)
- [x] Verify final counts: 119 products, 10 categories, 21 brands

### 4.3 Reference Integrity Validation

- [x] Query all 119 products for broken brand references → 0 broken
- [x] Query all 119 products for broken category references → 0 broken
- [x] Verify category product counts sum to 119
- [x] Verify brand product counts sum to 119

---

## Phase 5: Export & Handoff ✅

### 5.1 Products Export

**File**: `scripts/export-products-csv.ts`

- [x] Query all 119 products from Sanity (including dereferenced brand/category)
- [x] Handle BOM (Byte Order Mark) in Sanity CLI output
- [x] Map arrays to pipe-separated strings
- [x] Output `data/products-database.csv`
- [x] Verify CSV opens correctly and all 119 rows present

### 5.2 Pack Templates

- [x] Create `data/template-packs.csv` with correct column headers
- [x] Create `data/example-packs.csv` with 2 example packs
- [x] Verify column names match `packType` schema fields

---

## Verification ✅

### Build Checks

- [x] `npx tsc --noEmit` — 0 errors
- [x] `npx sanity schema extract` — success
- [x] `npx sanity typegen generate` — success (4 non-critical warnings on paginated queries)

### Data Integrity

- [x] 119 products in Sanity
- [x] 10 categories with correct slugs
- [x] 21 brands, each with ≥1 product
- [x] 0 broken brand references
- [x] 0 broken category references
- [x] All `GOAL_CATEGORIES` slugs match real categories

### Front-End Verification

- [x] Homepage loads with 10 parallel Sanity queries
- [x] Shop page loads with filter/search/pagination
- [x] Product detail pages load with reviews + related products
- [x] MegaMenu fetches categories + brands
- [x] Goal navigation maps to valid category slugs
- [x] SanityLive rendered in layout

### Runtime

- [x] Pages return HTTP 200 when internet is stable
- [x] `fetch failed` errors confirmed as network timeouts (not code bugs)
