/**
 * Status bar theming — uses @capacitor/status-bar on native (via global registry),
 * falls back to <meta name="theme-color"> on web.
 * Reference: D008 §12.7
 */

import { isNative } from "./platform";
import { getStatusBarPlugin } from "./capacitor-plugins";

const roleColors: Record<string, string> = {
  caregiver: "#DB869A",
  guardian: "#5FB865",
  admin: "#7B5EA7",
  agency: "#00897B",
  patient: "#0288D1",
  moderator: "#E64A19",
  shop: "#E8A838",
};

export async function setStatusBarForRole(role: string): Promise<void> {
  const color = roleColors[role] || "#7B5EA7";
  await setStatusBarColor(color);
}

export async function setStatusBarColor(hexColor: string): Promise<void> {
  if (isNative()) {
    const StatusBar = getStatusBarPlugin();
    if (StatusBar) {
      try {
        await StatusBar.setBackgroundColor({ color: hexColor });
        const isDark = isColorDark(hexColor);
        await StatusBar.setStyle({ style: isDark ? "DARK" : "LIGHT" });
        return;
      } catch (err) {
        console.warn("[StatusBar] Failed to set color:", err);
      }
    }
  }
  updateThemeColorMeta(hexColor);
}

export async function resetStatusBar(): Promise<void> {
  await setStatusBarColor("#FFFFFF");
}

export async function showStatusBar(): Promise<void> {
  if (!isNative()) return;
  const StatusBar = getStatusBarPlugin();
  if (StatusBar) { try { await StatusBar.show(); } catch { /* no-op */ } }
}

export async function hideStatusBar(): Promise<void> {
  if (!isNative()) return;
  const StatusBar = getStatusBarPlugin();
  if (StatusBar) { try { await StatusBar.hide(); } catch { /* no-op */ } }
}

// ─── Helpers ───

function updateThemeColorMeta(color: string): void {
  if (typeof document === "undefined") return;
  let meta = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement | null;
  if (!meta) {
    meta = document.createElement("meta");
    meta.name = "theme-color";
    document.head.appendChild(meta);
  }
  meta.content = color;
}

function isColorDark(hex: string): boolean {
  const c = hex.replace("#", "");
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 < 0.5;
}
