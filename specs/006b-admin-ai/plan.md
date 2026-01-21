# Plan: Admin AI Command Center (006b)

> **Status**: ⏸️ Blocked
> **Reason**: Vercel AI Gateway authentication required

## Goal

Enable AI-powered insights and natural language queries for the admin dashboard.

## Prerequisites (Blocking)

1. **Vercel Integration**: Project must be linked to Vercel.
2. **AI Gateway**: OIDC authentication must be enabled.
3. **Env Vars**: `AI_GATEWAY_SECRET` and related vars must be present.

## Proposed Implementation (On Hold)

1. **Enable Component**: Uncomment `AIInsightsCard` in `admin/page.tsx`.
2. **Chat Interface**: Build `AIChat` component with `useChat` hook.
3. **Insights Engine**: Create `api/admin/insights/route.ts` to process store data.
4. **UI Integration**: Add "Ask AI" floating button or widget.

## Next Steps

- Wait for Vercel configuration (User action).
- Once unblocked, proceed with implementation.
