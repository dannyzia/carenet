/**
 * ChannelHealthSparkline — Tiny SVG timeline of channel health transitions
 */

import { useState, useEffect, useMemo } from "react";
import {
  getChannelHistory,
  type ChannelStatusEntry,
  type HeartbeatStatus,
} from "@/backend/services/realtime";

const STATUS_COLOR: Record<HeartbeatStatus, string> = {
  healthy: "#5FB865",
  stale: "#E8A838",
  dead: "#EF4444",
};

interface ChannelHealthSparklineProps {
  channelId: string;
  windowMs?: number;
  width?: number | string;
  height?: number;
  rx?: number;
  refreshMs?: number;
  className?: string;
}

function buildSegments(
  history: ChannelStatusEntry[],
  windowStart: number,
  now: number,
): Array<{ start: number; end: number; status: HeartbeatStatus }> {
  if (history.length === 0) return [];

  const segments: Array<{ start: number; end: number; status: HeartbeatStatus }> = [];

  for (let i = 0; i < history.length; i++) {
    const entry = history[i];
    const nextTs = i < history.length - 1 ? history[i + 1].ts : now;

    const segStart = Math.max(entry.ts, windowStart);
    const segEnd = Math.min(nextTs, now);

    if (segEnd <= segStart) continue;

    segments.push({ start: segStart, end: segEnd, status: entry.status });
  }

  return segments;
}

export function ChannelHealthSparkline({
  channelId,
  windowMs = 120_000,
  width = "100%",
  height = 12,
  rx = 1.5,
  refreshMs = 2_000,
  className = "",
}: ChannelHealthSparklineProps) {
  const [history, setHistory] = useState<ChannelStatusEntry[]>([]);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const tick = () => {
      setHistory(getChannelHistory(channelId));
      setNow(Date.now());
    };
    tick();
    const timer = setInterval(tick, refreshMs);
    return () => clearInterval(timer);
  }, [channelId, refreshMs]);

  const windowStart = now - windowMs;

  const segments = useMemo(() => {
    let startIdx = 0;
    for (let i = history.length - 1; i >= 0; i--) {
      if (history[i].ts <= windowStart) {
        startIdx = i;
        break;
      }
    }
    const visible = history.slice(startIdx);
    return buildSegments(visible, windowStart, now);
  }, [history, windowStart, now]);

  if (segments.length === 0) {
    return (
      <svg
        width={width}
        height={height}
        className={className}
        role="img"
        aria-label="No channel health history"
        data-testid={`sparkline-${channelId}`}
      >
        <rect
          x={0}
          y={0}
          width="100%"
          height={height}
          rx={rx}
          fill="currentColor"
          opacity={0.06}
        />
      </svg>
    );
  }

  const totalMs = now - windowStart;

  return (
    <svg
      width={width}
      height={height}
      className={className}
      role="img"
      aria-label={`Channel health history for ${channelId}`}
      data-testid={`sparkline-${channelId}`}
      style={{ display: "block" }}
    >
      <rect
        x={0}
        y={0}
        width="100%"
        height={height}
        rx={rx}
        fill="currentColor"
        opacity={0.04}
      />
      {segments.map((seg, i) => {
        const xPct = ((seg.start - windowStart) / totalMs) * 100;
        const wPct = ((seg.end - seg.start) / totalMs) * 100;
        const isFirst = i === 0;
        const isLast = i === segments.length - 1;
        return (
          <rect
            key={`${seg.start}-${seg.status}`}
            x={`${xPct}%`}
            y={0}
            width={`${Math.max(wPct, 0.5)}%`}
            height={height}
            rx={isFirst || isLast ? rx : 0}
            fill={STATUS_COLOR[seg.status]}
            opacity={0.85}
          >
            <title>
              {seg.status} ({Math.round((seg.end - seg.start) / 1000)}s)
            </title>
          </rect>
        );
      })}
      {segments.slice(1).map((seg, i) => {
        const prevSeg = segments[i];
        if (prevSeg.status === seg.status) return null;
        const xPct = ((seg.start - windowStart) / totalMs) * 100;
        return (
          <line
            key={`marker-${seg.start}`}
            x1={`${xPct}%`}
            y1={0}
            x2={`${xPct}%`}
            y2={height}
            stroke="white"
            strokeWidth={1}
            opacity={0.6}
          />
        );
      })}
    </svg>
  );
}