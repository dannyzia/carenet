/**
 * ConnectivityDebugPanel
 * ──────────────────────
 * Dev-only floating overlay for connectivity debugging.
 * Toggle: Ctrl+Shift+D / Triple-tap
 */

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Wifi, RotateCcw, Heart,
  X, Minimize2, Maximize2, Bug, Clock, AlertTriangle, BatteryLow, Receipt, Moon, Play, Smartphone,
} from "lucide-react";
import { useConnectivityDebug, type ConnectivityDebugInfo } from "@/frontend/hooks/useConnectivityDebug";
import type { ChannelHeartbeatState } from "@/backend/services/realtime";
import { emitBillingNotification } from "@/frontend/hooks/useBillingNotifications";
import type { BillingNotificationType } from "@/frontend/hooks/useBillingNotifications";
import { useAriaToast } from "@/frontend/hooks/useAriaToast";
import { USE_SUPABASE, getSupabaseClient } from "@/backend/services/supabase";
import { getStoredDeviceToken } from "@/frontend/native/registerDevice";

const DOT_GREEN = "#22C55E";
const DOT_AMBER = "#F59E0B";
const DOT_RED = "#EF4444";
const DOT_GRAY = "#9CA3AF";

function StatusDot({ color }: { color: string }) {
  return (
    <span
      className="inline-block w-2 h-2 rounded-full shrink-0"
      style={{ background: color }}
    />
  );
}

function Row({
  label,
  value,
  dotColor,
  icon: Icon,
  muted,
}: {
  label: string;
  value: string;
  dotColor?: string;
  icon?: React.ElementType;
  muted?: boolean;
}) {
  return (
    <div className="flex items-center gap-2 py-[3px]">
      {dotColor && <StatusDot color={dotColor} />}
      {Icon && !dotColor && <Icon className="w-3 h-3 shrink-0" style={{ color: DOT_GRAY }} />}
      <span className="text-[10px] opacity-60 shrink-0">{label}</span>
      <span
        className="text-[10px] ml-auto text-right truncate max-w-[140px]"
        style={{ opacity: muted ? 0.45 : 0.9 }}
      >
        {value}
      </span>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[9px] uppercase tracking-widest mt-2 mb-0.5 opacity-40">
      {children}
    </p>
  );
}

