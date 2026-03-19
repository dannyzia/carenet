# CareNet 2 — Testing Rules

## Testing Philosophy
- Every new **hook or utility** → Vitest unit test
- Every new **user-facing flow** → Playwright e2e test
- Every new **Supabase service function** → Vitest test with mocked Supabase
- Tests live next to source OR in dedicated test folders:
  - Unit: `src/frontend/hooks/__tests__/` or co-located `*.test.ts`
  - E2E: `e2e/` at project root

---

## Vitest (Unit & Component Tests)

### Setup
```ts
// vitest.config.ts is already configured — do not change without discussion
import { vi, describe, it, expect, beforeEach } from "vitest";
```

### Mocking Supabase
```ts
vi.mock("@/backend/services/supabase", () => ({
  supabase: {
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockResolvedValue({ data: [], error: null }),
      insert: vi.fn().mockResolvedValue({ data: null, error: null }),
      update: vi.fn().mockResolvedValue({ data: null, error: null }),
    }),
    channel: vi.fn().mockReturnValue({
      on: vi.fn().mockReturnThis(),
      subscribe: vi.fn(),
    }),
  },
  USE_SUPABASE: false, // Default to mock mode in tests
}));
```

### Mocking i18next
```ts
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key, // Returns key as-is — keeps tests simple
    i18n: { changeLanguage: vi.fn() },
  }),
}));
```

### Hook test pattern
```ts
import { renderHook, act } from "@testing-library/react";
import { useMyHook } from "@/frontend/hooks/useMyHook";

describe("useMyHook", () => {
  it("returns initial state correctly", () => {
    const { result } = renderHook(() => useMyHook());
    expect(result.current.isLoading).toBe(false);
  });

  it("handles async action", async () => {
    const { result } = renderHook(() => useMyHook());
    await act(async () => { await result.current.doSomething(); });
    expect(result.current.data).toBeDefined();
  });
});
```

---

## Playwright (E2E Tests)

### Location
All e2e tests go in `e2e/` at the project root.

### Naming convention
`[feature]-[flow].spec.ts` — e.g. `caregiver-shift-checkin.spec.ts`

### Standard patterns
```ts
import { test, expect } from "@playwright/test";

// Login helper — reuse across tests
async function loginAs(page: Page, role: string) {
  await page.goto("/auth/login");
  await page.getByLabel("Email").fill(`${role}@demo.carenet.bd`);
  await page.getByLabel("Password").fill("Demo1234!");
  await page.getByRole("button", { name: /sign in/i }).click();
  await page.waitForURL(`/${role}/dashboard`);
}
```

### Offline simulation
```ts
test("queues write when offline", async ({ page, context }) => {
  await loginAs(page, "caregiver");
  await context.setOffline(true); // Take offline
  // Perform action
  await page.getByRole("button", { name: /save/i }).click();
  // Verify offline indicator appears
  await expect(page.getByTestId("offline-indicator")).toBeVisible();
  await context.setOffline(false); // Restore
  // Verify sync happens
  await expect(page.getByTestId("sync-complete")).toBeVisible();
});
```

### Accessibility e2e
```ts
test("page is keyboard navigable", async ({ page }) => {
  await page.goto("/guardian/dashboard");
  await page.keyboard.press("Tab"); // First focus = skip link
  await expect(page.getByText(/skip to main content/i)).toBeFocused();
});
```

### Mobile viewport tests
```ts
test.use({ viewport: { width: 390, height: 844 } }); // iPhone 14 Pro
test("bottom nav is visible on mobile", async ({ page }) => {
  await loginAs(page, "guardian");
  await expect(page.getByRole("navigation", { name: /bottom navigation/i })).toBeVisible();
});
```

---

## What NOT to Test
- ❌ Tailwind class names — they change during refactors
- ❌ Exact pixel positions
- ❌ Implementation details (internal state, private functions)
- ❌ Third-party library internals (Radix, Sonner, etc.)

## What to ALWAYS Test
- ✅ Happy path + at least one error path per feature
- ✅ Offline behaviour for any write operation
- ✅ Role-based access (that role X cannot access role Y's routes)
- ✅ Bangla language renders without breaking layout
- ✅ Mobile viewport for any new page
