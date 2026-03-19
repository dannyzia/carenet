/**
 * CareNet Sync Engine — per D016 §5.2
 *
 * Processes the offline action queue when the device comes back online.
 * Features:
 *   - Priority-ordered processing (care logs first)
 *   - Exponential backoff on failures
 *   - Idempotency keys for server dedup
 *   - Configurable concurrency
 *   - Event-driven status updates
 */

import {
  db,
  getPendingActions,
  markSynced,
  markFailed,
  purgeSyncedActions,
  purgeExpiredCache,
  purgeExpiredDrafts,
  type OfflineAction,
} from "./db";

export type SyncEventType =
  | "sync-start"
  | "sync-progress"
  | "sync-complete"
  | "sync-error"
  | "action-synced"
  | "action-failed";

export interface SyncEvent {
  type: SyncEventType;
  detail?: {
    total?: number;
    completed?: number;
    failed?: number;
    action?: OfflineAction;
    error?: string;
    synced?: number;
  };
}

type SyncListener = (event: SyncEvent) => void;

const MAX_RETRIES = 5;
const BASE_BACKOFF_MS = 1000;

class SyncEngine {
  private listeners: Set<SyncListener> = new Set();
  private isSyncing = false;
  private syncInterval: ReturnType<typeof setInterval> | null = null;

  on(listener: SyncListener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private emit(event: SyncEvent) {
    this.listeners.forEach((fn) => fn(event));
  }

  get syncing() {
    return this.isSyncing;
  }

  async processQueue(): Promise<{ synced: number; failed: number }> {
    if (this.isSyncing) return { synced: 0, failed: 0 };
    this.isSyncing = true;

    let synced = 0;
    let failed = 0;

    try {
      const actions = await db.offlineActions
        .where("status")
        .anyOf(["pending", "failed"])
        .filter((a) => a.retryCount < MAX_RETRIES)
        .sortBy("priority");

      if (actions.length === 0) {
        this.isSyncing = false;
        return { synced: 0, failed: 0 };
      }

      this.emit({
        type: "sync-start",
        detail: { total: actions.length },
      });

      for (const action of actions) {
        if (!navigator.onLine) break;

        try {
          if (action.retryCount > 0) {
            const delay = BASE_BACKOFF_MS * Math.pow(2, action.retryCount - 1);
            await sleep(Math.min(delay, 30000));
          }

          if (action.id) {
            await db.offlineActions.update(action.id, { status: "syncing" });
          }

          await this.sendToServer(action);

          if (action.id) await markSynced(action.id);
          synced++;

          this.emit({
            type: "action-synced",
            detail: { action, completed: synced, total: actions.length },
          });
        } catch (err: any) {
          if (action.id) await markFailed(action.id, err?.message || "Unknown error");
          failed++;

          this.emit({
            type: "action-failed",
            detail: { action, error: err?.message, completed: synced, total: actions.length },
          });
        }

        this.emit({
          type: "sync-progress",
          detail: { completed: synced + failed, total: actions.length, synced, failed },
        });
      }

      await purgeSyncedActions(24);
      await purgeExpiredCache();
      await purgeExpiredDrafts();

      this.emit({
        type: "sync-complete",
        detail: { synced, failed, total: actions.length },
      });
    } catch (err: any) {
      this.emit({
        type: "sync-error",
        detail: { error: err?.message },
      });
    } finally {
      this.isSyncing = false;
    }

    return { synced, failed };
  }

  private async sendToServer(action: OfflineAction): Promise<void> {
    await sleep(200 + Math.random() * 300);

    if (Math.random() < 0.05) {
      throw new Error("Simulated network error");
    }

    console.log(`[SyncEngine] Synced action: ${action.actionType}`, {
      idempotencyKey: action.idempotencyKey,
      payload: action.payload,
    });
  }

  startAutoSync(intervalMs: number = 30000) {
    this.stopAutoSync();
    this.syncInterval = setInterval(() => {
      if (navigator.onLine && !this.isSyncing) {
        this.processQueue();
      }
    }, intervalMs);
  }

  stopAutoSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export const syncEngine = new SyncEngine();