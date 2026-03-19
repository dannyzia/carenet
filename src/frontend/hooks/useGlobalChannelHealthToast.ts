/**
 * useGlobalChannelHealthToast — App-wide channel health degradation toasts
 * ────────────────────────────────────────────────────────────────────────
 * Monitors ALL registered Realtime channels simultaneously via
 * `getChannelHeartbeats()` and fires sonner toasts whenever ANY channel
 * transitions between healthy/stale/dead states.
 *
 * Unlike `useChannelHealthToast` (which watches a single channel), this
 * hook is designed to be placed ONCE in the app shell (RootLayout) to
 * provide global coverage without requiring each page to wire up its
 * own toast hook.
 *
 * How it works:
 *   1. Subscribes to `onHeartbeatStatusChange` for event-driven updates
 *   2. Polls `getChannelHeartbeats()` every 5s for elapsed-time freshness
 *   3. Tracks previous status per-channel in a Map ref
 *   4. On each update, diffs current vs previous statuses
 *   5. Fires per-channel toasts (deduped by channel ID) for transitions
 *   6. Handles channel registration/unregistration gracefully
 *
 * Known channel labels are auto-mapped from channel ID patterns:
 *   - "monetization:*"  → "Wallet feed"
 *   - "admin:*"         → "Admin feed"
 *   - "contracts:*"     → "Contracts feed"
 *   - fallback          → channel ID
 *
 * Usage (in RootLayout or App.tsx):
 *   useGlobalChannelHealthToast();
 *   useGlobalChannelHealthToast({ showRecovery: false });
 */

import { useEffect, useRef, useCallback } from "react";
import { useAriaToast } from "./useAriaToast";
import { useTranslation } from "react-i18next";
import {
  getChannelHeartbeats,
  onHeartbeatStatusChange,
  type ChannelHeartbeatState,
  type HeartbeatStatus,
} from "@/backend/services/realtime";

/** Default polling interval for elapsed-time freshness. */
const POLL_INTERVAL_MS = 5_000;

/**
 * Debounce window (ms) to batch rapid multi-channel transitions.
 * When multiple channels degrade simultaneously (e.g. network drop),
 * we batch them into a single diff pass rather than firing N toasts
 * in rapid succession.
 */
const DEBOUNCE_MS = 300;

/** Threshold: when this many channels transition simultaneously, use batch toast. */
const BATCH_THRESHOLD = 3;

/** Maps channel ID patterns to human-readable labels for toasts. */
function deriveChannelLabel(channelId: string): string {
  if (channelId.startsWith("monetization:")) return "Wallet feed";
  if (channelId.startsWith("admin:")) return "Admin feed";
  if (channelId.startsWith("contracts:")) return "Contracts feed";
  if (channelId.startsWith("general:")) return "Notifications";
  return channelId;
}

export interface GlobalChannelHealthToastOptions {
  /** Show a recovery toast when a channel becomes healthy again? Default: true */
  showRecovery?: boolean;
  /** Override polling interval (ms). Default: 5000 */
  pollMs?: number;
}

type StatusMap = Map<string, HeartbeatStatus>;

