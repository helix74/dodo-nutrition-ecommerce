# Enhancements Implementation Plan

## Goal

Implement Social Login (I1), Darija Translations (I3), and Static Pages (I4).

## User Review Required

- **Clerk Configuration**: User needs to enable Facebook and TikTok in Clerk Dashboard. I cannot do this via code.
- **Translations**: Verify Darija phrasing.

## Proposed Changes

### I1: Social Login

- **File**: `middleware.ts`, `app/(auth)/...`
- **Action**: Verify if we use `<SignIn />` (default) or custom. If default, no code change needed for buttons, just config.

### I3: Darija Translations

- **Header**: "Rechercher", "Panier", "Compte" -> Darija equivalents.
- **Hero**: "Découvrir", "Voir les promos" -> Darija.
- **Footer**: Section titles.

### I4: Static Pages

#### [NEW] `app/(app)/faq/page.tsx`

- FAQ content (Accordion style).

#### [NEW] `app/(app)/livraison/page.tsx`

- Delivery information.

#### [NEW] `app/(app)/cgv/page.tsx`

- Terms and Conditions.

## Verification

- **Social Login**: Check if buttons appear (requires Dashboard config).
- **Translations**: Visual check.
- **Static Pages**: Navigation check.
