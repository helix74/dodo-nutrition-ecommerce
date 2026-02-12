# Verification: Email Notifications (F3)

> **Status**: ✅ Verified (Code & Build)
> **Date**: 2026-01-22

## 1. Automated Checks

- [x] **Build Verification**: `pnpm build` passes without errors.
- [x] **Type Safety**: No TypeScript errors in `route.ts` or `OrderConfirmation.tsx`.
- [x] **Dependencies**: `resend` and `@react-email` packages installed.

## 2. Functional Verification (Manual)

### A. Stripe Integration

- [ ] **Trigger**: Webhook `checkout.session.completed` fires.
- [ ] **Data Extraction**:
  - [ ] Customer email retrieved correctly.
  - [ ] Product details (names, images) fetched from Sanity using IDs.
  - [ ] Order created in Sanity with correct status.
- [ ] **Email Sending**:
  - [ ] `resend.emails.send` called with correct arguments.
  - [ ] Email delivered to customer.

### B. COD Integration

- [ ] **Trigger**: `createCODOrder` server action called.
- [ ] **Data Extraction**:
  - [ ] Cart items mapped correctly to email items.
- [ ] **Email Sending**:
  - [ ] Email delivered to customer immediately.

### C. Email Content

- [ ] **Subject Line**: "Confirmation de commande [OrderNumber] - Dodo Nutrition".
- [ ] **Branding**: Dark theme, Logo present.
- [ ] **Order Details**:
  - [ ] Customer Name correct.
  - [ ] Order ID matches.
  - [ ] List of items (Image, Name, Qty, Price) correct.
  - [ ] Total amount matches.
  - [ ] Shipping address correct.

## 3. Configuration

- [ ] **Environment**: `RESEND_API_KEY` set in `.env.local`.
- [ ] **Domain**: Domain verified in Resend dashboard (for production).
