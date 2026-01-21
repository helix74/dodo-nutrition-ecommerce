# Plan: UI Unification (007)

## Goal

Unify the frontend UI to match the Admin Dashboard's premium dark theme by replacing hardcoded colors with semantic CSS variables.

## Affected Components

### 1. Product Page (`app/(app)/products/[slug]/page.tsx`)

- **Current**: `bg-zinc-50 dark:bg-zinc-900`
- **Target**: `bg-background`
- **Reason**: Ensure deep black background consistent with Admin.

### 2. Product Card (`components/app/ProductCard.tsx`)

- **Current**: `bg-white` / `dark:bg-zinc-900`
- **Target**: `bg-card` + `border-border`
- **Reason**: Cards should use the `#111111` card color, not `zinc-900`.

### 3. Global CSS (`app/globals.css`)

- **Action**: Verify `bg-card` is `#111111` and `border` is `#222222`.
- **Action**: Ensure `dodo-yellow` is consistent.

## Verification

- Visual check of Product Page.
- Visual check of Shop Grid.
- Ensure no "grey" blocks where "black" is expected.
