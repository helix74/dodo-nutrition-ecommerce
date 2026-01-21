# Feature 006: AI-Powered Admin Dashboard

> **Status**: 📋 Planning  
> **Priority**: 🔴 High  
> **Estimated Time**: 3-5 days

---

## 🎯 Vision

Create the **ultimate e-commerce admin dashboard** for Dodo Nutrition - beautiful, fast, and powered by AI. The admin should be able to manage their entire business from one screen, with AI providing insights and automating routine tasks.

---

## 📊 Current State

### What We Have:

| Component        | Status    | Notes             |
| ---------------- | --------- | ----------------- |
| `AIInsightsCard` | ✅ Exists | Basic AI insights |
| `StatCard`       | ✅ Exists | Count cards       |
| `LowStockAlert`  | ✅ Exists | Stock warnings    |
| `RecentOrders`   | ✅ Exists | Order list        |
| `ProductRow`     | ✅ Exists | Inventory table   |
| `OrderRow`       | ✅ Exists | Order table       |

### What's Missing:

- Revenue/sales charts
- Time-based analytics (today/week/month)
- Order status workflow
- AI command center
- Bulk operations
- Export functionality

---

## 🚀 Final Goal: The Perfect Admin Dashboard

### Phase 1: Analytics Hub (Priority)

```
┌─────────────────────────────────────────────────────────────┐
│  🏠 Dashboard                                               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │ Revenu   │ │ Commandes│ │ À expéd. │ │ Stock    │       │
│  │ Aujourd. │ │ Aujourd. │ │ Pending  │ │ Faible   │       │
│  │ 1,250 TND│ │    12    │ │    5     │ │    8     │       │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘       │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 📈 Revenue Chart (7 days / 30 days / 12 months)     │   │
│  │ [================================]                   │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌──────────────────────┐ ┌────────────────────────────┐   │
│  │ 🔥 Top Products      │ │ 🛒 Recent Orders           │   │
│  │ 1. Whey Protein      │ │ ORD-123 - 150 TND - Pending│   │
│  │ 2. Creatine          │ │ ORD-122 - 89 TND - Shipped │   │
│  └──────────────────────┘ └────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Phase 2: AI Command Center

```
┌─────────────────────────────────────────────────────────────┐
│  🤖 AI Assistant                                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  "Ask me anything about your store..."                     │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ How many orders did we get this week?                │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  💬 "You received 47 orders this week, totaling 4,230 TND. │
│      That's 23% more than last week! Your best-selling     │
│      product was Whey Protein (18 orders)."                │
│                                                             │
│  Quick Actions:                                             │
│  [📊 Weekly Report] [📦 Restock Suggestions] [📈 Forecast]  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Phase 3: Smart Order Management

- Status workflow with one-click actions
- Bulk status updates
- AI flags for suspicious orders
- Ciblex integration (future)

### Phase 4: Intelligent Inventory

- Visual stock levels
- AI restock recommendations
- Low stock alerts with auto-suggest orders
- Price optimization suggestions

---

## 🛠️ Technical Architecture

### Data Layer

```
Sanity (Source) → GROQ Queries → Server Components
                                       ↓
                              React Components
                                       ↓
                              Client Interactivity
```

### AI Integration

```
User Query → Claude API → Business Context
                              ↓
                     Structured Response
                              ↓
                     Dashboard Update
```

### Key Technologies

- **Charts**: Recharts (already installed)
- **AI**: Claude API (existing)
- **Real-time**: Sanity Live (existing)
- **UI**: Shadcn/ui (existing)

---

## 📋 Implementation Phases

### Phase 1: Analytics Foundation

| Task                              | Priority | Time    |
| --------------------------------- | -------- | ------- |
| Revenue stats (today/week/month)  | 🔴       | 2 hours |
| Order stats with status breakdown | 🔴       | 1 hour  |
| Revenue chart (7/30 days)         | 🔴       | 2 hours |
| Top selling products widget       | 🟠       | 1 hour  |

### Phase 2: AI Improvements

| Task                    | Priority | Time    |
| ----------------------- | -------- | ------- |
| AI chat interface       | 🟠       | 3 hours |
| Quick action buttons    | 🟠       | 1 hour  |
| Auto-generated insights | 🟡       | 2 hours |

### Phase 3: Order Workflow

| Task                  | Priority | Time    |
| --------------------- | -------- | ------- |
| Status quick-actions  | 🟠       | 2 hours |
| Bulk operations       | 🟡       | 2 hours |
| Print shipping labels | 🟡       | 2 hours |

### Phase 4: Inventory Intelligence

| Task               | Priority | Time    |
| ------------------ | -------- | ------- |
| Visual stock bars  | 🟠       | 1 hour  |
| Restock alerts     | 🟠       | 1 hour  |
| AI recommendations | 🟡       | 2 hours |

---

## 🎨 Design Principles

1. **Dark theme first** - Matches the site
2. **Dodo colors** - Yellow CTAs, red alerts
3. **Data density** - Show more, scroll less
4. **Mobile responsive** - Manage from phone
5. **French language** - Consistent with site

---

## 📁 File Structure

```
app/(admin)/admin/
├── page.tsx              # Main dashboard
├── layout.tsx            # Sidebar navigation
├── analytics/
│   └── page.tsx          # Detailed analytics
├── orders/
│   ├── page.tsx          # Orders list
│   └── [id]/
│       └── page.tsx      # Order detail
├── inventory/
│   ├── page.tsx          # Products list
│   └── [id]/
│       └── page.tsx      # Product detail
└── ai/
    └── page.tsx          # AI command center

components/admin/
├── charts/
│   ├── RevenueChart.tsx
│   ├── OrdersChart.tsx
│   └── TopProducts.tsx
├── widgets/
│   ├── RevenueCard.tsx
│   ├── OrdersCard.tsx
│   └── QuickActions.tsx
├── ai/
│   ├── AIChat.tsx
│   └── AIInsights.tsx
└── ...existing components
```

---

## 🧩 Sub-Features Status

| ID       | Feature              | Status      | Notes                                       |
| -------- | -------------------- | ----------- | ------------------------------------------- |
| **006a** | Analytics Dashboard  | ✅ Complete | Revenue, Orders, Stock widgets implemented. |
| **006b** | AI Command Center    | ⏸️ Blocked  | Waiting for Vercel AI Gateway setup.        |
| **006c** | Order Management     | ✅ Complete | Order list, details, status workflow.       |
| **006d** | Inventory Management | ✅ Complete | Product list, stock editing, quick actions. |

---

## ✅ Success Criteria

- [x] Admin can see revenue at a glance (006a)
- [x] Orders are manageable with 1-2 clicks (006c)
- [ ] AI provides useful, actionable insights (006b - Blocked)
- [x] Stock issues are visible immediately (006d)
- [x] Dashboard loads in under 2 seconds
- [x] Works on mobile devices
