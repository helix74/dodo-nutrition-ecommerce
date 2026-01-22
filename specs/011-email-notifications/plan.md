# Implementation Plan: Email Notifications (F3)

> **Status**: Proposed
> **Target**: Order Confirmation MVP

## Phase 1: Infrastructure Setup

- [ ] **Install Dependencies**: `resend`, `@react-email/components`, `@react-email/tailwind`.
- [ ] **Configure Environment**: Add `RESEND_API_KEY` to `.env.local`.
- [ ] **Setup React Email**: Initialize `emails/` directory and preview server script.
- [ ] **Create Mail Utility**: `lib/mail.ts` to export the Resend client.

## Phase 2: Template Development

- [ ] **Create Layout**: `emails/components/Layout.tsx` (Logo, Footer, Styles).
- [ ] **Create Order Template**: `emails/OrderConfirmation.tsx`.
  - Dynamic props: `customerName`, `orderId`, `items`, `total`, `shippingAddress`.
  - Mock data for previewing.
- [ ] **Verify Design**: Run React Email dev server to check responsiveness and dark mode compatibility.

## Phase 3: Integration

- [ ] **Stripe Webhook**:
  - Modify `app/api/webhooks/stripe/route.ts`.
  - Extract customer email and order details from metadata/session.
  - Call `resend.emails.send()` with the rendered template.
- [ ] **COD Action**:
  - Modify `app/actions/orders.ts` (create if needed for COD).
  - Trigger email sending upon successful COD order creation.

## Phase 4: Verification

- [ ] **Test Mode**: Use Resend's test mode (sends to verified email only).
- [ ] **Stripe Test**: Perform a test purchase in Stripe Test Mode.
- [ ] **COD Test**: Place a COD order.
- [ ] **Check Inbox**: Verify email delivery, layout, and data accuracy.
