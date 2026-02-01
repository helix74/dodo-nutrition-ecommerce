# Before Meeting - Work To Do

> **Purpose**: Things to implement and discuss BEFORE meeting with Dodo  
> **Date**: 2026-02-01

---

## Quick Answer: Q2 - Why Our Stack > Shopify

### Shopify Limitations

| Aspect               | Shopify          | Our Stack          |
| -------------------- | ---------------- | ------------------ |
| **Monthly Cost**     | 300-800 DT       | 0-60 DT            |
| **Transaction Fees** | 2% per sale      | 0%                 |
| **Customization**    | Limited themes   | 100% custom        |
| **AI Features**      | ❌ None          | ✅ Chat + Insights |
| **Admin Dashboard**  | Generic          | Custom for Dodo    |
| **Darija/French UX** | ❌ Hard          | ✅ Native          |
| **COD Integration**  | ❌ 3rd party ($) | ✅ Built-in        |
| **Code Ownership**   | ❌ No            | ✅ Yes             |
| **SEO Control**      | Limited          | Full               |
| **Future Features**  | Pay per app      | Free to build      |

### Tell Dodo

> "Our custom solution costs 10x less monthly, has AI features no competitor has, is fully customized for Tunisia (COD, TND, Darija), and we OWN the code forever. Shopify would cost 300+ DT/month PLUS 2% per sale PLUS apps for each feature."

---

## Priority Order (Specs to Create)

| #   | Spec                        | Questions | Priority    |
| --- | --------------------------- | --------- | ----------- |
| 1   | **Homepage Improvements**   | Q20       | 🔴 Critical |
| 2   | **Shop Page Pagination**    | Q20       | 🔴 Critical |
| 3   | **SEO Optimization**        | Q6        | 🔴 Critical |
| 4   | **Newsletter Backend**      | Q8        | 🔴 Critical |
| 5   | **Email Notifications Fix** | Q8        | 🔴 Critical |
| 6   | **Admin Dashboard Upgrade** | Q9        | 🟠 High     |
| 7   | **Animations Polish**       | Q17       | 🟡 Medium   |
| 8   | **Upsell/Cross-sell**       | Q23       | 🟡 Medium   |

---

## Detailed Breakdown

### Spec 015: Homepage & Shop Improvements (Q20)

**Homepage Sections to Add:**

- [ ] Featured Packs section
- [ ] New Arrivals section
- [ ] Promotions/Sale section
- [ ] Categories grid
- [ ] Brands carousel
- [ ] Better "Why Choose Us" design

**Shop Page:**

- [ ] Change from infinite scroll to pagination (24-30 products)
- [ ] Improve filter UI
- [ ] Add sorting options

---

### Spec 016: SEO Optimization (Q6)

**Immediate:**

- [ ] Dynamic meta titles per product/category
- [ ] Meta descriptions for all pages
- [ ] JSON-LD structured data (Product, Review, Organization)
- [ ] Auto-generate sitemap.xml
- [ ] Optimize robots.txt
- [ ] Add Open Graph tags for products
- [ ] Alt texts for images

---

### Spec 017: Newsletter & Email (Q8)

**Newsletter:**

- [ ] Create newsletter schema in Sanity
- [ ] Connect form to backend
- [ ] Store subscribers

**Email:**

- [ ] Test order confirmation emails
- [ ] Add status update emails
- [ ] Verify Resend integration

---

### Spec 018: Admin Dashboard Upgrade (Q9)

**Improvements:**

- [ ] More detailed analytics charts
- [ ] Recent activity feed
- [ ] Quick stats cards
- [ ] Low stock alerts visual
- [ ] Order status timeline
- [ ] Better mobile layout

---

### Spec 019: Animations (Q17)

**Essential:**

- [ ] Page transitions (Framer Motion)
- [ ] Cart drawer slide animation
- [ ] Product card hover effects
- [ ] Toast notifications animation
- [ ] Loading skeletons
- [ ] Button hover states

---

### Spec 020: Upsell/Cross-sell (Q23)

**Implementation:**

- [ ] Add related products to Sanity schema
- [ ] "Frequently bought together" section
- [ ] Cart page upsell suggestions
- [ ] Checkout page cross-sell

---

## Other Before-Meeting Items

### Q1: Project Rating

- Already documented: 8/10
- Will improve with these specs

### Q4: Success Metrics

- Need analytics to track properly
- Will add with Tracking Pixels (after meeting)

### Q9: Original Project Traces

- Need to audit for remaining traces

### Q10 & Q11: User Stories

- All core stories complete
- Missing stories documented for v2

### Q14: Zustand

- Explained in STRATEGIC-QA.md
- Working correctly

---

## Work Order

1. **First**: Spec 015 (Homepage + Shop) - Biggest visual impact
2. **Second**: Spec 016 (SEO) - Foundation for marketing
3. **Third**: Spec 017 (Newsletter + Email) - Customer communication
4. **Fourth**: Spec 018 (Admin Dashboard) - Impress Dodo
5. **Fifth**: Spec 019 (Animations) - Polish
6. **Sixth**: Spec 020 (Upsell) - Revenue boost
