# Feature 006b: Admin AI Command Center

> **Status**: ⏸️ Blocked (needs Vercel AI Gateway)  
> **Date**: 2026-01-18  
> **Parent**: 006-admin-dashboard

---

## Summary

AI-powered insights and natural language queries for the admin dashboard.

---

## Blocked By

Vercel AI Gateway requires authentication:

- Need to connect project to Vercel
- Or set up direct API keys (Anthropic/OpenAI)

---

## Planned Features

- [ ] Natural language queries ("How many orders this week?")
- [ ] Auto-generated daily insights
- [ ] Quick action buttons
- [ ] Smart suggestions

---

## Existing Component

`AIInsightsCard` - Currently disabled in dashboard (line 73)

---

## How to Enable

1. Connect to Vercel: `vercel link`
2. Enable OIDC in project settings
3. Pull env: `vercel env pull`
4. Uncomment AIInsightsCard in page.tsx
