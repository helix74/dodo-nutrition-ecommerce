- [x] **Phase 1: Infrastructure**
  - [x] Install `resend` and `@react-email` packages
  - [ ] Configure `RESEND_API_KEY` in `.env.local`
  - [x] Create `lib/mail.ts` utility
  - [x] Add `emails/` directory and scripts to `package.json`

- [/] **Phase 2: Templates**
  - [x] Create `emails/components/Layout.tsx` (Logo, Footer)
  - [ ] Create `emails/OrderConfirmation.tsx` template
  - [ ] Verify template in React Email dev server

- [ ] **Phase 3: Integration**
  - [ ] Update `app/api/webhooks/stripe/route.ts` to send email
  - [ ] Update `app/actions/orders.ts` (COD) to send email

- [ ] **Phase 4: Verification**
  - [ ] Test Stripe checkout flow (Test Mode)
  - [ ] Test COD checkout flow
  - [ ] Verify email content and layout
