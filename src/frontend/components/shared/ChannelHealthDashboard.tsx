/**
 * ChannelHealthDashboard — Visual card component showing all tracked channels
 */

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
  Activity,
  Wifi,
  WifiOff,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import {
  getChannelHeartbeats,
  onHeartbeatStatusChange,
  getHeartbeatStatus,
  recordMessageReceived,
  type ChannelHeartbeatState,
  type HeartbeatStatus,
} from "@/backend/services/realtime";
import { cn } from "@/frontend/theme/tokens";
import { ChannelHealthSparkline } from "./ChannelHealthSparkline";

const STATUS_COLORS: Record<HeartbeatStatus, {
  color: string;
  bg: string;
  label: string;
  icon: typeof CheckCircle2;
}> = {
  healthy: {
    color: "#5FB865",
    bg: "rgba(95, 184, 101, 0.12)",
    label: "Healthy",
    icon: CheckCircle2,
  },
  stale: {
    color: "#E8A838",
    bg: "rgba(232, 168, 56, 0.12)",
    label: "Checking...",
    icon: AlertTriangle,
  },
  dead: {
    color: "#EF4444",
    bg: "rgba(239, 68, 68, 0.12)",
    label: "Disconnected",
    icon: XCircle,
  },
};

function deriveLabel(channelId: string): string {
  if (channelId.startsWith("monetization:")) return "Wallet Feed";
  if (channelId.startsWith("admin:")) return "Admin Feed";
  if (channelId.startsWith("contracts:")) return "Contracts Feed";
  if (channelId.startsWith("general:")) return "Notifications";
  if (channelId.startsWith("wallet:")) return "Wallet";
  if (channelId.startsWith("test:")) return "Test Channel";
  return channelId;
}

function formatThreshold(ms: number): string {
  if (ms >= 60_000) return `${Math.round(ms / 60_000)}m`;
  return `${Math.round(ms / 1_000)}s`;
}

export const DEFAULT_SPARKLINE_WINDOWS: Record<string, number> = {
  "monetization:": 60_000,
  "wallet:": 60_000,
  "contracts:": 120_000,
  "admin:": 300_000,
  "test:": 120_000,
};

const DEFAULT_SPARKLINE_WINDOW_MS = 120_000;

function resolveSparklineWindow(
  channelId: string,
  overrides?: Record<string, number>,
): number {
  const map = overrides
    ? { ...DEFAULT_SPARKLINE_WINDOWS, ...overrides }
    : DEFAULT_SPARKLINE_WINDOWS;

  for (const [prefix, windowMs] of Object.entries(map)) {
    if (channelId.startsWith(prefix)) return windowMs;
  }
  return DEFAULT_SPARKLINE_WINDOW_MS;
}

function formatWindowLabel(ms: number): string {
  if (ms >= 60_000) return `${Math.round(ms / 60_000)}m`;
  return `${Math.round(ms / 1_000)}s`;
}

function ChannelRow({
  channel,
  onReconnect,
  sparklineWindowOverrides,
}: {
  channel: ChannelHeartbeatState;
  onReconnect: (channelId: string) => void;
  sparklineWindowOverrides?: Record<string, number>;
}) {
  const elapsed = Math.round((Date.now() - channel.lastMessageTs) / 1000);
  const progress = Math.min(1, elapsed / (channel.staleMs / 1000));
  const cfg = STATUS_COLORS[channel.status];
  const StatusIcon = cfg.icon;
  const label = deriveLabel(channel.channelId);
  const windowMs = resolveSparklineWindow(channel.channelId, sparklineWindowOverrides);
  const windowLabel = formatWindowLabel(windowMs);

  return (
    <div
      className="rounded-lg p-3 transition-all"
      style={{ background: cfg.bg, border: `1px solid ${cfg.color}20` }}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="relative flex shrink-0">
          {channel.status === "healthy" && (
            <span
              className="absolute inset-0 rounded-full animate-ping"
              style={{ background: `${cfg.color}30`, animationDuration: "3s" }}
            />
          )}
          <span
            className="relative block w-2.5 h-2.5 rounded-full"
            style={{ background: cfg.color }}
          />
        </span>

        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-1.5">
            <span className="text-xs truncate" style={{ color: cn.text }}>
              {label}
            </span>
            <span className="text-[9px] font-mono opacity-40 truncate" style={{ color: cn.textSecondary }}>
              {channel.channelId}
            </span>
          </div>
        </div>

        <span
          className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] shrink-0"
          style={{ background: `${cfg.color}15`, color: cfg.color }}
        >
          <StatusIcon className="w-3 h-3" />
          {cfg.label}
        </span>
      </div>

      <div className="mb-1.5">
        <div
          className="w-full h-1.5 rounded-full overflow-hidden"
          style={{ background: `${cn.text}08` }}
        >
          <div
            className="h-full rounded-full transition-all duration-1000"
            style={{
              width: `${Math.min(100, progress * 100)}%`,
              background:
                progress < 0.5
                  ? "#5FB865"
                  : progress < 0.85
                  ? "#E8A838"
                  : "#EF4444",
            }}
          />
        </div>
      </div>

      <div className="mb-1.5">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className="text-[9px] opacity-40" style={{ color: cn.textSecondary }}>
            History ({windowLabel})
          </span>
        </div>
        <ChannelHealthSparkline
          channelId={channel.channelId}
          windowMs={windowMs}
          height={10}
          refreshMs={2_000}
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-[10px]" style={{ color: cn.textSecondary }}>
            <span className="opacity-50">Elapsed:</span>{" "}
            <span style={{ color: cfg.color }}>{elapsed}s</span>
          </span>
          <span className="text-[10px]" style={{ color: cn.textSecondary }}>
            <span className="opacity-50">Threshold:</span>{" "}
            {formatThreshold(channel.staleMs)}
          </span>
          {channel.consecutiveStaleChecks > 0 && (
            <span className="text-[10px]" style={{ color: "#E8A838" }}>
              {channel.consecutiveStaleChecks}x stale
            </span>
          )}
        </div>

        {channel.status === "dead" && (
          <button
            onClick={() => onReconnect(channel.channelId)}
            className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] transition-all hover:opacity-80"
            style={{ background: "#EF444420", color: "#EF4444" }}
          >
            <RefreshCw className="w-3 h-3" />
            Reconnect
          </button>
        )}
      </div>
    </div>
  );
}

