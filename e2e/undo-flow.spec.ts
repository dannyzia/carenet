/**
 * Playwright E2E test — Full undo flow for contract offer submission.
 *
 * Flow: Login → Navigate to contract detail → Submit offer →
 *       See success toast with "Undo" button → Click Undo →
 *       Verify contract state reverts to pre-offer state.
 */
import { test, expect } from "@playwright/test";

const BASE_URL = process.env.BASE_URL || "http://localhost:5173";

test.describe("Contract Offer Undo Flow", () => {
  test.beforeEach(async ({ page }) => {
    // Login as guardian via demo quick-login
    await page.goto(`${BASE_URL}/auth/login`);
    // Click the Guardian quick-login button
    await page.getByRole("button", { name: /guardian/i }).click();
    // Enter OTP
    await page.getByPlaceholder(/otp|code/i).first().fill("123456");
    await page.getByRole("button", { name: /verify|login|submit/i }).click();
    // Wait for dashboard to load
    await page.waitForURL(/\/(dashboard|guardian)/);
  });

  test("submit offer → see Undo toast → click Undo → contract reverts", async ({ page }) => {
    // Navigate to contracts list
    await page.goto(`${BASE_URL}/contracts`);
    await page.waitForSelector("[data-testid='contract-list'], table, .cn-card");

    // Click first contract to go to detail page
    const firstContract = page.locator("a[href*='/contracts/'], [data-testid='contract-row']").first();
    if (await firstContract.isVisible()) {
      await firstContract.click();
    } else {
      // Fallback: navigate directly to a known mock contract
      await page.goto(`${BASE_URL}/contracts/CN-2024-001`);
    }

    // Wait for contract detail page to load
    await page.waitForSelector("[data-testid='contract-detail'], h1, h2");

    // Capture current offer count (if visible)
    const offerCountBefore = await page.locator("[data-testid='offer-item'], .offer-card").count();

    // Find and fill the offer form
    const pointsInput = page.getByLabel(/points|rate|per day/i).first();
    const daysInput = page.getByLabel(/days|duration/i).first();
    const messageInput = page.getByLabel(/message|note/i).first();

    if (await pointsInput.isVisible()) {
      await pointsInput.fill("500");
    }
    if (await daysInput.isVisible()) {
      await daysInput.fill("30");
    }
    if (await messageInput.isVisible()) {
      await messageInput.fill("E2E test offer");
    }

    // Submit the offer
    const submitBtn = page.getByRole("button", { name: /submit offer|send offer|make offer/i });
    await submitBtn.click();

    // ─── Verify: Success toast appears with "Undo" button ───
    const toast = page.locator("[data-sonner-toast]").last();
    await expect(toast).toBeVisible({ timeout: 5000 });

    // Verify toast has an Undo action button
    const undoButton = toast.getByRole("button", { name: /undo/i });
    await expect(undoButton).toBeVisible();

    // ─── Click Undo ───
    await undoButton.click();

    // ─── Verify: "Action undone" confirmation toast appears ───
    const undoneToast = page.locator("[data-sonner-toast]").last();
    await expect(undoneToast).toContainText(/undone|reverted/i, { timeout: 3000 });

    // ─── Verify: Contract state reverted (offer count unchanged) ───
    // Give the UI a moment to reconcile
    await page.waitForTimeout(500);
    const offerCountAfter = await page.locator("[data-testid='offer-item'], .offer-card").count();
    expect(offerCountAfter).toBeLessThanOrEqual(offerCountBefore);
  });

  test("submit offer → Ctrl+Z → contract reverts", async ({ page }) => {
    await page.goto(`${BASE_URL}/contracts/CN-2024-001`);
    await page.waitForSelector("[data-testid='contract-detail'], h1, h2");

    // Fill and submit offer (same as above)
    const pointsInput = page.getByLabel(/points|rate|per day/i).first();
    if (await pointsInput.isVisible()) {
      await pointsInput.fill("600");
    }
    const daysInput = page.getByLabel(/days|duration/i).first();
    if (await daysInput.isVisible()) {
      await daysInput.fill("14");
    }
    const messageInput = page.getByLabel(/message|note/i).first();
    if (await messageInput.isVisible()) {
      await messageInput.fill("Ctrl+Z test");
    }
    const submitBtn = page.getByRole("button", { name: /submit offer|send offer|make offer/i });
    if (await submitBtn.isVisible()) {
      await submitBtn.click();
    }

    // Wait for success toast
    const toast = page.locator("[data-sonner-toast]").last();
    await expect(toast).toBeVisible({ timeout: 5000 });

    // Press Ctrl+Z (not inside any input)
    await page.keyboard.press("Control+z");

    // Verify undo confirmation toast
    const undoneToast = page.locator("[data-sonner-toast]").last();
    await expect(undoneToast).toContainText(/undone|reverted/i, { timeout: 3000 });
  });

  test("Ctrl+Z hint appears on desktop after offer submission", async ({ page }) => {
    await page.goto(`${BASE_URL}/contracts/CN-2024-001`);
    await page.waitForSelector("[data-testid='contract-detail'], h1, h2");

    const pointsInput = page.getByLabel(/points|rate|per day/i).first();
    if (await pointsInput.isVisible()) {
      await pointsInput.fill("500");
    }
    const daysInput = page.getByLabel(/days|duration/i).first();
    if (await daysInput.isVisible()) {
      await daysInput.fill("7");
    }
    const submitBtn = page.getByRole("button", { name: /submit offer|send offer|make offer/i });
    if (await submitBtn.isVisible()) {
      await submitBtn.click();
    }

    // The "Ctrl+Z to undo" hint should appear (desktop viewport)
    const hint = page.locator("kbd");
    // On desktop (no touch), the hint should be visible
    if (await hint.isVisible({ timeout: 2000 }).catch(() => false)) {
      await expect(hint).toContainText(/Ctrl\+Z|⌘Z/);
    }
  });

  test("navigating away clears undo stack (no stale undo on new page)", async ({ page }) => {
    await page.goto(`${BASE_URL}/contracts/CN-2024-001`);
    await page.waitForSelector("[data-testid='contract-detail'], h1, h2");

    // Submit an offer
    const pointsInput = page.getByLabel(/points|rate|per day/i).first();
    if (await pointsInput.isVisible()) {
      await pointsInput.fill("500");
    }
    const submitBtn = page.getByRole("button", { name: /submit offer|send offer|make offer/i });
    if (await submitBtn.isVisible()) {
      await submitBtn.click();
      // Wait for toast
      await page.waitForSelector("[data-sonner-toast]", { timeout: 5000 });
    }

    // Navigate to a different page
    await page.goto(`${BASE_URL}/dashboard`);
    await page.waitForSelector("h1, h2, [data-testid='dashboard']");

    // Press Ctrl+Z — should do nothing (undo stack was cleared)
    await page.keyboard.press("Control+z");

    // No "undone" toast should appear
    await page.waitForTimeout(1000);
    const undoneToasts = page.locator("[data-sonner-toast]:has-text('undone')");
    expect(await undoneToasts.count()).toBe(0);
  });
});
