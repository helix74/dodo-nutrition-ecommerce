---
name: sanity-data-pipeline
description: Sanity CMS data import/export pipeline for Dodo Nutrition. Use when importing products, categories, brands, or any content into Sanity. Covers CSV to NDJSON conversion, data validation, and import procedures.
---

# Sanity Data Pipeline

## Architecture

```
data/               → CSV source files
scripts/            → Conversion scripts
*.ndjson            → Import-ready files (project root)
```

## Import Flow

```
CSV → validate → scripts/csv-to-ndjson.ts → .ndjson → npx sanity dataset import
```

## ID Conventions (CRITICAL)

| Type | Pattern | Example |
|------|---------|---------|
| Product | `product-{brand-slug}-{product-slug}` | `product-optimum-nutrition-gold-standard` |
| Category | `category-{slug}` | `category-proteines` |
| Brand | `brand-{slug}` | `brand-applied-nutrition` |
| Pack | `pack-{slug}` | `pack-starter-kit` |

## NDJSON Format

Each line is one JSON document. Required fields:

```json
{"_id":"product-brand-name","_type":"product","name":"Product Name","slug":{"_type":"slug","current":"product-slug"},"brand":{"_type":"reference","_ref":"brand-slug"},"category":{"_type":"reference","_ref":"category-slug"}}
```

## Import Command

```bash
npx sanity dataset import <file.ndjson> production --replace
```

Use `--replace` to update existing documents by `_id`.

## Existing Scripts

| Script | Purpose |
|--------|---------|
| `scripts/fix-products-csv.ts` | Clean/fix CSV data |
| `scripts/csv-to-ndjson.ts` | Convert CSV to NDJSON |
| `scripts/force-cleanup.ts` | Clean up Sanity dataset |
| `scripts/export-products-csv.ts` | Export products to CSV |

## Data Templates

- `data/template-packs.csv` — Pack import template
- `data/products-database.csv` — Product database

## Validation Before Import

1. Check all referenced IDs exist (brands, categories)
2. Ensure no duplicate `_id` values
3. Verify slug format (lowercase, hyphens, no spaces)
4. Confirm required fields are present

## Current Database State

- 119 products, 10 categories, 21 brands
- 0 packs (awaiting user data)
- 0 reviews, 0 orders (clean slate)
