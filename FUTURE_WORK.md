# Future Work - Dodo Nutrition

> **Created**: 2026-01-31  
> **Purpose**: Document future features with context for smooth continuation

---

## 🚚 Ciblex Integration (HIGH PRIORITY - Post-Launch)

### Context

Ciblex is **already in production** on the old website. Cannot migrate until after initial launch.

### Planned System: Two Delivery Options

| Delivery Type | Coverage                          | Method                 |
| ------------- | --------------------------------- | ---------------------- |
| **Local**     | Tunis, Ben Arous, Manouba, Ariana | Local delivery service |
| **National**  | Hors 4 villes (rest of Tunisia)   | Ciblex API             |

### Why Later?

- Requires **complete system redesign**
- Dual delivery choice in checkout
- Different pricing logic per zone
- Tracking integration differs per carrier
- Need to coordinate with existing Ciblex operations

### Implementation Scope

- [ ] Zone detection (by governorate/delegation)
- [ ] Checkout delivery choice UI
- [ ] Rate calculation per zone
- [ ] Ciblex API integration (national orders)
- [ ] Local delivery workflow (4 cities)
- [ ] Tracking number injection
- [ ] Order status updates

---

## 🔍 Category SEO Pages (BEFORE PRODUCTION)

### Context

Currently using `/shop?category=slug` - **not SEO friendly**.

### Needed

Create dedicated routes: `/categories/[slug]`

### Scope

- [ ] Create `app/(app)/categories/[slug]/page.tsx`
- [ ] Add proper meta tags (title, description, keywords)
- [ ] Generate static params for SSG
- [ ] Add structured data (JSON-LD)
- [ ] Update sitemap.xml
- [ ] 301 redirect from old URLs

### Priority

Must be done **before production launch** for proper Google indexing.

---

## 📍 Google Maps Review Import (LOW PRIORITY)

### Context

API key not yet available. Structure already prepared.

### What's Ready

- Schema field `source: "google"`
- Schema field `googleReviewId` (for dedup)
- Query `GOOGLE_REVIEWS_QUERY`
- Admin can filter by source

### What's Needed

- [ ] Obtain Google Maps API key
- [ ] Create `/api/admin/google-reviews/route.ts`
- [ ] Implement Places API call
- [ ] Parse and import reviews to Sanity
- [ ] Add "Import from Google" button in admin

---

## 🌍 Darija Translations Revision (POST-LAUNCH)

### Context

Wait until all features complete, then create sitemap of translatable elements.

### Approach

1. Create sitemap of all UI text locations
2. Review each with proper Tunisian Darija
3. Update components systematically

### Locations to Review

- [ ] Hero section headlines
- [ ] Header navigation
- [ ] Footer sections
- [ ] CTA buttons
- [ ] Product page labels
- [ ] Checkout form
- [ ] Email templates
- [ ] Error messages

---

## 📧 Newsletter Backend (FUTURE)

### Context

Footer form is **UI-only** currently.

### Options

- Resend Audiences (already have Resend)
- Mailchimp integration
- ConvertKit
- Custom Sanity list

### Scope

- [ ] Choose email marketing provider
- [ ] Create subscribe API route
- [ ] Store subscribers
- [ ] Double opt-in flow
- [ ] Welcome email sequence

---

## 🔔 Notifications Enhancement (FUTURE)

### Current State

- Email notifications via Resend ✅
- Order confirmation ✅

### Future

- [ ] SMS notifications (Twilio?)
- [ ] WhatsApp order updates
- [ ] Push notifications (web)
- [ ] In-app notification center

---

## 📊 Analytics & Tracking (FUTURE)

### Future Integrations

- [ ] Google Analytics 4
- [ ] Facebook Pixel
- [ ] TikTok Pixel
- [ ] Hotjar / Clarity (user behavior)
- [ ] Conversion tracking

---

## 📝 Documentation Backlog

| Document                  | Status                     |
| ------------------------- | -------------------------- |
| `docs/architecture.md`    | ⚠️ Needs component updates |
| `docs/components.md`      | ⚠️ Missing new components  |
| `docs/database-schema.md` | ⚠️ Missing Pack schema     |
| API documentation         | ⬜ Not created             |
| User guide                | ⬜ Not created             |

---

_Last Updated: 2026-01-31_
