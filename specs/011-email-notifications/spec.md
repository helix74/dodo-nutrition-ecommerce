# Specification: Email Notifications (F3)

> **Status**: Draft
> **Priority**: Medium
> **Owner**: Dodo Nutrition Engineering

## 1. Overview

The goal of this feature is to implement a robust transactional email system for Dodo Nutrition. The primary use case for the MVP is sending **Order Confirmation** emails to customers immediately after a successful purchase.

## 2. Goals

- **Reliability**: Ensure emails are delivered promptly and reliably.
- **Branding**: Emails must match the Dodo Nutrition brand (Dark theme, Gold/Red accents).
- **Maintainability**: Use modern tools (React Email) to make template updates easy.
- **Scalability**: Set up a provider (Resend) that can handle future needs (marketing, auth, etc.).

## 3. User Stories

- **As a Customer**, I want to receive an email confirmation after I place an order so that I have a record of my purchase and know it was received.
- **As an Admin**, I want to receive an email when stock for a product is low (optional/future) so I can restock.

## 4. Technical Approach

### 4.1. Stack

- **Provider**: [Resend](https://resend.com) (Best-in-class DX, generous free tier).
- **Templating**: [React Email](https://react.email) (Write emails in React/Tailwind).
- **Trigger**:
  - **Primary**: Stripe Webhook (`checkout.session.completed`).
  - **Secondary**: Server Action (for manual triggers or COD orders).

### 4.2. Architecture

1.  **Templates**: Located in `emails/`.
    - `OrderConfirmation.tsx`: The main template.
2.  **Lib**: `lib/mail.ts` wrapper around Resend SDK.
3.  **API**:
    - Update `app/api/webhooks/stripe/route.ts` to send email on success.
    - Update `app/actions/orders.ts` (if exists) for COD orders.

### 4.3. Data Requirements

The Order Confirmation email needs:

- Customer Name
- Order ID
- List of Items (Name, Quantity, Price, Image)
- Total Amount
- Shipping Address
- Estimated Delivery (Static text for now, e.g., "24-48h")

## 5. UI/UX Design (Email)

- **Header**: Dodo Nutrition Logo (centered).
- **Body**:
  - "Merci pour votre commande, [Name] !"
  - "Nous préparons votre commande avec soin."
  - Order Summary Table.
- **Footer**: Links to site, social media, contact info.
- **Style**: Dark mode optimized (or clean light mode with brand colors if dark mode support is spotty in clients). _Recommendation: Clean light mode with dark header is safest for email clients._

## 6. Constraints & Risks

- **Deliverability**: Need to verify domain (DNS records) on Resend. _Dev mode only sends to verified email._
- **Images**: Product images in emails must be absolute URLs (Sanity CDN).

## 7. Out of Scope (MVP)

- Marketing emails / Newsletters.
- Abandoned cart emails.
- User account emails (Welcome, Reset Password) - unless Auth is prioritized.
