/**
 * useChannelHealthToast — Toasts on channel health degradation
 * ─────────────────────────────────────────────────────────────
 * Monitors a specific Realtime channel's heartbeat status and fires
 * a sonner toast whenever the channel transitions:
 *   - healthy → stale  (amber warning)
 *   - stale   → dead   (red error)
 *   - dead    → healthy (green recovery)
 *
 * Designed to be dropped into any page that subscribes to a Realtime
 * channel (Wallet, Contract, Admin dashboards) to give users immediate
 * visual feedback when their live data feed is degrading.
 *
 * Deduplication: uses a per-channel toast ID so rapid transitions
 * don't stack multiple toasts — each new transition dismisses the
 * previous one for that channel.
 *
 * Usage:
 *   useChannelHealthToast("monetization:guardian-1");
 *   useChannelHealthToast("admin:monetization", { showRecovery: false });
 */

import { useEffect, useRef } from "react";
import { useAriaToast } from "./useAriaToast";
import { useTranslation } from "react-i18next";
import { useChannelHealth } from "./useChannelHealth";
import type { HeartbeatStatus } from "@/backend/services/realtime";

export interface ChannelHealthToastOptions {
  /** Show a recovery toast when the channel becomes healthy again? Default: true */
  showRecovery?: boolean;
  /** Custom label for the channel in the toast (e.g. "Wallet feed"). Falls back to channelId. */
  channelLabel?: string;
  /** Override the polling interval for the underlying useChannelHealth hook. */
  pollMs?: number;
}

/**
 * Watch a channel's heartbeat status and fire toasts on degradation.
 * This hook is purely side-effectful — it returns nothing.
 */
export function useChannelHealthToast(
  channelId: string | null | undefined,
  options: ChannelHealthToastOptions = {},
): void {
  const toast = useAriaToast();
  const { showRecovery = true, channelLabel, pollMs } = options;
  const { t } = useTranslation("common");
  const health = useChannelHealth(channelId, pollMs);
  const prevStatusRef = useRef<HeartbeatStatus | "unknown">("unknown");

  // Derive the display name for toasts
  const label = channelLabel || channelId || "channel";

  useEffect(() => {
    const currentStatus: HeartbeatStatus | "unknown" = health?.status ?? "unknown";
    const prevStatus = prevStatusRef.current;

    // Skip on first mount or when not tracked
    if (prevStatus === "unknown" && currentStatus === "unknown") return;

    // Only fire on actual transitions
    if (currentStatus === prevStatus) return;

    // Update ref immediately
    prevStatusRef.current = currentStatus;

    // Toast ID = channel-specific so we replace rather than stack
    const toastId = `channel-health:${channelId}`;

    // ─── Degradation: healthy → stale ───
    if (prevStatus === "healthy" && currentStatus === "stale") {
      toast.warning(
        t("connectivity.toast.channelStale", {
          defaultValue: "{{label}} — checking connection...",
          label,
        }),
        {
          id: toastId,
          description: t("connectivity.toast.channelStaleDesc", {
            defaultValue: "No data received recently. Verifying channel health.",
          }),
          duration: 8_000,
        },
      );
      return;
    }

    // ─── Degradation: stale → dead ───
    if (
      (prevStatus === "stale" || prevStatus === "healthy") &&
      currentStatus === "dead"
    ) {
      toast.error(
        t("connectivity.toast.channelDead", {
          defaultValue: "{{label}} — connection lost",
          label,
        }),
        {
          id: toastId,
          description: t("connectivity.toast.channelDeadDesc", {
            defaultValue: "Real-time updates paused. Attempting to reconnect...",
          }),
          duration: 15_000,
        },
      );
      return;
    }

    // ─── Recovery: dead/stale → healthy ───
    if (
      showRecovery &&
      (prevStatus === "dead" || prevStatus === "stale") &&
      currentStatus === "healthy"
    ) {
      toast.success(
        t("connectivity.toast.channelRecovered", {
          defaultValue: "{{label}} — reconnected",
          label,
        }),
        {
          id: toastId,
          description: t("connectivity.toast.channelRecoveredDesc", {
            defaultValue: "Real-time updates are flowing again.",
          }),
          duration: 4_000,
        },
      );
      return;
    }

    // ─── Transition to unknown (channel unregistered) ───
    // Silently update ref, no toast needed
  }, [health?.status, channelId, label, showRecovery, t]);

  // Reset prevStatus when channelId changes
  useEffect(() => {
    prevStatusRef.current = "unknown";
  }, [channelId]);
}