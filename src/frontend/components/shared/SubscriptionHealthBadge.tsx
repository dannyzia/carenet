/**
 * SubscriptionHealthBadge
 * ───────────────────────
 * Displays the real-time heartbeat health for a specific Realtime channel.
 */

import { useTranslation } from "react-i18next";
import { useChannelHealthSummary } from "@/frontend/hooks/useChannelHealth";
import type { HeartbeatStatus } from "@/backend/services/realtime";
import { cn } from "@/frontend/theme/tokens";

const STATUS_CONFIG: Record<HeartbeatStatus, { color: string; bg: string }> = {
  healthy: { color: "#5FB865", bg: "#7CE57715" },
  stale:   { color: "#E8A838", bg: "#FFB54D15" },
  dead:    { color: "#EF4444", bg: "#EF444415" },
};

interface Props {
  channelId: string;
  showThreshold?: boolean;
  compact?: boolean;
  className?: string;
}

export function SubscriptionHealthBadge({
  channelId,
  showThreshold = false,
  compact = false,
  className = "",
}: Props) {
  const { t } = useTranslation("common");
  const { state, isTracked, status, elapsedSec, thresholdLabel } = useChannelHealthSummary(channelId);

  if (!isTracked || !state) return null;

  const cfg = STATUS_CONFIG[state.status];

  // Short labels for compact badge (full copy lives under connectivity.heartbeat.* elsewhere).
  const statusLabel = state.status === "healthy"
    ? t("connectivity.subscriptionBadge.healthy", { defaultValue: "Live" })
    : state.status === "stale"
    ? t("connectivity.subscriptionBadge.stale", { defaultValue: "Checking..." })
    : t("connectivity.subscriptionBadge.lost", { defaultValue: "Disconnected" });

  if (compact) {
    return (
      <span
        className={`relative inline-block group ${className}`}
        title={`${state.status} \u00B7 ${elapsedSec}s ago`}
      >
        {state.status === "healthy" && (
          <span
            className="absolute inset-0 rounded-full animate-ping"
            style={{ background: `${cfg.color}40`, animationDuration: "3s" }}
          />
        )}
        <span
          className="relative block w-2 h-2 rounded-full"
          style={{ background: cfg.color }}
        />
      </span>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full ${className}`}
      style={{ background: cfg.bg }}
    >
      <span
        className="relative block w-1.5 h-1.5 rounded-full shrink-0"
        style={{ background: cfg.color }}
      />
      <span className="text-[10px]" style={{ color: cfg.color }}>
        {statusLabel}
      </span>
      {showThreshold && (
        <span className="text-[9px] opacity-50" style={{ color: cn.textSecondary }}>
          ({thresholdLabel})
        </span>
      )}
      {state.status !== "healthy" && (
        <span className="text-[9px] opacity-50" style={{ color: cn.textSecondary }}>
          {elapsedSec}s
        </span>
      )}
    </div>
  );
}