interface ChannelHealthDashboardProps {
  compact?: boolean;
  className?: string;
  sparklineWindowOverrides?: Record<string, number>;
}

export function ChannelHealthDashboard({
  compact = false,
  className = "",
  sparklineWindowOverrides,
}: ChannelHealthDashboardProps) {
  const { t } = useTranslation("common");
  const [channels, setChannels] = useState<ChannelHeartbeatState[]>([]);
  const [aggregate, setAggregate] = useState<HeartbeatStatus>("healthy");

  useEffect(() => {
    const refresh = () => {
      setChannels(getChannelHeartbeats());
      setAggregate(getHeartbeatStatus());
    };

    refresh();

    const unsub = onHeartbeatStatusChange(() => refresh());
    const timer = setInterval(refresh, 1_000);

    return () => {
      unsub();
      clearInterval(timer);
    };
  }, []);

  const handleReconnect = useCallback((channelId: string) => {
    recordMessageReceived(channelId);
  }, []);

  const aggCfg = STATUS_COLORS[aggregate];
  const healthyCount = channels.filter((c) => c.status === "healthy").length;
  const staleCount = channels.filter((c) => c.status === "stale").length;
  const deadCount = channels.filter((c) => c.status === "dead").length;

  if (channels.length === 0) {
    return (
      <div
        className={`rounded-xl p-4 ${className}`}
        style={{ background: cn.bgCard, border: `1px solid ${cn.borderLight}` }}
      >
        {!compact && (
          <div className="flex items-center gap-2 mb-3">
            <Activity className="w-4 h-4" style={{ color: cn.textSecondary }} />
            <span className="text-sm" style={{ color: cn.text }}>Channel Health</span>
          </div>
        )}
        <div className="flex items-center justify-center py-6">
          <div className="text-center">
            <WifiOff className="w-8 h-8 mx-auto mb-2 opacity-20" style={{ color: cn.textSecondary }} />
            <p className="text-xs" style={{ color: cn.textSecondary }}>
              No active channels
            </p>
            <p className="text-[10px] mt-0.5 opacity-60" style={{ color: cn.textSecondary }}>
              Channels will appear when Realtime subscriptions are active
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`rounded-xl ${compact ? "p-3" : "p-4"} ${className}`}
      style={{ background: cn.bgCard, border: `1px solid ${cn.borderLight}` }}
    >
      {!compact && (
        <div className="flex items-center gap-2 mb-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: "linear-gradient(135deg, #DB869A, #5FB865)" }}
          >
            <Activity className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm" style={{ color: cn.text }}>Channel Health</h3>
            <p className="text-[10px]" style={{ color: cn.textSecondary }}>
              {channels.length} channel{channels.length !== 1 ? "s" : ""} monitored
            </p>
          </div>

          <span
            className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] shrink-0"
            style={{ background: aggCfg.bg, color: aggCfg.color }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: aggCfg.color }}
            />
            {aggCfg.label}
          </span>
        </div>
      )}

      <div
        className="flex items-center gap-3 mb-3 px-2 py-1.5 rounded-lg"
        style={{ background: `${cn.text}04` }}
      >
        <span className="flex items-center gap-1 text-[10px]" style={{ color: "#5FB865" }}>
          <Wifi className="w-3 h-3" />
          {healthyCount} healthy
        </span>
        {staleCount > 0 && (
          <span className="flex items-center gap-1 text-[10px]" style={{ color: "#E8A838" }}>
            <AlertTriangle className="w-3 h-3" />
            {staleCount} stale
          </span>
        )}
        {deadCount > 0 && (
          <span className="flex items-center gap-1 text-[10px]" style={{ color: "#EF4444" }}>
            <XCircle className="w-3 h-3" />
            {deadCount} dead
          </span>
        )}
      </div>

      <div className={compact ? "space-y-1.5" : "space-y-2"}>
        {channels.map((ch) => (
          <ChannelRow
            key={ch.channelId}
            channel={ch}
            onReconnect={handleReconnect}
            sparklineWindowOverrides={sparklineWindowOverrides}
          />
        ))}
      </div>
    </div>
  );
}