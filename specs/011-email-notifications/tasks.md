# Task: Email Notifications

## Phase 1: Infrastructure

- [x] Install `resend` and `@react-email` packages
- [x] Configure `RESEND_API_KEY` in `.env.local`
- [x] Create `lib/mail.ts` utility
- [x] Add `emails/` directory and scripts to `package.json`

## Phase 2: Templates

- [x] Create `emails/components/Layout.tsx` (Logo, Footer)
- [x] Create `emails/OrderConfirmation.tsx` template
- [x] Verify template in React Email dev server

## Phase 3: Integration

- [x] Update `lib/actions/checkout.ts` to send email on COD order
- [x] Email includes order details, items, and shipping address

## Phase 4: Verification

- [x] Build passes
- [ ] Live test with actual RESEND_API_KEY (pending key)