function PanelContent({ info, compact }: { info: ConnectivityDebugInfo; compact: boolean }) {
  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <StatusDot color={info.isOnline ? DOT_GREEN : DOT_RED} />
        <span className="text-[10px] opacity-70">
          {info.isOnline ? "Online" : "Offline"}
          {info.probeInBackoff && " (backoff)"}
          {info.dataSaverEnabled && " (saver)"}
        </span>
        <StatusDot color={
          info.realtimeStatus === "connected" ? DOT_GREEN
          : info.realtimeStatus === "connecting" ? DOT_AMBER
          : DOT_RED
        } />
        <span className="text-[10px] opacity-70">{info.realtimeStatus}</span>
        {info.activeRetries > 0 && (
          <>
            <RotateCcw className="w-3 h-3 animate-spin" style={{ color: DOT_AMBER }} />
            <span className="text-[10px]" style={{ color: DOT_AMBER }}>
              {info.activeRetries}
            </span>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-0.5">
      <SectionLabel>Network</SectionLabel>
      <Row
        label="Status"
        value={info.isOnline ? "Online" : "Offline"}
        dotColor={info.isOnline ? DOT_GREEN : DOT_RED}
      />
      <Row
        label="Type"
        value={info.connectionType}
        icon={Wifi}
        muted={info.connectionType === "unknown"}
      />

      {info.dataSaverEnabled && (
        <Row
          label="Data Saver"
          value="Enabled — probe skipped"
          dotColor={DOT_AMBER}
        />
      )}

      <SectionLabel>Lie-Fi Probe</SectionLabel>
      <Row
        label="Running"
        value={info.probeRunning ? "Yes" : "Stopped"}
        dotColor={info.probeRunning ? DOT_GREEN : DOT_GRAY}
      />
      <Row
        label="Interval"
        value={info.probeIntervalLabel}
        icon={Clock}
        muted={!info.probeInBackoff}
      />
      {info.probeInBackoff && (
        <Row
          label="Backoff"
          value={`Active (${info.probeConsecutiveFailures} failures)`}
          dotColor={DOT_AMBER}
        />
      )}
      {info.probePausedForDataSaver && (
        <Row
          label="Paused"
          value="Data Saver active"
          icon={BatteryLow}
        />
      )}
      <Row
        label="Failures"
        value={String(info.probeConsecutiveFailures)}
        icon={AlertTriangle}
        muted={info.probeConsecutiveFailures === 0}
      />

      <SectionLabel>Realtime</SectionLabel>
      <Row
        label="Channel"
        value={info.realtimeStatus}
        dotColor={
          info.realtimeStatus === "connected" ? DOT_GREEN
          : info.realtimeStatus === "connecting" ? DOT_AMBER
          : DOT_RED
        }
      />
      <Row
        label="Heartbeat"
        value={info.heartbeatStatus}
        dotColor={
          info.heartbeatStatus === "healthy" ? DOT_GREEN
          : info.heartbeatStatus === "stale" ? DOT_AMBER
          : info.heartbeatStatus === "dead" ? DOT_RED
          : DOT_GRAY
        }
      />
      {info.heartbeatRunning && (
        <Row
          label="Last Msg"
          value={`${info.timeSinceLastMessageSec}s ago`}
          icon={Heart}
          muted={info.timeSinceLastMessageSec < 60}
        />
      )}

      {info.channelHeartbeats.length > 0 && (
        <>
          <SectionLabel>Channels ({info.channelHeartbeats.length})</SectionLabel>
          {info.channelHeartbeats.map((ch) => (
            <ChannelRow key={ch.channelId} channel={ch} />
          ))}
        </>
      )}

      <SectionLabel>Retries</SectionLabel>
      <Row
        label="Active"
        value={String(info.activeRetries)}
        dotColor={info.activeRetries > 0 ? DOT_AMBER : DOT_GRAY}
      />
      {info.lastRetryInfo && (
        <>
          <Row
            label="Attempt"
            value={`#${info.lastRetryInfo.attempt} (${info.lastRetryInfo.delayMs}ms)`}
            icon={RotateCcw}
          />
          <Row
            label="Error"
            value={info.lastRetryInfo.error}
            icon={AlertTriangle}
          />
        </>
      )}

      <SectionLabel>Billing Toasts</SectionLabel>
      <div className="flex flex-col gap-1">
        <BillingTestButton type="billing_proof_submitted" label="Submitted" color="#0288D1" />
        <BillingTestButton type="billing_proof_verified" label="Verified" color={DOT_GREEN} />
        <BillingTestButton type="billing_proof_rejected" label="Rejected" color={DOT_RED} />
      </div>

      <SectionLabel>Quiet Hours Queue</SectionLabel>
      <div className="flex flex-col gap-1">
        <QuietHoursTestButton />
        <ForceProcessQueueButton />
        <QueueStats />
      </div>

      <SectionLabel>Device Token</SectionLabel>
      <DeviceTokenRow />

      <div className="pt-1 mt-1" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <span className="text-[9px] opacity-30">
          Updated {new Date(info.lastUpdated).toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
}

function ChannelRow({ channel }: { channel: ChannelHeartbeatState }) {
  const elapsedSec = Math.round((Date.now() - channel.lastMessageTs) / 1000);
  const staleLabel = channel.staleMs >= 60_000
    ? `${Math.round(channel.staleMs / 60_000)}m`
    : `${Math.round(channel.staleMs / 1_000)}s`;

  return (
    <div
      className="py-[3px] px-1.5 rounded"
      style={{ background: "rgba(255,255,255,0.03)" }}
    >
      <div className="flex items-center gap-1.5">
        <StatusDot color={
          channel.status === "healthy" ? DOT_GREEN
          : channel.status === "stale" ? DOT_AMBER
          : channel.status === "dead" ? DOT_RED
          : DOT_GRAY
        } />
        <span className="text-[9px] opacity-70 truncate flex-1">{channel.channelId}</span>
        <span className="text-[9px] opacity-50">{channel.status}</span>
      </div>
      <div className="flex items-center gap-1.5 mt-0.5 pl-3.5">
        <span className="text-[9px] opacity-40">stale: {staleLabel}</span>
        <span className="text-[9px] opacity-40 ml-auto">
          msg: {elapsedSec}s ago
          {channel.consecutiveStaleChecks > 0 && (
            <> &middot; {channel.consecutiveStaleChecks}x</>
          )}
        </span>
      </div>
    </div>
  );
}

function useTripleTap(callback: () => void, timeWindowMs = 600) {
  const tapsRef = useRef<number[]>([]);

  useEffect(() => {
    const handler = () => {
      const now = Date.now();
      tapsRef.current.push(now);
      tapsRef.current = tapsRef.current.filter((t) => now - t < timeWindowMs);
      if (tapsRef.current.length >= 3) {
        tapsRef.current = [];
        callback();
      }
    };
    document.addEventListener("touchend", handler, { passive: true });
    return () => document.removeEventListener("touchend", handler);
  }, [callback, timeWindowMs]);
}

function useKeyboardShortcut(callback: () => void) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "d") {
        e.preventDefault();
        callback();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [callback]);
}

export function ConnectivityDebugPanel() {
  if (!import.meta.env.DEV) return null;
  return <DebugPanelInner />;
}

function DebugPanelInner() {
  const [visible, setVisible] = useState(false);
  const [compact, setCompact] = useState(false);
  const info = useConnectivityDebug();

  const toggle = useCallback(() => setVisible((v) => !v), []);
  useKeyboardShortcut(toggle);
  useTripleTap(toggle);

  const panelRef = useRef<HTMLDivElement>(null);
  const dragState = useRef({ dragging: false, startX: 0, startY: 0, origX: 0, origY: 0 });
  const [pos, setPos] = useState({ x: 16, y: 16 });

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest("button")) return;
    dragState.current = {
      dragging: true,
      startX: e.clientX,
      startY: e.clientY,
      origX: pos.x,
      origY: pos.y,
    };
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  }, [pos]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragState.current.dragging) return;
    const dx = e.clientX - dragState.current.startX;
    const dy = e.clientY - dragState.current.startY;
    setPos({
      x: dragState.current.origX + dx,
      y: dragState.current.origY + dy,
    });
  }, []);

  const onPointerUp = useCallback(() => {
    dragState.current.dragging = false;
  }, []);

  if (!visible) return null;

  return (
    <div
      ref={panelRef}
      className="fixed z-[9999] select-none"
      style={{
        left: pos.x,
        top: pos.y,
        width: compact ? "auto" : 240,
        maxHeight: compact ? "auto" : "80vh",
        background: "rgba(15, 15, 20, 0.92)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 12,
        color: "#E5E5E5",
        boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
        fontFamily: "'SF Mono', 'Fira Code', 'JetBrains Mono', monospace",
        overflow: "hidden",
        touchAction: "none",
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      <div
        className="flex items-center gap-1.5 px-3 py-1.5 cursor-grab active:cursor-grabbing"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
      >
        <Bug className="w-3 h-3 shrink-0" style={{ color: DOT_AMBER }} />
        <span className="text-[10px] opacity-60 flex-1">Connectivity Debug</span>
        <button
          onClick={() => setCompact((c) => !c)}
          className="p-0.5 rounded hover:bg-white/10 transition-colors"
          title={compact ? "Expand" : "Collapse"}
        >
          {compact ? (
            <Maximize2 className="w-3 h-3 opacity-50" />
          ) : (
            <Minimize2 className="w-3 h-3 opacity-50" />
          )}
        </button>
        <button
          onClick={() => setVisible(false)}
          className="p-0.5 rounded hover:bg-white/10 transition-colors"
          title="Close (Ctrl+Shift+D)"
        >
          <X className="w-3 h-3 opacity-50" />
        </button>
      </div>

      <div className="px-3 py-2 overflow-y-auto" style={{ maxHeight: compact ? "auto" : "calc(80vh - 32px)" }}>
        <PanelContent info={info} compact={compact} />
      </div>
    </div>
  );
}

function BillingTestButton({ type, label, color }: { type: BillingNotificationType; label: string; color: string }) {
  const SAMPLE: Record<BillingNotificationType, { title: string; body: string; actionUrl: string }> = {
    billing_proof_submitted: {
      title: "Payment Proof Received",
      body: "Fatima Rahman submitted proof of \u09F38,500 via bKash for INV-2026-0042.",
      actionUrl: "/billing/verify/PP-TEST",
    },
    billing_proof_verified: {
      title: "Payment Verified",
      body: "Your payment of \u09F312,000 for INV-2026-0038 has been verified.",
      actionUrl: "/billing/invoice/INV-2026-0038",
    },
    billing_proof_rejected: {
      title: "Payment Proof Rejected",
      body: "Your proof for INV-2026-0040 was rejected. Reason: Blurry image.",
      actionUrl: "/billing/invoice/INV-2026-0040",
    },
  };

  const fire = () => {
    const s = SAMPLE[type];
    emitBillingNotification({
      id: `bn-test-${Date.now()}`,
      type,
      title: s.title,
      body: s.body,
      actionUrl: s.actionUrl,
      createdAt: new Date().toISOString(),
    });
  };

  return (
    <button
      className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-white/10 transition-colors"
      onClick={fire}
      style={{ color }}
    >
      <Receipt className="w-3 h-3" />
      <span className="text-[9px]">Test: {label}</span>
    </button>
  );
}

function QuietHoursTestButton() {
  const [queued, setQueued] = useState(false);
  const toast = useAriaToast();

  const fire = () => {
    if (queued) return;
    setQueued(true);

    toast.info("Notification queued", {
      description: "Push deferred during quiet hours. Will deliver in 3s...",
      duration: 3000,
    });

    setTimeout(() => {
      emitBillingNotification({
        id: `bn-quiet-${Date.now()}`,
        type: "billing_proof_submitted",
        title: "[Quiet Hours Ended] Payment Proof Received",
        body: "Fatima Rahman submitted proof of \u09F38,500 via bKash for INV-2026-0042. (Delivered after quiet hours)",
        actionUrl: "/billing/verify/PP-TEST",
        createdAt: new Date().toISOString(),
      });
      setQueued(false);
    }, 3000);
  };

  return (
    <button
      className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-white/10 transition-colors"
      onClick={fire}
      style={{ color: queued ? DOT_GRAY : DOT_AMBER, opacity: queued ? 0.5 : 1 }}
      disabled={queued}
    >
      <Moon className="w-3 h-3" />
      <span className="text-[9px]">{queued ? "Queued… delivering in 3s" : "Test: Quiet Hours Queue"}</span>
    </button>
  );
}

function ForceProcessQueueButton() {
  const [processing, setProcessing] = useState(false);
  const toast = useAriaToast();

  const fire = async () => {
    if (processing) return;
    setProcessing(true);

    if (!USE_SUPABASE) {
      toast.info("Force Process Queue (mock)", {
        description: "Supabase not connected — simulating queue flush...",
        duration: 2000,
      });
      await new Promise((r) => setTimeout(r, 1500));
      toast.success("Queue flushed (mock)", {
        description: "0 queued notifications processed (no real backend).",
        duration: 3000,
      });
      setProcessing(false);
      return;
    }

    try {
      toast.info("Invoking process-queued-notifications...", {
        description: "Calling Edge Function to flush the queue.",
        duration: 3000,
      });

      const sb = getSupabaseClient();
      const { data, error } = await sb.functions.invoke(
        "process-queued-notifications",
        { body: {} }
      );

      if (error) {
        toast.error("Queue processing failed", {
          description: error.message,
          duration: 5000,
        });
      } else {
        const processed = data?.processed ?? 0;
        toast.success("Queue processed", {
          description: `${processed} notification${processed !== 1 ? "s" : ""} delivered.`,
          duration: 3000,
        });
      }
    } catch (e: any) {
      toast.error("Queue processing error", {
        description: e?.message ?? "Unknown error",
        duration: 5000,
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <button
      className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-white/10 transition-colors"
      onClick={fire}
      style={{ color: processing ? DOT_GRAY : DOT_GREEN, opacity: processing ? 0.5 : 1 }}
      disabled={processing}
    >
      <Play className="w-3 h-3" />
      <span className="text-[9px]">
        {processing ? "Processing…" : `Force Process Queue${USE_SUPABASE ? "" : " (mock)"}`}
      </span>
    </button>
  );
}

function QueueStats() {
  const [stats, setStats] = useState<{ queued: number; delivered: number } | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchStats = useCallback(async () => {
    if (!USE_SUPABASE) {
      setStats({ queued: 0, delivered: 0 });
      return;
    }
    setLoading(true);
    try {
      const sb = getSupabaseClient();
      const [pendingRes, deliveredRes] = await Promise.all([
        sb.from("queued_notifications").select("id", { count: "exact", head: true }).eq("processed", false),
        sb.from("queued_notifications").select("id", { count: "exact", head: true }).eq("processed", true),
      ]);
      setStats({
        queued: pendingRes.count ?? 0,
        delivered: deliveredRes.count ?? 0,
      });
    } catch {
      // ignore — panel is best-effort
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 10_000);
    return () => clearInterval(interval);
  }, [fetchStats]);

  return (
    <div
      className="flex items-center gap-1.5 px-2 py-1 rounded"
      style={{ background: "rgba(255,255,255,0.03)" }}
    >
      <Clock className="w-3 h-3 shrink-0" style={{ color: DOT_GRAY }} />
      <span className="text-[9px] opacity-60">
        {loading ? "Loading…" : stats
          ? `${stats.queued} queued \u00b7 ${stats.delivered} delivered`
          : "—"}
      </span>
      <button
        onClick={fetchStats}
        className="ml-auto p-0.5 rounded hover:bg-white/10 transition-colors"
        title="Refresh stats"
      >
        <RotateCcw className="w-2.5 h-2.5 opacity-40" />
      </button>
    </div>
  );
}

function DeviceTokenRow() {
  const token = getStoredDeviceToken();

  return (
    <div
      className="flex items-center gap-1.5 px-2 py-1 rounded"
      style={{ background: "rgba(255,255,255,0.03)" }}
    >
      <Smartphone className="w-3 h-3 shrink-0" style={{ color: token ? DOT_GREEN : DOT_GRAY }} />
      <span className="text-[9px] opacity-60 shrink-0">Push Token</span>
      <span
        className="text-[9px] ml-auto truncate max-w-[120px]"
        style={{ opacity: token ? 0.8 : 0.4, fontFamily: "monospace" }}
        title={token ?? undefined}
      >
        {token ? `${token.slice(0, 12)}…${token.slice(-4)}` : "Not registered"}
      </span>
    </div>
  );
}