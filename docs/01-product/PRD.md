# Product Requirements Document (PRD)

> **Project**: Dodo Nutrition E-commerce Platform  
> **Version**: 1.0  
> **Last Updated**: 2026-01-31

---

## 1. Objectives

### Business Objectives

- Launch an online store for supplements and sports nutrition
- Enable Cash on Delivery (COD) purchases for Tunisian customers
- Build a modern, professional e-commerce brand presence

### Technical Objectives

- Build a performant, SEO-friendly Next.js application
- Integrate with Sanity CMS for content management
- Implement AI-powered features (chatbot, admin insights)

---

## 2. Success Metrics

| Metric                | Target            |
| --------------------- | ----------------- |
| Page Load Time        | < 3s              |
| Mobile Score          | > 90 (Lighthouse) |
| Checkout Success Rate | > 70%             |
| Build Time            | < 5 min           |

---

## 3. Core Features (Must-Have)

### Customer-Facing

| Feature                | Status      |
| ---------------------- | ----------- |
| Product Catalog        | ✅ Complete |
| Product Detail Pages   | ✅ Complete |
| Shopping Cart          | ✅ Complete |
| Wishlist               | ✅ Complete |
| COD Checkout           | ✅ Complete |
| Order History          | ✅ Complete |
| User Authentication    | ✅ Complete |
| Product Search         | ✅ Complete |
| Category Filtering     | ✅ Complete |
| Reviews & Testimonials | ✅ Complete |
| Packs/Bundles          | ✅ Complete |
| AI Shopping Assistant  | ✅ Complete |

### Admin Panel

| Feature                  | Status      |
| ------------------------ | ----------- |
| Dashboard with Analytics | ✅ Complete |
| Order Management         | ✅ Complete |
| Inventory Management     | ✅ Complete |
| Review Moderation        | ✅ Complete |
| AI Insights              | ✅ Complete |

### CMS (Sanity)

| Feature             | Status      |
| ------------------- | ----------- |
| Product Management  | ✅ Complete |
| Category Management | ✅ Complete |
| Brand Management    | ✅ Complete |
| Banner Management   | ✅ Complete |
| Order Viewing       | ✅ Complete |

---

## 4. Out of Scope (v1.0)

| Feature               | Reason                             |
| --------------------- | ---------------------------------- |
| Stripe/Card Payments  | Tunisian market uses COD           |
| Multi-language Toggle | Integrated FR/Darija is sufficient |
| User Accounts Page    | Clerk handles profile              |
| Real-time Stock Sync  | Manual CMS sufficient              |
| Mobile App            | Web-first approach                 |

---

## 5. Technical Constraints

| Constraint      | Requirement                               |
| --------------- | ----------------------------------------- |
| SEO             | Server-side rendering, meta tags          |
| Performance     | Static generation where possible          |
| Accessibility   | WCAG 2.1 AA compliance target             |
| Browser Support | Modern browsers (Chrome, Safari, Firefox) |
| Mobile          | Responsive, touch-optimized               |

---

## 6. Integrations

| Service | Purpose                     |
| ------- | --------------------------- |
| Clerk   | Authentication              |
| Sanity  | Content Management          |
| Stripe  | Payment processing (future) |
| Resend  | Email notifications         |
| Groq    | AI features                 |
| Vercel  | Hosting                     |

---

## 7. Dependencies

- ADMIN_EMAILS environment variable for admin access
- Sanity project with write token
- Clerk application keys
- Groq API key for AI features
