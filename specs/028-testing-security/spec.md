# Spec 028 — Testing & Security Audit

> **Date**: 2026-02-16
> **Status**: ✅ Complete
> **Priority**: Before Launch

---

## Goal

E2E test setup (Playwright), security checklist and audit script, performance checklist, dependency audit documented.

---

## Scope

- Playwright: config, tests for navigation, shopping, checkout
- scripts/security-audit.ts: API auth, env exposure, Zod coverage
- docs/SECURITY_CHECKLIST.md: routes, rate limit, validation, envs
- docs/PERFORMANCE_CHECKLIST.md: CWV, images, bundle, caching
- pnpm audit findings in SECURITY_CHECKLIST

---

## Done

- [x] playwright.config.ts, tests/e2e/*.spec.ts
- [x] package.json test:e2e, test:e2e:ui
- [x] security-audit.ts, security:audit script
- [x] SECURITY_CHECKLIST.md, PERFORMANCE_CHECKLIST.md
- [x] 2 high vulns (MCP SDK) documented
