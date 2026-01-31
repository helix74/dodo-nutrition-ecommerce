# Contributing Guide

> **Project**: Dodo Nutrition  
> **Purpose**: Standards for code contributions

---

## Quick Start

```bash
# Clone
git clone https://github.com/helix74/dodo-nutrition-ecommerce.git
cd dodo-nutrition-ecommerce

# Install dependencies
pnpm install

# Setup environment
cp .env.example .env.local
# Edit .env.local with your keys

# Run development
pnpm dev
```

---

## Branch Naming

| Prefix      | Use Case              |
| ----------- | --------------------- |
| `feat/`     | New features          |
| `fix/`      | Bug fixes             |
| `docs/`     | Documentation         |
| `refactor/` | Code refactoring      |
| `security/` | Security improvements |
| `chore/`    | Maintenance tasks     |

**Examples**:

- `feat/add-wishlist-sharing`
- `fix/checkout-validation-error`
- `docs/update-api-contracts`

---

## Commit Messages

Follow [Conventional Commits](https://conventionalcommits.org):

```
<type>: <description>

[optional body]
```

**Types**:

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance
- `security`: Security fix

**Examples**:

```
feat: Add product comparison feature
fix: Resolve cart persistence issue on Safari
docs: Update API contracts for reviews
security: Add rate limiting to API routes
```

---

## Code Style

### TypeScript

- Strict mode enabled
- No `any` types (use `unknown` if needed)
- Prefer type inference
- Export types from dedicated files

### React

- Functional components only
- Use server components by default
- Add `"use client"` only when needed
- Colocate styles with components

### CSS

- Tailwind utilities preferred
- Follow color token system
- Mobile-first responsive design

---

## Linting

Using **Biome** (no ESLint):

```bash
# Check
pnpm biome check .

# Fix
pnpm biome check --apply .
```

---

## Before Committing

```bash
# Type check
pnpm exec tsc --noEmit

# Build test
pnpm build
```

---

## Pull Request Process

1. Create feature branch from `main`
2. Make changes with clean commits
3. Ensure build passes
4. Update documentation if needed
5. Request review in PR description
6. Squash merge when approved

---

## Project Structure Rules

| Directory     | Rule                   |
| ------------- | ---------------------- |
| `app/`        | Route files only       |
| `components/` | Reusable components    |
| `lib/`        | Utilities and logic    |
| `docs/`       | Documentation          |
| `specs/`      | Feature specifications |

---

## Specs Workflow

For new features:

1. Create `specs/NNN-feature-name/`
2. Add `spec.md` (requirements)
3. Add `plan.md` (implementation plan)
4. Add `task.md` (checklist)
5. Implement following the plan
6. Update `task.md` as you progress
