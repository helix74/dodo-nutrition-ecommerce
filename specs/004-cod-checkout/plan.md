# Implementation Plan: Feature 004 - COD Checkout

> **Based on**: [spec.md](./spec.md)  
> **Status**: Draft

---

## 📋 Summary

Implement a Cash on Delivery checkout system with:

- Guest + Clerk authentication
- Simple address form (7 fields + 1 optional notes)
- 24 Tunisian gouvernorats
- Order creation with stock management

---

## 🗂️ Proposed Changes

### Phase 1: Database Schema Updates

#### [MODIFY] [orderType.ts](file:///C:/Users/Mohamed%20Ali%20Jardak/.gemini/antigravity/scratch/ecommerce-ai/sanity/schemaTypes/orderType.ts)

Add fields:

- `phone` (string, required)
- `gouvernorat` (string, required)
- `notes` (text, optional)
- `paymentMethod` (string, default: 'cod')
- Update `status` options: `pending`, `confirmed`, `shipped`, `delivered`, `cancelled`

---

### Phase 2: Server Actions

#### [MODIFY] [checkout.ts](file:///C:/Users/Mohamed%20Ali%20Jardak/.gemini/antigravity/scratch/ecommerce-ai/lib/actions/checkout.ts)

Add new function:

```typescript
export async function createCODOrder(
  data: CODOrderData,
): Promise<{ orderId: string; orderNumber: string }>;
```

- Validate cart items
- Check stock availability
- Create order in Sanity
- Decrement stock (atomic transaction)
- Return order number

---

### Phase 3: UI Components

#### [NEW] [CheckoutForm.tsx](file:///C:/Users/Mohamed%20Ali%20Jardak/.gemini/antigravity/scratch/ecommerce-ai/components/app/CheckoutForm.tsx)

Address form with:

- Nom complet\*
- Téléphone\* (+216)
- Adresse\*
- Ville\*
- Gouvernorat\* (dropdown, default: Tunis)
- Code postal
- Email\* (guest only)
- Notes de livraison

#### [NEW] [GouvernoratSelect.tsx](file:///C:/Users/Mohamed%20Ali%20Jardak/.gemini/antigravity/scratch/ecommerce-ai/components/app/GouvernoratSelect.tsx)

Dropdown component with 24 gouvernorats.

#### [NEW] [LoginPromptDialog.tsx](file:///C:/Users/Mohamed%20Ali%20Jardak/.gemini/antigravity/scratch/ecommerce-ai/components/app/LoginPromptDialog.tsx)

Smart popup for guest users:

- Google/Facebook/TikTok login buttons
- "Continuer sans compte" option

---

### Phase 4: Pages

#### [MODIFY] [checkout/page.tsx](<file:///C:/Users/Mohamed%20Ali%20Jardak/.gemini/antigravity/scratch/ecommerce-ai/app/(app)/checkout/page.tsx>)

- Remove/disable Stripe redirect
- Add CheckoutForm
- Show cart summary
- Handle form submission

#### [MODIFY] [checkout/success/page.tsx](<file:///C:/Users/Mohamed%20Ali%20Jardak/.gemini/antigravity/scratch/ecommerce-ai/app/(app)/checkout/success/page.tsx>)

- Accept order data from query params or session
- Show Darija thank you message
- Add upselling section
- CTAs: "Continuer vos achats", "Voir mes commandes"

---

### Phase 5: Data Constants

#### [NEW] [gouvernorats.ts](file:///C:/Users/Mohamed%20Ali%20Jardak/.gemini/antigravity/scratch/ecommerce-ai/lib/constants/gouvernorats.ts)

```typescript
export const GOUVERNORATS = [
  "Tunis",
  "Ariana",
  "Ben Arous",
  "Manouba",
  "Nabeul",
  "Zaghouan",
  "Bizerte",
  "Béja",
  "Jendouba",
  "Le Kef",
  "Siliana",
  "Sousse",
  "Monastir",
  "Mahdia",
  "Sfax",
  "Kairouan",
  "Kasserine",
  "Sidi Bouzid",
  "Gabès",
  "Médenine",
  "Tataouine",
  "Gafsa",
  "Tozeur",
  "Kébili",
];
```

---

## 📁 Files Summary

| Action | File                                   | Description          |
| ------ | -------------------------------------- | -------------------- |
| MODIFY | `sanity/schemaTypes/orderType.ts`      | Add COD fields       |
| MODIFY | `lib/actions/checkout.ts`              | Add `createCODOrder` |
| NEW    | `components/app/CheckoutForm.tsx`      | Address form         |
| NEW    | `components/app/GouvernoratSelect.tsx` | Dropdown             |
| NEW    | `components/app/LoginPromptDialog.tsx` | Auth popup           |
| NEW    | `lib/constants/gouvernorats.ts`        | 24 gouvernorats      |
| MODIFY | `app/(app)/checkout/page.tsx`          | COD checkout page    |
| MODIFY | `app/(app)/checkout/success/page.tsx`  | COD success page     |

---

## ✅ Verification Plan

### Automated Tests

- [ ] Build passes (`pnpm build`)
- [ ] TypeScript passes (`pnpm typecheck`)

### Manual Testing

- [ ] Guest checkout flow
- [ ] Logged-in checkout flow
- [ ] Form validation (phone format, required fields)
- [ ] Order appears in Sanity Studio
- [ ] Stock decremented after order
- [ ] Success page shows order details
- [ ] Mobile responsive

---

## 🚫 Not Included (Future)

- Ciblex API integration
- SMS notifications
- Email confirmation
- Multiple saved addresses
- Loyalty points

---

## 📝 Notes

- Keep Stripe code for future features
- Phone validation: +216 XX XXX XXX or 216XXXXXXXX or XXXXXXXX
- Default gouvernorat: Tunis
