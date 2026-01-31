# API Contracts

> **Project**: Dodo Nutrition  
> **Purpose**: Define all API endpoints, request/response formats

---

## API Routes

### POST /api/chat

**Purpose**: AI shopping assistant chat endpoint  
**Auth**: Optional (enhanced features if authenticated)

**Request**:

```typescript
{
  messages: {
    role: "user" | "assistant";
    content: string;
  }
  [];
}
```

**Response**: Server-Sent Events stream (UI message format)

**Tools Available**:

- `searchProducts`: Search product catalog
- `getMyOrders`: Get user's order history (authenticated only)

---

### GET /api/admin/insights

**Purpose**: AI-generated business insights  
**Auth**: Required (Admin only)

**Response**:

```typescript
{
  success: boolean;
  insights?: {
    summary: string;
    salesTrend: string;
    stockAlerts: string[];
    actionItems: {
      category: "urgent" | "recommended" | "opportunity";
      title: string;
      description: string;
    }[];
  };
  error?: string;
}
```

**Status Codes**:

- `200`: Success
- `403`: Not authorized (not admin)
- `500`: AI generation error

---

### POST /api/webhooks/stripe

**Purpose**: Handle Stripe checkout webhooks  
**Auth**: Stripe signature verification

**Events Handled**:

- `checkout.session.completed`

**Actions**:

1. Verify idempotency (prevent duplicate orders)
2. Extract metadata (userId, productIds, quantities)
3. Create order in Sanity
4. Decrement stock
5. Send confirmation email

---

## Server Actions

### Checkout Actions (`lib/actions/checkout.ts`)

#### createCheckoutSession(items)

**Auth**: Required  
**Validation**: Zod schema  
**Returns**: `{ success: boolean; url?: string; error?: string }`

#### createCODOrder(data)

**Auth**: Optional (guest checkout allowed)  
**Validation**: `CODOrderSchema` (Zod)  
**Returns**: `{ success: boolean; orderId?: string; orderNumber?: string; error?: string }`

---

### Order Actions (`lib/actions/orders.ts`)

#### updateOrderStatus(orderId, newStatus)

**Auth**: Required (Admin only)  
**Validation**: `OrderStatusSchema` (Zod)  
**Returns**: `{ success: boolean; error?: string }`

---

### Review Actions (`lib/actions/reviews.ts`)

| Action                           | Auth     | Purpose                |
| -------------------------------- | -------- | ---------------------- |
| `submitReview(data)`             | Optional | Submit new review      |
| `approveReview(id)`              | Admin    | Approve pending review |
| `rejectReview(id)`               | Admin    | Reject review          |
| `toggleFeatured(id, featured)`   | Admin    | Toggle featured status |
| `assignCategory(id, categoryId)` | Admin    | Assign to category     |
| `deleteReview(id)`               | Admin    | Delete review          |
| `bulkApproveReviews(ids)`        | Admin    | Bulk approve           |

---

## Validation Schemas

Location: `lib/validations/schemas.ts`

```typescript
// Cart item validation
CartItemSchema = {
  productId: string (required),
  name: string (required),
  price: number (positive),
  quantity: number (positive integer),
  image: string (optional)
}

// COD Order validation
CODOrderSchema = {
  items: CartItemSchema[] (min 1),
  email: string (valid email),
  phone: string (min 8 chars),
  address: {
    name: string (min 2),
    line1: string (min 5),
    city: string (min 2),
    gouvernorat: string (min 2),
    postcode: string (optional)
  },
  notes: string (optional)
}

// Order status
OrderStatusSchema = enum [
  "pending", "confirmed", "processing",
  "shipped", "delivered", "cancelled"
]
```
