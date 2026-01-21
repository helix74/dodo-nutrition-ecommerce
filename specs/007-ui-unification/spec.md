# Feature 007: UI Unification & Dark Theme Polish

> **Status**: 📋 Planning
> **Priority**: 🔴 High
> **Date**: 2026-01-18

---

## 🎯 Goal

Unify the UI design across the entire website to match the **Admin Dashboard's premium dark theme**. The current site has inconsistencies where some pages use hardcoded `zinc-*` colors instead of the global CSS variables (`--background`, `--card`, `--border`).

## 🔍 Analysis

### Current State

- **Admin Dashboard**: Uses `bg-background` (#0a0a0a), `bg-card` (#111111), `border-border` (#222222). **(Reference Standard)**
- **Shop Page**: Uses `bg-background` (Correct).
- **Product Page**: Uses `bg-zinc-900` (Incorrect).
- **Product Card**: Uses `bg-white` / `dark:bg-zinc-900` (Incorrect).
- **Global**: Some components mix Tailwind colors with CSS variables.

### Target State

All components must use the semantic CSS variables defined in `globals.css`:

- Background: `bg-background`
- Card: `bg-card`
- Border: `border-border`
- Text: `text-foreground` / `text-muted-foreground`
- Accents: `text-dodo-yellow` / `bg-dodo-yellow`

---

## 📋 Scope

### 1. Global Variables

- [ ] Verify `globals.css` matches the Admin theme exactly.

### 2. Components Polish

- [ ] `ProductCard.tsx`: Replace `bg-white/zinc-900` with `bg-card`.
- [ ] `Header.tsx`: Ensure consistent dark background and border.
- [ ] `Footer.tsx`: Ensure consistent dark background.
- [ ] `Button.tsx`: Verify primary/secondary variants.

### 3. Pages Polish

- [ ] `app/(app)/products/[slug]/page.tsx`: Fix background colors.
- [ ] `app/(app)/shop/page.tsx`: Verify filters and grid layout.
- [ ] `app/(app)/page.tsx` (Home): Verify Hero and sections.

---

## ✅ Success Criteria

- [ ] No hardcoded `bg-zinc-*` or `bg-slate-*` visible in dark mode.
- [ ] All cards use `bg-card` with `border-border`.
- [ ] Text contrast is accessible.
- [ ] "Premium" feel is consistent between Admin and Shop.
