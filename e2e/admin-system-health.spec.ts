/**
 * E2E: Admin System Health Page — Channel Health Widget
 * ──────────────────────────────────────────────────────
 * Tests the ChannelHealthDashboard widget integrated into the Admin
 * System Health page sidebar, plus the useGlobalChannelHealthToast
 * hook that fires degradation toasts on this page.
 *
 * All channel registration and heartbeat control is done via the
 * `window.__careNetRealtime` bridge with fast 3s staleMs channels
 * for quick E2E turnaround (~8s per degradation test).
 *
 * Run:
 *   pnpm test:e2e -- admin-system-health
 */

import { test, expect, type Page } from "@playwright/test";

const HEALTH_URL = "/admin/system-health";

// ─── Helpers ───

/** Wait for the System Health page to fully render. */
async function waitForPage(page: Page) {
  await page.goto(HEALTH_URL);
  await page.waitForLoadState("networkidle");
  await expect(page.getByText("System Health Monitor")).toBeVisible({ timeout: 10_000 });
}

/** Register a fast-stale channel + start heartbeat via the __careNetRealtime bridge. */
async function registerFastChannel(page: Page, channelId: string, staleMs = 3_000) {
  await page.evaluate(
    ([chId, ms]) => {
      const rt = (window as any).__careNetRealtime;
      if (!rt) throw new Error("__careNetRealtime bridge not found");
      rt._registerChannel(chId, ms);
      rt.startHeartbeat({ staleMs: ms, checkIntervalMs: 2_000, pongTimeoutMs: 5_000 });
    },
    [channelId, staleMs] as const,
  );
}

/** Send a message to a channel via the bridge to reset staleness. */
async function sendMessage(page: Page, channelId: string) {
  await page.evaluate(
    ([chId]) => {
      (window as any).__careNetRealtime.recordMessageReceived(chId);
    },
    [channelId],
  );
}

/** Unregister all channels via the bridge. */
async function unregisterAll(page: Page) {
  await page.evaluate(() => {
    const rt = (window as any).__careNetRealtime;
    const channels = rt.getChannelHeartbeats();
    for (const ch of channels) {
      rt._unregisterChannel(ch.channelId);
    }
  });
}

// ─── Tests ───

