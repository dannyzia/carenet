---
name: vitest-playwright
description: CareNet 2 testing skill for Vitest, Testing Library, Playwright, offline scenarios, mobile viewports, and mock-auth flows. Use when creating or updating automated tests in this repo.
---

# Test Workflow

Read these files first:
- `vitest.config.ts`
- `playwright.config.ts`
- `e2e/`
- `src/frontend/hooks/__tests__/`

Follow these rules:
- Keep Vitest tests near the repo's existing co-located or `__tests__` patterns.
- Remember that Vitest defaults to `node`; opt into jsdom only when a test needs DOM APIs.
- Reuse existing demo or mock-auth flows in Playwright instead of inventing a second auth path.
- Cover offline, mobile, role-aware, realtime, and localization behavior when those concerns are part of the change.
- Use `context.setOffline(true)` or Chromium network emulation for offline Playwright coverage.

When adding tests:
1. Add unit coverage for hooks, utilities, and service logic.
2. Add end-to-end coverage for new user journeys.
3. Favor behavior assertions over Tailwind or implementation-detail assertions.
4. Keep tests resilient to mock or demo mode.

Avoid:
- mutating `navigator.onLine` to fake offline mode
- asserting raw class strings as the main signal of correctness
- skipping tests for new user-facing flows without a reason
