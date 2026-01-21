# Plan: Initial Project Retrofit

## Goal

Clean up the project root and establish standard directory conventions.

## Proposed Changes

### 1. Data Organization

#### [NEW] `data/` directory

- Create a `data/` directory to hold raw data files.
- Move `dodo_nutrition_120_produits_COMPLET_sanity.csv` to `data/`.
- Move `sample-data.ndjson` to `data/`.

### 2. Asset Organization

#### [MODIFY] `public/`

- Move `logo_dodo_nutrition.png` to `public/logo_dodo_nutrition.png`.

### 3. Code Standardization

#### [RENAME] `proxy.ts` -> `middleware.ts`

- The file `proxy.ts` contains Clerk middleware logic. Next.js expects this file to be named `middleware.ts` in the root.
- Rename `proxy.ts` to `middleware.ts`.

## Verification Plan

### Automated Verification

- `npm run dev` should still start without errors.
- Clerk authentication should still work (middleware check).
- Verify file existence in new locations.

### Manual Verification

- User checks the root directory is cleaner.
