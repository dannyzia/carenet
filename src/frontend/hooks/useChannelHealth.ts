/**
 * useChannelHealth — React hook for per-channel heartbeat health.
 * ────────────────────────────────────────────────────────────────
 * Encapsulates the subscribe-to-heartbeat-changes + polling logic
 * that was previously duplicated inside SubscriptionHealthBadge.
 *
 * Returns the live ChannelHeartbeatState for the given channel ID,
 * or null if the channel is not currently registered in the
 * heartbeat system (e.g. before the Realtime subscription starts
 * or after it tears down).
 *
 * Updates are driven by two mechanisms:
 *   1. Event-driven: the `onHeartbeatStatusChange` callback fires
 *      whenever any channel transitions between healthy/stale/dead.
 *   2. Polling: a 5-second interval re-reads channel state to keep
 *      the "time since last message" counter fresh in the UI.
 *
 * Usage:
 *   const health = useChannelHealth("monetization:guardian-1");
 *   // health?.status  → "healthy" | "stale" | "dead" | undefined
 *   // health?.staleMs → threshold in ms
 *   // health?.lastMessageTs → Date.now() of last received message
 */

import { useState, useEffect, useCallback } from "react";
import {
  onHeartbeatStatusChange,
  getChannelHeartbeats,
  type ChannelHeartbeatState,
} from "@/backend/services/realtime";

/** Default polling interval to refresh elapsed time (ms). */
const POLL_INTERVAL_MS = 5_000;

/**
 * Track the heartbeat health of a specific Realtime channel.
 *
 * @param channelId - The Realtime channel name to monitor
 *                    (e.g. "monetization:guardian-1", "admin:monetization").
 *                    Pass `null` or `undefined` to disable monitoring.
 * @param pollMs    - Optional: override the polling interval (default 5s).
 * @returns The current ChannelHeartbeatState, or null if not registered.
 */
export function useChannelHealth(
  channelId: string | null | undefined,
  pollMs: number = POLL_INTERVAL_MS,
): ChannelHeartbeatState | null {
  const findChannel = useCallback((): ChannelHeartbeatState | null => {
    if (!channelId) return null;
    const channels = getChannelHeartbeats();
    return channels.find((ch) => ch.channelId === channelId) ?? null;
  }, [channelId]);

  const [state, setState] = useState<ChannelHeartbeatState | null>(() => findChannel());

  useEffect(() => {
    if (!channelId) {
      setState(null);
      return;
    }

    // Sync immediately
    setState(findChannel());

    // 1. Event-driven: re-read on any heartbeat status transition
    const unsub = onHeartbeatStatusChange(() => {
      setState(findChannel());
    });

    // 2. Polling: keep elapsed-time counter fresh
    const timer = setInterval(() => {
      setState(findChannel());
    }, pollMs);

    return () => {
      unsub();
      clearInterval(timer);
    };
  }, [channelId, pollMs, findChannel]);

  return state;
}

// ─── Convenience derived values ───

export interface ChannelHealthSummary {
  /** The raw channel state, or null if not registered. */
  state: ChannelHeartbeatState | null;
  /** Whether the channel is currently being tracked. */
  isTracked: boolean;
  /** Status string, or "unknown" if not tracked. */
  status: "healthy" | "stale" | "dead" | "unknown";
  /** Seconds since last message was received, or -1 if not tracked. */
  elapsedSec: number;
  /** Human-readable threshold label (e.g. "30s", "2m"). */
  thresholdLabel: string;
}

/**
 * Extended hook that returns derived summary fields in addition to raw state.
 * Useful for components that need formatted display values without manual computation.
 */
export function useChannelHealthSummary(
  channelId: string | null | undefined,
  pollMs?: number,
): ChannelHealthSummary {
  const state = useChannelHealth(channelId, pollMs);

  if (!state) {
    return {
      state: null,
      isTracked: false,
      status: "unknown",
      elapsedSec: -1,
      thresholdLabel: "-",
    };
  }

  const elapsedSec = Math.round((Date.now() - state.lastMessageTs) / 1000);
  const thresholdLabel = state.staleMs >= 60_000
    ? `${Math.round(state.staleMs / 60_000)}m`
    : `${Math.round(state.staleMs / 1_000)}s`;

  return {
    state,
    isTracked: true,
    status: state.status,
    elapsedSec,
    thresholdLabel,
  };
}
