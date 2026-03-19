import { useState, useEffect } from "react";
import { cn } from "@/frontend/theme/tokens";
import { useTranslation } from "react-i18next";
import { useOnlineStatus } from "@/backend/offline/useOnlineStatus";
import { useSyncQueue } from "@/backend/offline/useSyncQueue";
import { CheckCircle2, WifiOff, RefreshCw, AlertTriangle, CloudOff } from "lucide-react";

/**
 * OfflineIndicator — per D016 §7.1
 *
 * Displays connection status:
 *   - Hidden when online with nothing to sync
 *   - Amber banner when offline
 *   - Sync animation when syncing
 *   - Green flash when sync completes
 *   - Red badge for failed actions
 *
 * i18n keys: connectivity.offline.*
 */
export function OfflineIndicator() {
  const { t } = useTranslation("common");
  const { isOnline } = useOnlineStatus();
  const { pendingCount, failedCount, isSyncing, lastSyncResult, triggerSync } = useSyncQueue();
  const [showSyncDone, setShowSyncDone] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // Show "sync complete" flash for 3 seconds
  useEffect(() => {
    if (lastSyncResult && lastSyncResult.synced > 0) {
      setShowSyncDone(true);
      const timer = setTimeout(() => setShowSyncDone(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [lastSyncResult]);

  // Reset dismissed when going offline
  useEffect(() => {
    if (!isOnline) setDismissed(false);
  }, [isOnline]);

  // Nothing to show
  if (isOnline && pendingCount === 0 && failedCount === 0 && !isSyncing && !showSyncDone) {
    return null;
  }

  // Sync complete flash
  if (showSyncDone && isOnline && pendingCount === 0) {
    return (
      <div
        className="flex items-center gap-2 px-4 py-2 text-sm transition-all"
        style={{ background: cn.greenBg, color: cn.green }}
      >
        <CheckCircle2 className="w-4 h-4 shrink-0" />
        <span>
          {t("connectivity.offline.syncedSuccess", { count: lastSyncResult?.synced || 0 })}
        </span>
      </div>
    );
  }

  // Offline banner
  if (!isOnline) {
    return (
      <div
        className="flex items-center justify-between px-4 py-2.5 text-sm"
        style={{ background: cn.amberBg, color: cn.amber }}
      >
        <div className="flex items-center gap-2">
          <WifiOff className="w-4 h-4 shrink-0" />
          <span>
            {t("connectivity.offline.youreOffline")}
            {pendingCount > 0 && (
              <> &bull; {t("connectivity.offline.pendingChanges", { count: pendingCount })}</>
            )}
          </span>
        </div>
        {pendingCount > 0 && (
          <span
            className="px-2 py-0.5 rounded-full text-xs"
            style={{ background: "rgba(245,158,11,0.2)" }}
          >
            {t("connectivity.offline.queued", { count: pendingCount })}
          </span>
        )}
      </div>
    );
  }

  // Syncing in progress
  if (isSyncing) {
    return (
      <div
        className="flex items-center gap-2 px-4 py-2 text-sm"
        style={{ background: cn.blueBg, color: cn.blue }}
      >
        <RefreshCw className="w-4 h-4 shrink-0 animate-spin" />
        <span>{t("connectivity.offline.syncingItems", { count: pendingCount })}</span>
      </div>
    );
  }

  // Pending / failed items while online
  if (pendingCount > 0 || failedCount > 0) {
    if (dismissed) return null;

    return (
      <div
        className="flex items-center justify-between px-4 py-2 text-sm"
        style={{
          background: failedCount > 0 ? "rgba(239,68,68,0.06)" : cn.amberBg,
          color: failedCount > 0 ? "#EF4444" : cn.amber,
        }}
      >
        <div className="flex items-center gap-2">
          {failedCount > 0 ? (
            <AlertTriangle className="w-4 h-4 shrink-0" />
          ) : (
            <CloudOff className="w-4 h-4 shrink-0" />
          )}
          <span>
            {failedCount > 0
              ? t("connectivity.offline.syncFailure", { count: failedCount })
              : t("connectivity.offline.waitingToSync", { count: pendingCount })}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={triggerSync}
            className="px-2.5 py-1 rounded-lg text-xs cn-touch-target"
            style={{
              background: failedCount > 0 ? "rgba(239,68,68,0.1)" : "rgba(245,158,11,0.15)",
            }}
          >
            {t("connectivity.offline.retry")}
          </button>
          <button
            onClick={() => setDismissed(true)}
            className="text-xs opacity-60 hover:opacity-100 cn-touch-target"
          >
            {t("connectivity.offline.dismiss")}
          </button>
        </div>
      </div>
    );
  }

  return null;
}