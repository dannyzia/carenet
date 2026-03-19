import { useState, useEffect, useCallback } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db, queueOfflineAction, type ActionPriority } from "./db";
import { syncEngine, type SyncEvent } from "./syncEngine";
import { useOnlineStatus } from "./useOnlineStatus";

/**
 * useSyncQueue — per D016 §5
 *
 * Provides:
 *   - pendingCount: number of unsynced actions
 *   - isSyncing: whether sync is in progress
 *   - lastSyncResult: result of last sync attempt
 *   - queueAction: function to add a new offline action
 *   - triggerSync: manually trigger sync processing
 */

export interface SyncQueueState {
  pendingCount: number;
  failedCount: number;
  isSyncing: boolean;
  lastSyncResult: { synced: number; failed: number } | null;
  queueAction: (
    actionType: string,
    payload: Record<string, any>,
    userId: string,
    priority?: ActionPriority
  ) => Promise<number>;
  triggerSync: () => void;
}

export function useSyncQueue(): SyncQueueState {
  const { isOnline } = useOnlineStatus();
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncResult, setLastSyncResult] = useState<{
    synced: number;
    failed: number;
  } | null>(null);

  const pendingCount =
    useLiveQuery(() =>
      db.offlineActions.where("status").anyOf(["pending"]).count()
    ) ?? 0;

  const failedCount =
    useLiveQuery(() =>
      db.offlineActions.where("status").equals("failed").count()
    ) ?? 0;

  useEffect(() => {
    const unsub = syncEngine.on((event: SyncEvent) => {
      switch (event.type) {
        case "sync-start":
          setIsSyncing(true);
          break;
        case "sync-complete":
          setIsSyncing(false);
          if (event.detail) {
            setLastSyncResult({
              synced: event.detail.synced || 0,
              failed: event.detail.failed || 0,
            });
          }
          break;
        case "sync-error":
          setIsSyncing(false);
          break;
      }
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (isOnline && pendingCount > 0 && !isSyncing) {
      const timer = setTimeout(() => syncEngine.processQueue(), 2000);
      return () => clearTimeout(timer);
    }
  }, [isOnline, pendingCount, isSyncing]);

  useEffect(() => {
    syncEngine.startAutoSync(30000);
    return () => syncEngine.stopAutoSync();
  }, []);

  const queueAction = useCallback(
    async (
      actionType: string,
      payload: Record<string, any>,
      userId: string,
      priority: ActionPriority = 3
    ) => {
      return queueOfflineAction(actionType, payload, userId, priority);
    },
    []
  );

  const triggerSync = useCallback(() => {
    if (isOnline) {
      syncEngine.processQueue();
    }
  }, [isOnline]);

  return {
    pendingCount,
    failedCount,
    isSyncing,
    lastSyncResult,
    queueAction,
    triggerSync,
  };
}