export function useGlobalChannelHealthToast(
  options: GlobalChannelHealthToastOptions = {},
): void {
  const { showRecovery = true, pollMs = POLL_INTERVAL_MS } = options;
  const { t } = useTranslation("common");
  const toast = useAriaToast();

  // Track previous statuses per channel
  const prevStatusMapRef = useRef<StatusMap>(new Map());
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Stable reference for the diff + toast logic
  const processChanges = useCallback(() => {
    const channels = getChannelHeartbeats();
    const prev = prevStatusMapRef.current;
    const currentIds = new Set<string>();

    // Collect transitions for batch analysis
    const staleTransitions: string[] = [];
    const deadTransitions: string[] = [];
    const recoveryTransitions: string[] = [];

    for (const ch of channels) {
      currentIds.add(ch.channelId);
      const prevStatus = prev.get(ch.channelId);
      const currentStatus = ch.status;

      // First time seeing this channel — record but don't toast
      if (prevStatus === undefined) {
        prev.set(ch.channelId, currentStatus);
        continue;
      }

      // No change
      if (currentStatus === prevStatus) continue;

      // Update map
      prev.set(ch.channelId, currentStatus);

      // Categorize transitions
      if (prevStatus === "healthy" && currentStatus === "stale") {
        staleTransitions.push(ch.channelId);
      } else if (
        (prevStatus === "stale" || prevStatus === "healthy") &&
        currentStatus === "dead"
      ) {
        deadTransitions.push(ch.channelId);
      } else if (
        showRecovery &&
        (prevStatus === "dead" || prevStatus === "stale") &&
        currentStatus === "healthy"
      ) {
        recoveryTransitions.push(ch.channelId);
      }
    }

    // ─── Batch toast: 3+ channels stale simultaneously ───
    if (staleTransitions.length >= BATCH_THRESHOLD) {
      toast.warning(
        t("connectivity.toast.multiChannelStale", {
          defaultValue: "{{count}} channels — checking connections...",
          count: staleTransitions.length,
        }),
        {
          id: "global-channel-health:batch-stale",
          description: t("connectivity.toast.multiChannelStaleDesc", {
            defaultValue: "Multiple data feeds have gone quiet. Verifying health.",
          }),
          duration: 10_000,
        },
      );
    } else {
      // Individual stale toasts
      for (const channelId of staleTransitions) {
        const label = deriveChannelLabel(channelId);
        toast.warning(
          t("connectivity.toast.channelStale", {
            defaultValue: "{{label}} — checking connection...",
            label,
          }),
          {
            id: `global-channel-health:${channelId}`,
            description: t("connectivity.toast.channelStaleDesc", {
              defaultValue: "No data received recently. Verifying channel health.",
            }),
            duration: 8_000,
          },
        );
      }
    }

    // ─── Batch toast: 3+ channels dead simultaneously ───
    if (deadTransitions.length >= BATCH_THRESHOLD) {
      toast.error(
        t("connectivity.toast.multiChannelDead", {
          defaultValue: "{{count}} channels — connections lost",
          count: deadTransitions.length,
        }),
        {
          id: "global-channel-health:batch-dead",
          description: t("connectivity.toast.multiChannelDeadDesc", {
            defaultValue: "Multiple real-time feeds are down. Attempting to reconnect...",
          }),
          duration: 20_000,
        },
      );
    } else {
      // Individual dead toasts
      for (const channelId of deadTransitions) {
        const label = deriveChannelLabel(channelId);
        toast.error(
          t("connectivity.toast.channelDead", {
            defaultValue: "{{label}} — connection lost",
            label,
          }),
          {
            id: `global-channel-health:${channelId}`,
            description: t("connectivity.toast.channelDeadDesc", {
              defaultValue: "Real-time updates paused. Attempting to reconnect...",
            }),
            duration: 15_000,
          },
        );
      }
    }

    // ─── Batch toast: 3+ channels recovered simultaneously ───
    if (recoveryTransitions.length >= BATCH_THRESHOLD) {
      toast.success(
        t("connectivity.toast.multiChannelRecovered", {
          defaultValue: "{{count}} channels — reconnected",
          count: recoveryTransitions.length,
        }),
        {
          id: "global-channel-health:batch-recovered",
          description: t("connectivity.toast.multiChannelRecoveredDesc", {
            defaultValue: "All affected data feeds are flowing again.",
          }),
          duration: 4_000,
        },
      );
    } else {
      // Individual recovery toasts
      for (const channelId of recoveryTransitions) {
        const label = deriveChannelLabel(channelId);
        toast.success(
          t("connectivity.toast.channelRecovered", {
            defaultValue: "{{label}} — reconnected",
            label,
          }),
          {
            id: `global-channel-health:${channelId}`,
            description: t("connectivity.toast.channelRecoveredDesc", {
              defaultValue: "Real-time updates are flowing again.",
            }),
            duration: 4_000,
          },
        );
      }
    }

    // Clean up channels that were unregistered
    for (const id of prev.keys()) {
      if (!currentIds.has(id)) {
        prev.delete(id);
      }
    }
  }, [showRecovery, t, toast]);

  // Debounced wrapper to batch rapid events
  const scheduleDiff = useCallback(() => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(processChanges, DEBOUNCE_MS);
  }, [processChanges]);

  useEffect(() => {
    // Initial snapshot (no toasts, just populate the map)
    const channels = getChannelHeartbeats();
    const map = prevStatusMapRef.current;
    for (const ch of channels) {
      if (!map.has(ch.channelId)) {
        map.set(ch.channelId, ch.status);
      }
    }

    // 1. Event-driven: heartbeat status change callback
    const unsub = onHeartbeatStatusChange(() => {
      scheduleDiff();
    });

    // 2. Polling: periodic check for elapsed-time-driven transitions
    const timer = setInterval(() => {
      scheduleDiff();
    }, pollMs);

    return () => {
      unsub();
      clearInterval(timer);
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [pollMs, scheduleDiff]);
}