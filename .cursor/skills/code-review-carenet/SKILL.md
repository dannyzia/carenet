---
name: code-review-carenet
description: CareNet 2 review skill for finding behavioral bugs, offline-sync risks, auth regressions, localization gaps, and missing tests. Use when reviewing diffs or generated code for this repo.
---

# Code Review For CareNet 2

Review with a bug-first mindset and use the repo's real constraints.

## Check
- Route wiring in `src/app/routes.ts`
- Auth and role handling through `useAuth()`
- Shared UI reuse versus duplicated component creation
- Supabase mock fallback preservation
- Realtime subscription cleanup
- Dexie queue or sync implications for write flows
- `en` and `bn` translation coverage
- Mobile and Capacitor regressions
- Vitest and Playwright coverage for risky changes

## Reporting
- Lead with findings ordered by severity.
- Include file references and the user-visible risk.
- If no findings exist, say so and note any residual test gaps.
