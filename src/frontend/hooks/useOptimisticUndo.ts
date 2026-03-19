/**
 * useOptimisticUndo — Ctrl+Z keyboard shortcut + visual toast "Undo" button.
 *
 * Provides a stack-based undo system: when an optimistic action is performed,
 * push a rollback callback. The user can undo via:
 *   1. Ctrl+Z / Cmd+Z keyboard shortcut (desktop)
 *   2. Clicking the "Undo" button in the success toast (mobile-friendly)
 *
 * The entry auto-expires after the undo window (default 5s) when
 * server reconciliation is assumed complete.
 *
 * The hook provides `successWithUndo()` — a convenience that fires a success
 * toast with an embedded "Undo" action button AND registers the undo entry.
 */

import { useRef, useEffect, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAriaToast } from "./useAriaToast";

export interface UndoEntry {
  /** Human-readable label, e.g. "offer submission" */
  label: string;
  /** Callback to roll back the optimistic state */
  rollback: () => void;
  /** Timestamp when pushed */
  pushedAt: number;
  /** Timer ID for auto-expiry */
  timerId: ReturnType<typeof setTimeout>;
}

const UNDO_WINDOW_MS = 5000;

/** Detect prefers-reduced-motion at module level */
function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Global undo stack shared across all hook instances.
 * Kept outside React state so keyboard handlers see current values
 * without stale closure issues.
 */
const undoStack: UndoEntry[] = [];
const stackChangeListeners = new Set<() => void>();

function notifyStackChange() {
  stackChangeListeners.forEach((fn) => fn());
}

/** Execute undo for a specific entry and remove from stack. */
function executeUndo(entry: UndoEntry): boolean {
  clearTimeout(entry.timerId);
  const idx = undoStack.indexOf(entry);
  if (idx < 0) return false; // Already consumed or expired
  undoStack.splice(idx, 1);
  try {
    entry.rollback();
    notifyStackChange();
    return true;
  } catch {
    notifyStackChange();
    return false;
  }
}

export function useOptimisticUndo() {
  const { t } = useTranslation("common");
  const toast = useAriaToast();
  const mountedRef = useRef(true);
  const [undoHint, setUndoHint] = useState<{ visible: boolean; label: string }>({ visible: false, label: "" });
  const hintTimerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // ─── Keyboard listener (Ctrl+Z / Cmd+Z) ───
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
        // Don't intercept if user is typing in an input/textarea
        const tag = (e.target as HTMLElement)?.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA" || (e.target as HTMLElement)?.isContentEditable) {
          return;
        }

        if (undoStack.length === 0) return;

        e.preventDefault();
        e.stopPropagation();

        const entry = undoStack[undoStack.length - 1];
        const ok = executeUndo(entry);
        if (ok) {
          toast.info(t("undo.actionUndone", { action: entry.label }));
        } else {
          toast.error(t("undo.undoFailed"));
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown, true);
    return () => document.removeEventListener("keydown", handleKeyDown, true);
  }, [t, toast]);

  // ─── Desktop Ctrl+Z hint (fades out after 2s) ───
  const showUndoHint = useCallback((label: string) => {
    // Only show on non-touch devices (desktop)
    if (typeof window !== "undefined" && "ontouchstart" in window) return;
    if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
    setUndoHint({ visible: true, label });
    hintTimerRef.current = setTimeout(() => {
      setUndoHint({ visible: false, label: "" });
    }, 2000);
  }, []);

  // ─── Push an undoable action (raw — no toast) ───
  const pushUndo = useCallback(
    (label: string, rollback: () => void, windowMs = UNDO_WINDOW_MS) => {
      const timerId = setTimeout(() => {
        const idx = undoStack.findIndex((e) => e.timerId === timerId);
        if (idx >= 0) undoStack.splice(idx, 1);
        notifyStackChange();
      }, windowMs);

      const entry: UndoEntry = {
        label,
        rollback,
        pushedAt: Date.now(),
        timerId,
      };

      undoStack.push(entry);
      notifyStackChange();

      // Show desktop "Ctrl+Z to undo" hint (non-touch devices only)
      showUndoHint(label);

      return () => {
        clearTimeout(timerId);
        const idx = undoStack.indexOf(entry);
        if (idx >= 0) undoStack.splice(idx, 1);
        notifyStackChange();
      };
    },
    [showUndoHint]
  );

  // ─── Success toast with embedded "Undo" action button ───
  const successWithUndo = useCallback(
    (
      message: string,
      undoLabel: string,
      rollback: () => void,
      opts?: { description?: string; windowMs?: number }
    ) => {
      const windowMs = opts?.windowMs ?? UNDO_WINDOW_MS;
      const reducedMotion = prefersReducedMotion();

      const timerId = setTimeout(() => {
        const idx = undoStack.findIndex((e) => e.timerId === timerId);
        if (idx >= 0) undoStack.splice(idx, 1);
        notifyStackChange();
      }, windowMs);

      const entry: UndoEntry = {
        label: undoLabel,
        rollback,
        pushedAt: Date.now(),
        timerId,
      };

      undoStack.push(entry);
      notifyStackChange();

      // Show desktop hint
      showUndoHint(undoLabel);

      // Fire the success toast with an "Undo" action button
      // When prefers-reduced-motion is active, use instant duration (no animation)
      toast.success(message, {
        description: opts?.description,
        duration: reducedMotion ? windowMs : windowMs,
        // Sonner respects className for CSS-driven animation overrides
        className: reducedMotion ? "cn-toast-no-motion" : undefined,
        action: {
          label: t("undo.undoButton", "Undo"),
          onClick: () => {
            const ok = executeUndo(entry);
            if (ok) {
              toast.info(t("undo.actionUndone", { action: undoLabel }));
            } else {
              toast.error(t("undo.undoFailed"));
            }
          },
        },
      });
    },
    [t, toast, showUndoHint]
  );

  // ─── Clear all entries (e.g. on page navigation) ───
  const clearUndo = useCallback(() => {
    while (undoStack.length > 0) {
      const entry = undoStack.pop()!;
      clearTimeout(entry.timerId);
    }
    notifyStackChange();
  }, []);

  return { pushUndo, successWithUndo, clearUndo, hasUndo: undoStack.length > 0, undoHint };
}