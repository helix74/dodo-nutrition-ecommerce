# Testing Strategy

> **Project**: Dodo Nutrition  
> **Purpose**: Define testing approach and verification methods

---

## Testing Philosophy

Given the solo developer context, prioritize:

1. **Manual smoke testing** for critical paths
2. **TypeScript strict mode** for compile-time safety
3. **Browser testing** for UI verification
4. **Sanity preview** for content changes

---

## Critical Path Testing

### Checkout Flow (P0)

| Step             | Test                    |
| ---------------- | ----------------------- |
| Add to cart      | Item appears in cart    |
| Update quantity  | Total updates correctly |
| Enter checkout   | Form validates inputs   |
| Submit COD order | Order created in Sanity |
| Stock decrement  | Inventory reduced       |
| Email sent       | Confirmation received   |

### Admin Flow (P0)

| Step                | Test                    |
| ------------------- | ----------------------- |
| Access /admin       | Requires authentication |
| Non-admin access    | 403 or redirect         |
| View dashboard      | Stats display           |
| Update order status | Status changes          |
| Approve review      | Review shows on site    |

---

## Type Safety

TypeScript strict mode catches:

- Null/undefined access
- Type mismatches
- Missing properties
- Incorrect function signatures

**Verify with**:

```bash
pnpm exec tsc --noEmit
```

---

## Build Verification

```bash
# Full production build
pnpm build

# Check for:
# - No type errors
# - All pages generated
# - No missing dependencies
```

---

## Browser Testing Checklist

### Desktop (Chrome)

- [ ] Homepage loads with banners
- [ ] Product pages display correctly
- [ ] Cart operations work
- [ ] Checkout form validates
- [ ] Admin dashboard loads
- [ ] AI chat responds

### Mobile (Safari/Chrome)

- [ ] Responsive layout works
- [ ] Touch interactions work
- [ ] Cart drawer opens
- [ ] Form inputs usable
- [ ] Navigation menu works

---

## Future: Automated Testing

When budget/time allows:

### E2E with Playwright

```typescript
// tests/checkout.spec.ts
test("complete checkout flow", async ({ page }) => {
  await page.goto("/shop");
  await page.click('[data-testid="add-to-cart"]');
  await page.goto("/checkout");
  // ...
});
```

### Component Testing

```typescript
// Vitest for component unit tests
import { render, screen } from '@testing-library/react';
import { CartItem } from '@/components/app/cart/CartItem';

test('renders cart item', () => {
  render(<CartItem {...mockItem} />);
  expect(screen.getByText(mockItem.name)).toBeInTheDocument();
});
```

---

## Pre-Deploy Checklist

- [ ] `pnpm build` passes
- [ ] TypeScript no errors
- [ ] All env vars set in Vercel
- [ ] Sanity CORS updated
- [ ] Clerk production keys
- [ ] Test checkout flow manually
