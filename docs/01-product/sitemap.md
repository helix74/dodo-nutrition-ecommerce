# Sitemap

> **Project**: Dodo Nutrition  
> **Total Routes**: 25+

---

## Public Routes (app/(app))

```
/                       # Homepage
├── /shop               # Product listing with filters
├── /products/[slug]    # Product detail page
├── /categories         # All categories
├── /brands             # All brands
├── /packs              # Product bundles listing
│   └── /packs/[slug]   # Pack detail page
├── /promotions         # Promotional offers
├── /faq                # FAQ page
├── /livraison          # Shipping info
├── /cgv                # Terms and conditions
└── /wishlist           # User wishlist
```

---

## Authenticated Routes

```
/checkout               # Checkout form (guest or auth)
├── /checkout/success   # Order confirmation
├── /orders             # Order history
│   └── /orders/[id]    # Order detail
```

---

## Admin Routes (app/(admin))

```
/admin                  # Dashboard
├── /admin/orders       # Order management
│   └── /admin/orders/[id]  # Order detail
├── /admin/inventory    # Product inventory
│   └── /admin/inventory/[id]  # Product edit
└── /admin/reviews      # Review moderation
```

---

## API Routes (app/api)

```
/api/chat               # AI chat endpoint
/api/admin/insights     # AI admin insights
/api/webhooks/stripe    # Stripe webhook handler
```

---

## CMS Routes

```
/studio                 # Sanity Studio
└── /studio/[[...tool]] # All studio tools
```

---

## Route Protection Matrix

| Route Pattern  | Auth Required | Role Required |
| -------------- | ------------- | ------------- |
| `/`            | No            | -             |
| `/shop`        | No            | -             |
| `/products/*`  | No            | -             |
| `/checkout`    | Yes           | -             |
| `/orders`      | Yes           | User          |
| `/admin/*`     | Yes           | Admin         |
| `/api/admin/*` | Yes           | Admin         |
| `/api/chat`    | Optional      | -             |
| `/studio`      | Yes           | CMS User      |
