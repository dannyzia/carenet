/**
 * Android hardware back button handler per D008 §12.3.
 * Uses @capacitor/app via global plugin registry — no ES import needed.
 *
 * Priority: modal → drawer → navigate back → exit confirmation
 */

import { isNative, isAndroid } from "./platform";
import { getAppPlugin } from "./capacitor-plugins";

let backButtonCleanup: (() => void) | null = null;
let exitConfirmationShown = false;

const TAB_ROOT_PATHS = [
  "/dashboard",
  "/caregiver/dashboard",
  "/guardian/dashboard",
  "/admin/dashboard",
  "/agency/dashboard",
  "/patient/dashboard",
  "/moderator/dashboard",
  "/shop/dashboard",
];

export async function registerBackButton(): Promise<void> {
  if (!isNative() || !isAndroid()) return;

  const AppPlugin = getAppPlugin();
  if (!AppPlugin) return;

  try {
    const listener = await AppPlugin.addListener("backButton", ({ canGoBack }: { canGoBack: boolean }) => {
      handleBackButton(canGoBack, AppPlugin);
    });
    backButtonCleanup = () => listener.remove();
  } catch (err) {
    console.warn("[BackButton] Failed to register:", err);
  }
}

export function unregisterBackButton(): void {
  backButtonCleanup?.();
  backButtonCleanup = null;
}

// ─── Handler Logic ───

function handleBackButton(canGoBack: boolean, AppPlugin: any): void {
  if (closeTopModal()) return;
  if (closeDrawer()) return;

  if (canGoBack) {
    window.history.back();
    return;
  }

  const currentPath = window.location.pathname;
  const isTabRoot = TAB_ROOT_PATHS.some(
    (root) => currentPath === root || currentPath === "/"
  );

  if (isTabRoot) {
    showExitConfirmation(AppPlugin);
  } else {
    window.location.href = "/dashboard";
  }
}

function closeTopModal(): boolean {
  const modals = document.querySelectorAll("[class*='fixed'][class*='z-50']");
  if (modals.length > 0) {
    const backdrop = modals[modals.length - 1].querySelector("[class*='bg-black']") as HTMLElement | null;
    if (backdrop) { backdrop.click(); return true; }
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    return true;
  }
  return false;
}

function closeDrawer(): boolean {
  document.dispatchEvent(new CustomEvent("carenet:close-drawer"));
  const sidebar = document.querySelector('[class*="fixed"][class*="z-40"]') as HTMLElement | null;
  if (sidebar && sidebar.offsetParent !== null) {
    const overlay = sidebar.previousElementSibling as HTMLElement | null;
    if (overlay) { overlay.click(); return true; }
  }
  return false;
}

function showExitConfirmation(AppPlugin: any): void {
  if (exitConfirmationShown) {
    try { AppPlugin.exitApp(); } catch { /* can't exit */ }
    return;
  }

  exitConfirmationShown = true;
  showExitToast("Press back again to exit");
  setTimeout(() => { exitConfirmationShown = false; }, 2000);
}

function showExitToast(message: string): void {
  const toast = document.createElement("div");
  toast.textContent = message;
  Object.assign(toast.style, {
    position: "fixed",
    bottom: "80px",
    left: "50%",
    transform: "translateX(-50%)",
    background: "rgba(0,0,0,0.8)",
    color: "white",
    padding: "10px 20px",
    borderRadius: "24px",
    fontSize: "14px",
    zIndex: "99999",
    transition: "opacity 0.3s",
    pointerEvents: "none",
  });
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 300);
  }, 1700);
}
