/**
 * Haptic feedback abstraction — uses @capacitor/haptics on native
 * (via global plugin registry), falls back to navigator.vibrate on web.
 * Reference: D008 §12.9
 */

import { isNative } from "./platform";
import { getHapticsPlugin } from "./capacitor-plugins";

export async function hapticLight(): Promise<void> { return doImpact("Light"); }
export async function hapticMedium(): Promise<void> { return doImpact("Medium"); }
export async function hapticHeavy(): Promise<void> { return doImpact("Heavy"); }
export async function hapticSuccess(): Promise<void> { return doNotification("SUCCESS"); }
export async function hapticWarning(): Promise<void> { return doNotification("WARNING"); }
export async function hapticError(): Promise<void> { return doNotification("ERROR"); }

export async function hapticSelection(): Promise<void> {
  if (isNative()) {
    const Haptics = getHapticsPlugin();
    if (Haptics) {
      try { await Haptics.selectionChanged(); return; } catch { /* fall through */ }
    }
  }
  vibrateWeb(5);
}

// ─── Internal ───

async function doImpact(style: "Heavy" | "Medium" | "Light"): Promise<void> {
  if (isNative()) {
    const Haptics = getHapticsPlugin();
    if (Haptics) {
      try { await Haptics.impact({ style }); return; } catch { /* fall through */ }
    }
  }
  const durationMap: Record<string, number> = { Light: 10, Medium: 20, Heavy: 40 };
  vibrateWeb(durationMap[style] || 15);
}

async function doNotification(type: "SUCCESS" | "WARNING" | "ERROR"): Promise<void> {
  if (isNative()) {
    const Haptics = getHapticsPlugin();
    if (Haptics) {
      try { await Haptics.notification({ type }); return; } catch { /* fall through */ }
    }
  }
  const patternMap: Record<string, number[]> = {
    SUCCESS: [15, 50, 15],
    WARNING: [30, 50, 30],
    ERROR: [50, 30, 50, 30, 50],
  };
  vibratePatternWeb(patternMap[type] || [20]);
}

function vibrateWeb(ms: number): void {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    navigator.vibrate(ms);
  }
}

function vibratePatternWeb(pattern: number[]): void {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    navigator.vibrate(pattern);
  }
}
