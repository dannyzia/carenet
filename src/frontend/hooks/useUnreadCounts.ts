import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { messageService } from "@/backend/services/message.service";
import { notificationService } from "@/backend/services/notification.service";
import type { Role } from "@/frontend/theme/tokens";
import { USE_SUPABASE, getSupabaseClient } from "@/backend/services/supabase";
import {
  _registerChannel,
  _unregisterChannel,
  CHANNEL_STALE_PRESETS,
} from "@/backend/services/realtime";

export interface UnreadCounts {
  messages: number;
  notifications: number;
  /** Optimistically decrement the message badge when a conversation is opened. */
  decrementMessages: (by: number) => void;
  /** Optimistically decrement the notification badge. */
  decrementNotifications: (by: number) => void;
  /** Force a full refresh from services. */
  refresh: () => void;
}

/**
 * useUnreadCounts — fetches total unread message + notification counts.
 *
 * Mock mode:  polls every 30s.
 * Supabase mode:  initial fetch + Realtime subscriptions on
 *   `chat_messages` (INSERT) and `notifications` (INSERT / UPDATE)
 *   for instant badge updates — debounced at 500ms to coalesce bursts —
 *   with a 60s background poll as fallback.
 *   The channel is registered with the heartbeat monitor for health tracking.
 */
export function useUnreadCounts(role: Role): UnreadCounts {
  const [counts, setCounts] = useState<{ messages: number; notifications: number }>({
    messages: 0,
    notifications: 0,
  });
  const mountedRef = useRef(true);

  // ─── Full refresh from services ─────────────────────────────
  const refresh = useCallback(async () => {
    try {
      const [conversations, notifications] = await Promise.all([
        messageService.getConversations(role),
        notificationService.getNotifications(),
      ]);
      const unreadMessages = conversations.reduce((sum, c) => sum + (c.unread || 0), 0);
      const unreadNotifications = notifications.filter((n) => !n.read).length;
      if (mountedRef.current) {
        setCounts({ messages: unreadMessages, notifications: unreadNotifications });
      }
    } catch {
      // Silently fail — keep previous counts
    }
  }, [role]);

  // ─── Debounced refresh (500ms) for Realtime events ──────────
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const debouncedRefresh = useCallback(() => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => {
      debounceTimerRef.current = null;
      refresh();
    }, 500);
  }, [refresh]);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, []);

  // ─── Initial fetch + background polling ─────────────────────
  useEffect(() => {
    mountedRef.current = true;
    refresh();
    const pollInterval = USE_SUPABASE ? 60_000 : 30_000;
    const interval = setInterval(refresh, pollInterval);
    return () => {
      mountedRef.current = false;
      clearInterval(interval);
    };
  }, [refresh]);

  // ─── Supabase Realtime subscriptions ────────────────────────
  useEffect(() => {
    if (!USE_SUPABASE) return;

    let cancelled = false;
    let cleanup: (() => void) | undefined;

    (async () => {
      try {
        const sb = getSupabaseClient();
        const { data: { user } } = await sb.auth.getUser();
        if (!user || cancelled) return;

        const userId = user.id;
        const channelName = `unread-badges:${userId}`;

        const channel = sb.channel(channelName)
          .on("postgres_changes", {
            event: "INSERT",
            schema: "public",
            table: "chat_messages",
          }, (payload) => {
            if (payload.new && (payload.new as any).sender_id !== userId) {
              debouncedRefresh();
            }
          })
          .on("postgres_changes", {
            event: "INSERT",
            schema: "public",
            table: "notifications",
            filter: `receiver_id=eq.${userId}`,
          }, () => {
            debouncedRefresh();
          })
          .on("postgres_changes", {
            event: "UPDATE",
            schema: "public",
            table: "notifications",
            filter: `receiver_id=eq.${userId}`,
          }, () => {
            debouncedRefresh();
          })
          .subscribe();

        // Register with heartbeat monitor for channel health tracking
        _registerChannel(channelName, CHANNEL_STALE_PRESETS.default);

        cleanup = () => {
          sb.removeChannel(channel);
          _unregisterChannel(channelName);
        };
      } catch {
        // Auth not ready or Realtime unavailable — polling is the fallback
      }
    })();

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [role, debouncedRefresh]);

  // ─── Optimistic decrements ──────────────────────────────────
  const decrementMessages = useCallback((by: number) => {
    setCounts((prev) => ({
      ...prev,
      messages: Math.max(0, prev.messages - by),
    }));
  }, []);

  const decrementNotifications = useCallback((by: number) => {
    setCounts((prev) => ({
      ...prev,
      notifications: Math.max(0, prev.notifications - by),
    }));
  }, []);

  return useMemo(
    () => ({ ...counts, decrementMessages, decrementNotifications, refresh }),
    [counts, decrementMessages, decrementNotifications, refresh],
  );
}