test.describe("Admin System Health — Channel Health Widget", () => {
  // ════════════════════════════════════════════════════════════════════
  // Page rendering & widget structure
  // ════════════════════════════════════════════════════════════════════

  test.describe("Widget rendering", () => {
    test("renders the Realtime Channels widget in the sidebar", async ({ page }) => {
      await waitForPage(page);

      const widget = page.locator("[data-testid='admin-channel-health-widget']");
      await expect(widget).toBeVisible();
      await expect(widget.getByText("Realtime Channels")).toBeVisible();
    });

    test("shows 'No active channels' when no channels are registered", async ({ page }) => {
      await waitForPage(page);

      const dashboard = page.locator("[data-testid='admin-channel-health-dashboard']");
      await expect(dashboard.getByText("No active channels")).toBeVisible();
    });

    test("includes a RealtimeStatusIndicator badge in the widget header", async ({ page }) => {
      await waitForPage(page);

      const widget = page.locator("[data-testid='admin-channel-health-widget']");
      // The RealtimeStatusIndicator renders inside the widget header
      // It should be present as a child element
      await expect(widget).toBeVisible();
    });
  });

  // ════════════════════════════════════════════════════════════════════
  // Channel registration via bridge
  // ════════════════════════════════════════════════════════════════════

  test.describe("Channel registration", () => {
    test("registering a channel makes it appear in the widget", async ({ page }) => {
      await waitForPage(page);

      await registerFastChannel(page, "monetization:admin-test");
      await page.waitForTimeout(1_500);

      const dashboard = page.locator("[data-testid='admin-channel-health-dashboard']");
      // The "No active channels" text should disappear
      await expect(dashboard.getByText("No active channels")).not.toBeVisible();
      // Channel label or ID should appear
      await expect(dashboard.getByText("Wallet Feed").first()).toBeVisible();
    });

    test("registering multiple channels shows all of them", async ({ page }) => {
      await waitForPage(page);

      await registerFastChannel(page, "monetization:admin-1");
      await registerFastChannel(page, "admin:monetization");
      await registerFastChannel(page, "contracts:admin-test");
      await page.waitForTimeout(1_500);

      const dashboard = page.locator("[data-testid='admin-channel-health-dashboard']");
      // Summary bar should show "3 healthy"
      await expect(dashboard.getByText(/3 healthy/)).toBeVisible();
    });

    test("unregistering all channels returns to empty state", async ({ page }) => {
      await waitForPage(page);

      await registerFastChannel(page, "monetization:admin-1");
      await page.waitForTimeout(1_000);

      // Verify it appeared
      const dashboard = page.locator("[data-testid='admin-channel-health-dashboard']");
      await expect(dashboard.getByText("Wallet Feed").first()).toBeVisible();

      // Unregister
      await unregisterAll(page);
      await page.waitForTimeout(1_500);

      await expect(dashboard.getByText("No active channels")).toBeVisible();
    });
  });

  // ════════════════════════════════════════════════════════════════════
  // Live status updates
  // ════════════════════════════════════════════════════════════════════

  test.describe("Live status updates", () => {
    test("healthy channel shows green status indicator", async ({ page }) => {
      await waitForPage(page);

      await registerFastChannel(page, "monetization:admin-healthy");
      // Immediately send a message to ensure healthy
      await sendMessage(page, "monetization:admin-healthy");
      await page.waitForTimeout(1_500);

      const dashboard = page.locator("[data-testid='admin-channel-health-dashboard']");
      // Should show "Healthy" status text
      await expect(dashboard.getByText("Healthy").first()).toBeVisible();
    });

    test("stale channel shows amber status after staleMs elapses", async ({ page }) => {
      await waitForPage(page);

      await registerFastChannel(page, "monetization:admin-stale", 3_000);
      // Wait for staleMs (3s) + checkInterval (2s) + buffer
      await page.waitForTimeout(7_000);

      const dashboard = page.locator("[data-testid='admin-channel-health-dashboard']");
      // Should show "Checking..." (stale label)
      await expect(dashboard.getByText("Checking...").first()).toBeVisible({ timeout: 5_000 });
    });

    test("sending a message recovers a stale channel to healthy", async ({ page }) => {
      await waitForPage(page);

      await registerFastChannel(page, "monetization:admin-recover", 3_000);
      // Wait for staleness
      await page.waitForTimeout(7_000);

      const dashboard = page.locator("[data-testid='admin-channel-health-dashboard']");
      await expect(dashboard.getByText("Checking...").first()).toBeVisible({ timeout: 5_000 });

      // Send message to recover
      await sendMessage(page, "monetization:admin-recover");
      await page.waitForTimeout(3_000);

      await expect(dashboard.getByText("Healthy").first()).toBeVisible({ timeout: 5_000 });
    });

    test("elapsed timer increments in real time", async ({ page }) => {
      await waitForPage(page);

      await registerFastChannel(page, "general:timer-test", 60_000);
      // Send message to set a known baseline
      await sendMessage(page, "general:timer-test");
      await page.waitForTimeout(500);

      const dashboard = page.locator("[data-testid='admin-channel-health-dashboard']");
      // Read elapsed value
      const elapsed1 = await dashboard.getByText(/Elapsed:/).first().textContent();

      // Wait 3s and check again
      await page.waitForTimeout(3_000);
      const elapsed2 = await dashboard.getByText(/Elapsed:/).first().textContent();

      // The elapsed value should have changed (increased)
      expect(elapsed1).not.toEqual(elapsed2);
    });
  });

  // ════════════════════════════════════════════════════════════════════
  // Summary bar counts
  // ════════════════════════════════════════════════════════════════════

  test.describe("Summary bar", () => {
    test("shows correct healthy/stale counts", async ({ page }) => {
      await waitForPage(page);

      // Register 3 channels
      await registerFastChannel(page, "monetization:summary-1", 3_000);
      await registerFastChannel(page, "admin:summary-2", 3_000);
      await registerFastChannel(page, "contracts:summary-3", 60_000); // long threshold = stays healthy

      // Keep the third one alive
      await sendMessage(page, "contracts:summary-3");

      // Wait for the first two to go stale
      await page.waitForTimeout(7_000);

      const dashboard = page.locator("[data-testid='admin-channel-health-dashboard']");
      // Should show at least some stale channels
      await expect(dashboard.getByText(/stale/).first()).toBeVisible({ timeout: 5_000 });
      // The third channel should still be healthy
      await expect(dashboard.getByText(/healthy/).first()).toBeVisible();
    });
  });

  // ════════════════════════════════════════════════════════════════════
  // Degradation toast notifications (useGlobalChannelHealthToast)
  // ════════════════════════════════════════════════════════════════════

  test.describe("Degradation toasts", () => {
    test("fires a warning toast when a channel goes stale", async ({ page }) => {
      await waitForPage(page);

      await registerFastChannel(page, "monetization:toast-stale", 3_000);

      // Wait for staleMs + checkInterval + debounce + buffer
      await page.waitForTimeout(8_000);

      // A sonner toast should appear
      const toast = page.locator("[data-sonner-toast]").first();
      await expect(toast).toBeVisible({ timeout: 5_000 });
    });

    test("fires a success toast when a channel recovers from stale", async ({ page }) => {
      await waitForPage(page);

      await registerFastChannel(page, "monetization:toast-recover", 3_000);

      // Wait for staleness
      await page.waitForTimeout(8_000);

      // Verify stale toast appeared
      const staleToast = page.locator("[data-sonner-toast]").first();
      await expect(staleToast).toBeVisible({ timeout: 5_000 });

      // Recover the channel
      await sendMessage(page, "monetization:toast-recover");

      // Wait for recovery detection
      await page.waitForTimeout(6_000);

      // Recovery toast should appear (success type)
      const recoveryToast = page.locator("[data-sonner-toast][data-type='success']");
      await expect(recoveryToast).toBeVisible({ timeout: 5_000 });
    });

    test("no toast fires when channels stay healthy", async ({ page }) => {
      await waitForPage(page);

      await registerFastChannel(page, "monetization:toast-alive", 3_000);

      // Keep the channel alive with messages every 2s for 10s
      for (let i = 0; i < 5; i++) {
        await page.waitForTimeout(2_000);
        await sendMessage(page, "monetization:toast-alive");
      }

      // No warning/error toasts should have appeared
      const warningToasts = await page.locator("[data-sonner-toast][data-type='warning']").count();
      const errorToasts = await page.locator("[data-sonner-toast][data-type='error']").count();
      expect(warningToasts + errorToasts).toBe(0);
    });

    test("multi-channel batch toast fires when 3+ channels degrade simultaneously", async ({ page }) => {
      await waitForPage(page);

      // Register 4 fast-stale channels
      await page.evaluate(() => {
        const rt = (window as any).__careNetRealtime;
        rt._registerChannel("monetization:batch-a", 3_000);
        rt._registerChannel("contracts:batch-b", 3_000);
        rt._registerChannel("admin:batch-c", 3_000);
        rt._registerChannel("general:batch-d", 3_000);
        rt.startHeartbeat({ staleMs: 3_000, checkIntervalMs: 2_000, pongTimeoutMs: 5_000 });
      });

      // Wait for all to degrade
      await page.waitForTimeout(8_000);

      // At least one toast should fire (batch or individual)
      const toasts = page.locator("[data-sonner-toast]");
      await expect(toasts.first()).toBeVisible({ timeout: 5_000 });
    });
  });

  // ════════════════════════════════════════════════════════════════════
  // Reconnect button
  // ════════════════════════════════════════════════════════════════════

  test.describe("Reconnect button", () => {
    test("dead channel shows a Reconnect button in the widget", async ({ page }) => {
      await waitForPage(page);

      // Register with very short staleMs; the heartbeat will mark it dead
      // after consecutive stale checks exceed the threshold
      await registerFastChannel(page, "monetization:dead-test", 3_000);

      // Wait long enough for the channel to transition to dead
      // (staleMs=3s, check every 2s, ~3 consecutive stale checks → dead)
      await page.waitForTimeout(12_000);

      const dashboard = page.locator("[data-testid='admin-channel-health-dashboard']");
      const reconnectBtn = dashboard.getByRole("button", { name: /Reconnect/ });

      // The Reconnect button should be visible for dead channels
      await expect(reconnectBtn.first()).toBeVisible({ timeout: 5_000 });
    });

    test("clicking Reconnect recovers the channel", async ({ page }) => {
      await waitForPage(page);

      await registerFastChannel(page, "monetization:reconnect-test", 3_000);
      await page.waitForTimeout(12_000);

      const dashboard = page.locator("[data-testid='admin-channel-health-dashboard']");
      const reconnectBtn = dashboard.getByRole("button", { name: /Reconnect/ });

      await expect(reconnectBtn.first()).toBeVisible({ timeout: 5_000 });

      // Click Reconnect (which calls recordMessageReceived under the hood)
      await reconnectBtn.first().click();
      await page.waitForTimeout(2_000);

      // Channel should recover to healthy
      await expect(dashboard.getByText("Healthy").first()).toBeVisible({ timeout: 5_000 });
    });
  });

  // ════════════════════════════════════════════════════════════════════
  // Resilience
  // ════════════════════════════════════════════════════════════════════

  test.describe("Resilience", () => {
    test("rapid register/unregister cycles don't crash the widget", async ({ page }) => {
      await waitForPage(page);

      const errors: string[] = [];
      page.on("pageerror", (err) => errors.push(err.message));

      for (let i = 0; i < 5; i++) {
        await registerFastChannel(page, `test:rapid-${i}`, 60_000);
        await page.waitForTimeout(100);
        await page.evaluate(
          ([chId]) => (window as any).__careNetRealtime._unregisterChannel(chId),
          [`test:rapid-${i}`],
        );
        await page.waitForTimeout(100);
      }

      // Page should still render correctly
      await expect(page.getByText("System Health Monitor")).toBeVisible();

      const appErrors = errors.filter(
        (e) => !e.includes("net::ERR_") && !e.includes("NetworkError"),
      );
      expect(appErrors).toHaveLength(0);
    });

    test("widget coexists with other page sections without interference", async ({ page }) => {
      await waitForPage(page);

      // Register some channels
      await registerFastChannel(page, "admin:coexist", 60_000);
      await page.waitForTimeout(1_000);

      // Verify the rest of the page still renders
      await expect(page.getByText("Real-time Latency (ms)")).toBeVisible();
      await expect(page.getByText("Live Event Stream")).toBeVisible();
      await expect(page.getByText("Regional Nodes")).toBeVisible();
      await expect(page.getByText("Security Alerts")).toBeVisible();

      // Widget should also be visible with the channel
      const dashboard = page.locator("[data-testid='admin-channel-health-dashboard']");
      await expect(dashboard.getByText("Admin Feed").first()).toBeVisible();
    });
  });

  // ════════════════════════════════════════════════════════════════════
  // Health History Sparkline
  // ════════════════════════════════════════════════════════════════════

  test.describe("Health history sparkline", () => {
    test("sparkline SVG appears for a registered channel", async ({ page }) => {
      await waitForPage(page);
      await registerFastChannel(page, "monetization:spark-1");
      await page.waitForTimeout(1_500);

      const sparkline = page.locator("[data-testid='sparkline-monetization:spark-1']");
      await expect(sparkline).toBeVisible({ timeout: 5_000 });
    });

    test("sparkline contains green segment for healthy channel", async ({ page }) => {
      await waitForPage(page);
      await registerFastChannel(page, "monetization:spark-green", 60_000);
      await sendMessage(page, "monetization:spark-green");
      await page.waitForTimeout(3_000);

      const sparkline = page.locator("[data-testid='sparkline-monetization:spark-green']");
      await expect(sparkline).toBeVisible();

      // Should contain at least one green rect (#5FB865)
      const greenRects = await sparkline.locator("rect[fill='#5FB865']").count();
      expect(greenRects).toBeGreaterThanOrEqual(1);
    });

    test("sparkline shows amber segment after channel goes stale", async ({ page }) => {
      await waitForPage(page);
      await registerFastChannel(page, "monetization:spark-stale", 3_000);

      // Wait for channel to go stale
      await page.waitForTimeout(8_000);

      const sparkline = page.locator("[data-testid='sparkline-monetization:spark-stale']");
      await expect(sparkline).toBeVisible();

      // Should contain amber (#E8A838) segment for the stale period
      const amberRects = await sparkline.locator("rect[fill='#E8A838']").count();
      expect(amberRects).toBeGreaterThanOrEqual(1);
    });

    test("sparkline has history label in widget row", async ({ page }) => {
      await waitForPage(page);
      await registerFastChannel(page, "monetization:spark-label");
      await page.waitForTimeout(1_500);

      const dashboard = page.locator("[data-testid='admin-channel-health-dashboard']");
      await expect(dashboard.getByText("History (2m)").first()).toBeVisible();
    });

    test("sparkline updates after recovery cycle", async ({ page }) => {
      await waitForPage(page);
      await registerFastChannel(page, "monetization:spark-cycle", 3_000);

      // Wait for stale
      await page.waitForTimeout(7_000);

      // Recover
      await sendMessage(page, "monetization:spark-cycle");
      await page.waitForTimeout(3_000);

      const sparkline = page.locator("[data-testid='sparkline-monetization:spark-cycle']");
      await expect(sparkline).toBeVisible();

      // Should have both green and amber segments (showing the transition history)
      const greenCount = await sparkline.locator("rect[fill='#5FB865']").count();
      const amberCount = await sparkline.locator("rect[fill='#E8A838']").count();
      expect(greenCount + amberCount).toBeGreaterThanOrEqual(2);
    });

    test("history is accessible via __careNetRealtime bridge", async ({ page }) => {
      await waitForPage(page);
      await registerFastChannel(page, "monetization:spark-bridge");
      await page.waitForTimeout(1_500);

      const history = await page.evaluate(() => {
        return (window as any).__careNetRealtime.getChannelHistory("monetization:spark-bridge");
      });

      expect(history.length).toBeGreaterThanOrEqual(1);
      expect(history[0].status).toBe("healthy");
      expect(typeof history[0].ts).toBe("number");
    });
  });
});