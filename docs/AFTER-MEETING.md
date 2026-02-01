# After Meeting - Decisions Needed

> **Purpose**: Things that need Dodo's approval or are for later phases  
> **Date**: 2026-02-01

---

## Requires Dodo's Decision 💰

### Q5: ERP Expansion

**Question**: Should we expand to full ERP system?

| Feature                  | Effort  | Purpose                  |
| ------------------------ | ------- | ------------------------ |
| Multi-location inventory | 2 weeks | 2 local + 4 présentoires |
| Supplier management      | 2 weeks | Track fournisseurs       |
| Invoice generation       | 1 week  | Factures automatiques    |
| Employee roles           | 1 week  | Team access control      |

**Cost Impact**: Development time only (no monthly fees)

**Decision Needed**: Does Dodo want this? Budget for development?

---

### Q7: Tracking Pixels

**Question**: Which platforms to integrate?

| Pixel              | Monthly Cost | Purpose                |
| ------------------ | ------------ | ---------------------- |
| Meta Pixel         | Free         | Facebook/Instagram ads |
| Google Analytics 4 | Free         | Traffic analysis       |
| TikTok Pixel       | Free         | TikTok ads             |
| Meta CAPI          | Free         | Server-side tracking   |

**Decision Needed**: Which platforms will Dodo use for advertising?

---

### Q12: Payment Options

**Question**: Add online payment besides COD?

| Option       | Available in TN | Effort |
| ------------ | --------------- | ------ |
| Flouci       | ✅ Yes          | 1 week |
| Konnect      | ✅ Yes          | 1 week |
| Click to Pay | ✅ Yes          | 1 week |

**Cost Impact**: Transaction fees (varies by provider)

**Decision Needed**: Does Dodo want online payment? Which provider?

---

### Q13: Pricing Worries

**Current Plan**: Free tiers will cover ~1000 visitors/day

**If Growth Exceeds**:

- Sanity Pro: ~300 DT/month
- Vercel Pro: ~60 DT/month
- Clerk Pro: ~75 DT/month

**Decision Needed**: Budget for scaling if needed?

---

### Q14: Admin Roles

**Question**: Who needs access to what?

| Role     | Access                     | Example         |
| -------- | -------------------------- | --------------- |
| Owner    | Everything                 | Dodo            |
| Manager  | Orders, Reviews, Inventory | You             |
| Employee | View orders, update status | Staff           |
| Content  | Sanity Studio only         | Content creator |

**Decision Needed**: How many users? Who gets which role?

---

## For Later Phases 📅

### Q3: Migration Possibilities

**Sanity → Custom Backend**

- When: If Sanity costs become too high
- Effort: 2-3 weeks
- Keep in reserve

**Web → Mobile App**

- Phase 1: PWA (1 day) - can do anytime
- Phase 2: Capacitor (2 weeks) - if needed
- Phase 3: React Native (8 weeks) - major project

---

### Q15: Zustand Deep Dive

Already explained. No action needed.

---

### Q16: AI Assistant Upgrades

**Future Improvements**:

- Darija support (better model)
- Rate limiting (prevent abuse)
- Admin AI for reports
- Marketing suggestions

**When**: After basic features complete

---

### Q18: Server/Client Architecture

Already properly configured. Educational only.

---

### Q19: Testing Strategy

**When to Implement**:

1. After all "before meeting" features done
2. Before production launch
3. E2E tests for checkout flow

---

### Q21: Product Data Upload

**Template Needed**: Create batch import format

**When**: When Dodo provides all product data

**What We Need**:

- Product list (name, price, SKU)
- Categories mapping
- Brand mapping
- Images (we'll handle upload)

---

### Q22: Schema Improvements

**Pack Schema**: Already complete

**Product Schema**:

- Meta fields are important for SEO (keep them)
- Will be used when we do SEO optimization

---

## Priority Summary

| Phase             | Items               | Depends On         |
| ----------------- | ------------------- | ------------------ |
| **Now**           | Before-meeting work | Just us            |
| **After Meeting** | Pixels, Payments    | Dodo's ad strategy |
| **Future**        | ERP, Mobile App     | Business growth    |
| **Reserve**       | Migration           | Only if costs rise |
