import { useState, useEffect } from "react";
import { isOnline as getOnline, onOnlineChange, getConnectionType } from "@/backend/utils/onlineState";

/**
 * useOnlineStatus — per D016 §7
 *
 * Tracks device connectivity using the shared onlineState singleton.
 */

export interface OnlineStatus {
  isOnline: boolean;
  connectionType: string;
  lastOnlineAt: string | null;
}

export function useOnlineStatus(): OnlineStatus {
  const [isOnline, setIsOnline] = useState(getOnline);
  const [connectionType, setConnectionType] = useState(getConnectionType);
  const [lastOnlineAt, setLastOnlineAt] = useState<string | null>(
    getOnline() ? new Date().toISOString() : null
  );

  useEffect(() => {
    const unsub = onOnlineChange((online) => {
      setIsOnline(online);
      setConnectionType(getConnectionType());
      if (online) {
        setLastOnlineAt(new Date().toISOString());
      }
    });

    return unsub;
  }, []);

  return { isOnline, connectionType, lastOnlineAt };
}