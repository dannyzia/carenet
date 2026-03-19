import { defineConfig, devices } from "@playwright/test";

/**
 * CareNet Playwright E2E Configuration
 * ─────────────────────────────────────
 * Run with:
 *   pnpm test:e2e              — headless
 *   pnpm test:e2e --headed     — see the browser
 *   pnpm test:e2e --debug      — step through in Playwright Inspector
 *
 * Prerequisites:
 *   npx playwright install chromium
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",

  use: {
    // Base URL for the Vite dev server
    baseURL: "http://localhost:5173",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "mobile-chrome",
      use: { ...devices["Pixel 7"] },
    },
  ],

  // Auto-start the Vite dev server before tests
  webServer: {
    command: "npx vite --host",
    url: "http://localhost:5173",
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
});
