/**
 * unregisterDevice — Deactivate this device's push token on logout
 * ─────────────────────────────────────────────────────────────────
 * Reads the token persisted by registerDeviceForPush() in localStorage
 * and deactivates only that specific token row. If no stored token is
 * found, falls back to deactivating all tokens for the user.
 */

import { USE_SUPABASE, getSupabaseClient } from "@/backend/services/supabase";
import { getStoredDeviceToken, clearStoredDeviceToken } from "./registerDevice";

/**
 * Deactivates this device's push token for the current user.
 * Call this during the logout flow before clearing the session.
 *
 * @returns true if the token was deactivated, false if skipped/failed
 */
export async function unregisterDeviceForPush(): Promise<boolean> {
  if (!USE_SUPABASE) {
    console.log("[unregisterDevice] Skipped — Supabase not connected");
    return false;
  }

  try {
    const sb = getSupabaseClient();

    // Get current user before logout clears the session
    const { data: { user } } = await sb.auth.getUser();
    if (!user) {
      console.log("[unregisterDevice] Skipped — no authenticated user");
      clearStoredDeviceToken();
      return false;
    }

    const storedToken = getStoredDeviceToken();

    if (storedToken) {
      // Target only this device's token
      const { error } = await sb
        .from("device_tokens")
        .update({ active: false })
        .eq("user_id", user.id)
        .eq("token", storedToken);

      if (error) {
        console.error("[unregisterDevice] Failed to deactivate token:", error);
        return false;
      }

      console.log("[unregisterDevice] Deactivated token for this device:", storedToken.slice(0, 12) + "…");
    } else {
      // Fallback: no stored token, deactivate all tokens for this user
      console.warn("[unregisterDevice] No stored token — deactivating all tokens for user");
      const { error } = await sb
        .from("device_tokens")
        .update({ active: false })
        .eq("user_id", user.id);

      if (error) {
        console.error("[unregisterDevice] Failed to deactivate all tokens:", error);
        return false;
      }
    }

    // Always clear localStorage regardless of outcome
    clearStoredDeviceToken();
    return true;
  } catch (e) {
    console.error("[unregisterDevice] Failed:", e);
    clearStoredDeviceToken();
    return false;
  }
}
