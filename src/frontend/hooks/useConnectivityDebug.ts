/**
 * useConnectivityDebug
 * ────────────────────
 * Aggregates every connectivity signal into one object for dev tools.
 *
 * Subscribes to:
 *   - onlineState (online/offline, connection type, probe stats)
 *   - realtime.ts  (Supabase channel status)
 *   - retry.ts     (active retry count + last retry info)
 *
 * Polls probe interval / failure count on a 2s tick (they are plain
 * variables with no event emitter, so polling is the only option).
 *
 * Usage:
 *   const debug = useConnectivityDebug();
 *   // render debug.isOnline, debug.probeInterval, etc.
 */

import { useState, useEffect, useRef } from "react";
import {
  isOnline as getOnline,
  getConnectionType,
  getCurrentProbeInterval,
  getConsecutiveProbeFailures,
  isProbeRunning,
  isProbePausedForDataSaver,
  isDataSaverEnabled,
  onOnlineChange,
  onDataSaverChange,
} from "@/backend/utils/onlineState";
import {
  getRetryActivity,
  onRetryActivityChange,
  type RetryActivity,
} from "@/backend/utils/retry";
import {
  getConnectionStatus,
  onConnectionStatusChange,
  type ConnectionStatus,
  getHeartbeatStatus,
  getTimeSinceLastMessage,
  isHeartbeatRunning,
  onHeartbeatStatusChange,
  getChannelHeartbeats,
  type ChannelHeartbeatState,
} from "@/backend/services/realtime";

export interface ConnectivityDebugInfo {
  // ─── Online State ───
  /** Device-level online flag (combines all sources) */
  isOnline: boolean;
  /** Connection type reported by Network Information API / Capacitor */
  connectionType: string;

  // ─── Lie-Fi Probe ───
  /** Whether the probe loop is currently active */
  probeRunning: boolean;
  /** Current probe interval in ms (increases during backoff) */
  probeIntervalMs: number;
  /** Human-readable probe interval (e.g. "30s", "2m") */
  probeIntervalLabel: string;
  /** Whether the probe interval has been increased due to failures */
  probeInBackoff: boolean;
  /** Number of consecutive probe failures */
  probeConsecutiveFailures: number;
  /** Whether probing is paused because Data Saver / Lite Mode is on */
  probePausedForDataSaver: boolean;

  // ─── Data Saver ───
  /** Whether the browser's Data Saver / Lite Mode is currently enabled */
  dataSaverEnabled: boolean;

  // ─── Realtime ───
  /** Supabase Realtime channel status */
  realtimeStatus: ConnectionStatus;
  /** Application-level heartbeat status ("healthy" | "stale" | "dead") */
  heartbeatStatus: string;
  /** Whether the heartbeat monitor is running */
  heartbeatRunning: boolean;
  /** Seconds since last Realtime message was received */
  timeSinceLastMessageSec: number;
  /** Per-channel heartbeat states (each with its own staleMs threshold) */
  channelHeartbeats: ChannelHeartbeatState[];

  // ─── Retry Activity ───
  /** Number of service calls currently in backoff/retry */
  activeRetries: number;
  /** Info about the most recent retry (attempt, delay, error) */
  lastRetryInfo: RetryActivity["lastRetryInfo"];

  // ─── Timestamps ───
  /** When this snapshot was last refreshed */
  lastUpdated: string;
}

function formatInterval(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  const s = Math.round(ms / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  const rem = s % 60;
  return rem > 0 ? `${m}m ${rem}s` : `${m}m`;
}

function buildSnapshot(
  online: boolean,
  connectionType: string,
  realtimeStatus: ConnectionStatus,
  retryActivity: RetryActivity,
): ConnectivityDebugInfo {
  const probeInterval = getCurrentProbeInterval();
  const baseInterval = 30_000; // DEFAULT_PROBE.intervalMs
  return {
    isOnline: online,
    connectionType,
    probeRunning: isProbeRunning(),
    probeIntervalMs: probeInterval,
    probeIntervalLabel: formatInterval(probeInterval),
    probeInBackoff: probeInterval > baseInterval,
    probeConsecutiveFailures: getConsecutiveProbeFailures(),
    probePausedForDataSaver: isProbePausedForDataSaver(),
    dataSaverEnabled: isDataSaverEnabled(),
    realtimeStatus,
    heartbeatStatus: getHeartbeatStatus(),
    heartbeatRunning: isHeartbeatRunning(),
    timeSinceLastMessageSec: Math.round(getTimeSinceLastMessage() / 1000),
    channelHeartbeats: getChannelHeartbeats(),
    activeRetries: retryActivity.activeRetries,
    lastRetryInfo: retryActivity.lastRetryInfo,
    lastUpdated: new Date().toISOString(),
  };
}

/**
 * Hook that exposes a comprehensive connectivity debug snapshot.
 * Updates on every event-driven change and also polls probe stats every 2s.
 */
export function useConnectivityDebug(): ConnectivityDebugInfo {
  const [info, setInfo] = useState<ConnectivityDebugInfo>(() =>
    buildSnapshot(
      getOnline(),
      getConnectionType(),
      getConnectionStatus(),
      getRetryActivity(),
    )
  );

  // Mutable refs so the poll callback always reads the latest event-driven values
  const realtimeRef = useRef<ConnectionStatus>(getConnectionStatus());
  const retryRef = useRef<RetryActivity>(getRetryActivity());

  const refresh = () => {
    setInfo(
      buildSnapshot(
        getOnline(),
        getConnectionType(),
        realtimeRef.current,
        retryRef.current,
      )
    );
  };

  useEffect(() => {
    // ─── Event-driven subscriptions ───
    const unsubOnline = onOnlineChange(() => refresh());

    const unsubRealtime = onConnectionStatusChange((status) => {
      realtimeRef.current = status;
      refresh();
    });

    const unsubRetry = onRetryActivityChange((activity) => {
      retryRef.current = activity;
      refresh();
    });

    // ─── Data Saver changes (mid-session toggle) ───
    const unsubDataSaver = onDataSaverChange(() => refresh());

    // ─── Heartbeat status changes ───
    const unsubHeartbeat = onHeartbeatStatusChange(() => refresh());

    // ─── Polling for probe stats (no event emitter for these) ───
    const pollTimer = setInterval(refresh, 2_000);

    return () => {
      unsubOnline();
      unsubRealtime();
      unsubRetry();
      unsubDataSaver();
      unsubHeartbeat();
      clearInterval(pollTimer);
    };
  }, []);

  return info;
}
