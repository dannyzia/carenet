/**
 * RealtimeStatusIndicator
 * ───────────────────────
 * Renders a small colored indicator for Realtime subscription health.
 */

import { useState, useEffect } from "react";
import { Wifi, WifiOff } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  onConnectionStatusChange,
  onHeartbeatStatusChange,
  type ConnectionStatus,
  type HeartbeatStatus,
} from "@/backend/services/realtime";
import { USE_SUPABASE } from "@/backend/services/supabase";
import { getCurrentProbeInterval } from "@/backend/utils/onlineState";
import { cn } from "@/frontend/theme/tokens";

const STATUS_COLORS: Record<ConnectionStatus, { color: string; pulseColor: string }> = {
  connected: { color: "#5FB865", pulseColor: "#5FB86550" },
  connecting: { color: "#E8A838", pulseColor: "#E8A83850" },
  disconnected: { color: "#EF4444", pulseColor: "#EF444450" },
};

function useStatusLabels() {
  const { t } = useTranslation("common");
  return {
    connected: {
      label: t("connectivity.realtime.connected"),
      sublabel: USE_SUPABASE
        ? t("connectivity.realtime.sublabelSupabase")
        : t("connectivity.realtime.sublabelMock"),
    },
    connecting: {
      label: t("connectivity.realtime.connecting"),
      sublabel: t("connectivity.realtime.sublabelEstablishing"),
    },
    disconnected: {
      label: t("connectivity.realtime.disconnected"),
      sublabel: t("connectivity.realtime.sublabelNoSubs"),
    },
  };
}

interface Props {
  variant?: "dot" | "badge" | "full";
  className?: string;
}

export function RealtimeStatusIndicator({
  variant = "dot",
  className = "",
}: Props) {
  const [status, setStatus] = useState<ConnectionStatus>("connecting");
  const [heartbeat, setHeartbeat] = useState<HeartbeatStatus>("healthy");
  const labels = useStatusLabels();
  const { t } = useTranslation("common");

  const [probeIntervalMs, setProbeIntervalMs] = useState(() => getCurrentProbeInterval());

  useEffect(() => {
    const unsub = onConnectionStatusChange(setStatus);
    return unsub;
  }, []);

  useEffect(() => {
    const unsub = onHeartbeatStatusChange(setHeartbeat);
    return unsub;
  }, []);

  useEffect(() => {
    if (variant !== "full") return;
    const timer = setInterval(() => {
      setProbeIntervalMs(getCurrentProbeInterval());
    }, 3_000);
    return () => clearInterval(timer);
  }, [variant]);

  const colors = STATUS_COLORS[status];
  const lbl = labels[status];
  const baseIntervalMs = 30_000;
  const probeInBackoff = probeIntervalMs > baseIntervalMs;

  if (variant === "dot") {
    return (
      <div className={`relative group ${className}`} title={`${lbl.label} \u00B7 ${lbl.sublabel}`}>
        {status === "connected" && (
          <span
            className="absolute inset-0 rounded-full animate-ping"
            style={{ background: colors.pulseColor, animationDuration: "3s" }}
          />
        )}
        <span
          className="relative block w-2.5 h-2.5 rounded-full"
          style={{ background: colors.color }}
        />
        <div
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 rounded-lg text-[11px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50"
          style={{ background: cn.text, color: cn.bgCard }}
        >
          {lbl.label}
          <span className="opacity-60"> &middot; {lbl.sublabel}</span>
        </div>
      </div>
    );
  }

  if (variant === "badge") {
    return (
      <div
        className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] ${className}`}
        style={{ background: `${colors.color}15`, color: colors.color }}
        title={lbl.sublabel}
      >
        <span
          className="block w-1.5 h-1.5 rounded-full shrink-0"
          style={{ background: colors.color }}
        />
        {lbl.label}
      </div>
    );
  }

  return (
    <div
      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs ${className}`}
      style={{ background: `${colors.color}10` }}
    >
      <div className="relative shrink-0">
        {status === "connected" && (
          <span
            className="absolute inset-0 rounded-full animate-ping"
            style={{ background: colors.pulseColor, animationDuration: "3s" }}
          />
        )}
        {status === "disconnected" ? (
          <WifiOff className="w-4 h-4 relative" style={{ color: colors.color }} />
        ) : (
          <Wifi className="w-4 h-4 relative" style={{ color: colors.color }} />
        )}
      </div>
      <div className="min-w-0">
        <p style={{ color: colors.color }}>{lbl.label}</p>
        <p className="truncate" style={{ color: cn.textSecondary }}>
          {lbl.sublabel}
          {heartbeat === "stale" && status === "connected" && (
            <span style={{ color: "#E8A838" }}>
              {" "}&middot; {t("connectivity.heartbeat.stale", { defaultValue: "Channel inactive \u2014 checking..." })}
            </span>
          )}
          {heartbeat === "dead" && (
            <span style={{ color: "#EF4444" }}>
              {" "}&middot; {t("connectivity.heartbeat.lost", { defaultValue: "Realtime channel lost" })}
            </span>
          )}
          {probeInBackoff && (
            <span style={{ color: "#E8A838" }}>
              {" "}&middot; {t("connectivity.realtime.probeBackoff", {
                interval: probeIntervalMs >= 60_000
                  ? `${Math.round(probeIntervalMs / 60_000)}m`
                  : `${Math.round(probeIntervalMs / 1_000)}s`,
              })}
            </span>
          )}
        </p>
      </div>
    </div>
  );
}