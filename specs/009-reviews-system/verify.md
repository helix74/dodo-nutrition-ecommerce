# Feature 009: Reviews System - Verification

> **Parent Spec**: [spec.md](./spec.md)  
> **Status**: ⬜ Pending

---

## Build Verification

### TypeScript

```bash
npx tsc --noEmit
```

- [ ] No errors

### Production Build

```bash
pnpm build
```

- [ ] Build succeeds
- [ ] No warnings related to reviews

---

## Schema Verification

### Sanity Studio

- [ ] Review type visible in Studio
- [ ] All new fields appear correctly
- [ ] Category field shows/hides based on reviewType
- [ ] Google fields show/hide based on source
- [ ] Preview displays correctly

### Type Generation

```bash
pnpm typegen
```

- [ ] Types regenerated successfully
- [ ] `Review` type includes all new fields

---

## Admin Panel Verification

### Navigation

- [ ] "Avis" link visible in admin nav
- [ ] Clicking navigates to `/admin/reviews`

### Review List

- [ ] Pending reviews tab works
- [ ] Approved reviews tab works
- [ ] Google reviews tab works
- [ ] Rejected reviews tab works
- [ ] Reviews display with correct info

### Actions

- [ ] Approve button works → status changes
- [ ] Reject button works → status changes
- [ ] Featured toggle works → review appears/disappears from homepage
- [ ] Category assignment works

---

## Homepage Testimonials Verification

### Display

- [ ] Section visible on homepage
- [ ] Shows featured reviews only
- [ ] Carousel/grid displays correctly
- [ ] Source badges (Google/Website) show correctly
- [ ] Overall stats display

### Interaction

- [ ] "Laisser un avis" button opens form
- [ ] Form submits successfully
- [ ] Success message appears

---

## Category Reviews Verification

### Product Pages

- [ ] Reviews section visible on product page
- [ ] Shows reviews for product's category
- [ ] Empty state when no reviews
- [ ] "Laisser un avis" button works

### Category Matching

- [ ] Creatine product shows creatine reviews
- [ ] Protein product shows protein reviews
- [ ] General reviews don't show on products

---

## Review Form Verification

### Locations

- [ ] Works on homepage
- [ ] Works on checkout success
- [ ] Works on product pages
- [ ] (Optional) Works in footer

### Form Functionality

- [ ] Star rating clickable
- [ ] Name field required
- [ ] Comment field works
- [ ] Category selector works (when shown)
- [ ] Submit creates pending review
- [ ] Success feedback shown

### Data Validation

- [ ] Rating required (1-5)
- [ ] Name required
- [ ] Comment optional
- [ ] Category optional

---

## Visual Verification

### Dark Theme

- [ ] All components use dark theme
- [ ] No white backgrounds
- [ ] Text readable

### Branding

- [ ] Dodo yellow CTAs
- [ ] Correct typography
- [ ] Matches site aesthetic

### Responsive

- [ ] Homepage section mobile-friendly
- [ ] Admin panel works on tablet
- [ ] Review form works on mobile

---

## Edge Cases

### Empty States

- [ ] Homepage with no featured reviews
- [ ] Product page with no category reviews
- [ ] Admin with no pending reviews

### Error Handling

- [ ] Form submission error feedback
- [ ] Network error handling
- [ ] Invalid data handling

---

## Performance

- [ ] Homepage load time acceptable
- [ ] Admin panel loads quickly
- [ ] No unnecessary re-renders

---

## Final Checklist

- [ ] All tasks in task.md completed
- [ ] Build passes
- [ ] TypeScript passes
- [ ] Visual review approved
- [ ] Commit and push to GitHub
