# Security & Authorization Model

> **Project**: Dodo Nutrition  
> **Purpose**: Define authentication, authorization, and access control

---

## Authentication Provider

| Aspect         | Value                                 |
| -------------- | ------------------------------------- |
| **Provider**   | Clerk                                 |
| **Method**     | Email/Password, Social (configurable) |
| **Session**    | JWT via cookies                       |
| **Middleware** | `@clerk/nextjs/server`                |

---

## Role Definitions

| Role      | Description             | Identification            |
| --------- | ----------------------- | ------------------------- |
| **Guest** | Unauthenticated visitor | No userId                 |
| **User**  | Authenticated customer  | Valid userId              |
| **Admin** | Store administrator     | Email in ADMIN_EMAILS env |

---

## Admin Authentication

**File**: `lib/auth/admin.ts`

```typescript
// Check if current user is admin
async function isAdmin(): Promise<boolean>;

// Require admin (throws if not)
async function requireAdmin(): Promise<void>;

// Get full admin status
async function getAdminStatus(): Promise<{
  isAuthenticated: boolean;
  isAdmin: boolean;
  email: string | null;
}>;
```

**Configuration**:

```env
ADMIN_EMAILS=admin@example.com,owner@example.com
```

---

## Access Control Matrix

### Route Protection (Middleware)

| Route Pattern | Auth Required | Notes                  |
| ------------- | ------------- | ---------------------- |
| `/`           | ❌            | Public                 |
| `/shop`       | ❌            | Public                 |
| `/products/*` | ❌            | Public                 |
| `/packs/*`    | ❌            | Public                 |
| `/categories` | ❌            | Public                 |
| `/brands`     | ❌            | Public                 |
| `/faq`        | ❌            | Public                 |
| `/livraison`  | ❌            | Public                 |
| `/cgv`        | ❌            | Public                 |
| `/wishlist`   | ❌            | Public (local storage) |
| `/checkout`   | ✅            | Redirect to sign-in    |
| `/orders`     | ✅            | User orders only       |
| `/admin/*`    | ✅            | Requires auth          |
| `/studio`     | ✅            | Sanity Studio auth     |

### API Protection

| Endpoint                    | Auth      | Role  |
| --------------------------- | --------- | ----- |
| `POST /api/chat`            | Optional  | -     |
| `GET /api/admin/insights`   | ✅        | Admin |
| `POST /api/webhooks/stripe` | Signature | -     |

### Server Action Protection

| Action                  | Auth     | Role  |
| ----------------------- | -------- | ----- |
| `createCheckoutSession` | ✅       | User  |
| `createCODOrder`        | Optional | -     |
| `updateOrderStatus`     | ✅       | Admin |
| `approveReview`         | ✅       | Admin |
| `rejectReview`          | ✅       | Admin |
| `toggleFeatured`        | ✅       | Admin |
| `assignCategory`        | ✅       | Admin |
| `deleteReview`          | ✅       | Admin |
| `bulkApproveReviews`    | ✅       | Admin |
| `submitReview`          | Optional | -     |

---

## Security Measures

### Input Validation

| Layer              | Method                |
| ------------------ | --------------------- |
| **Forms**          | React Hook Form + Zod |
| **Server Actions** | Zod schemas           |
| **API Routes**     | Request body parsing  |

### Data Protection

| Measure            | Implementation             |
| ------------------ | -------------------------- |
| **SQL Injection**  | N/A (Sanity uses GROQ)     |
| **XSS**            | No dangerouslySetInnerHTML |
| **CSRF**           | SameSite cookies           |
| **Sensitive Data** | Server-only env vars       |

### Stock Integrity

- Stock validation before checkout
- Atomic stock updates via Sanity transaction
- Webhook idempotency check (prevents duplicate orders)

---

## Security Checklist

- [x] Admin routes protected via middleware
- [x] Admin actions require `requireAdmin()`
- [x] Admin API returns 403 for non-admins
- [x] Input validation with Zod
- [x] Stock updates use transactions
- [x] Webhook idempotency check
- [x] No `as any` type assertions
- [x] No sensitive data in client bundles
