/**
 * ConfirmDialog — Reusable confirmation modal for destructive/irreversible actions
 * Animated with Motion (fade-in backdrop + scale-up card)
 */
import { useEffect, useCallback, useRef, useId } from "react";

import { cn } from "@/frontend/theme/tokens";
import { AlertTriangle } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning" | "default";
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "warning",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const prefersReducedMotion = useReducedMotion();
  const instanceId = useId();
  const titleId = `confirm-dialog-title-${instanceId}`;
  const descId = `confirm-dialog-desc-${instanceId}`;
  const confirmBtnRef = useRef<HTMLButtonElement>(null);
  const cancelBtnRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<Element | null>(null);

  // Keyboard: Escape → cancel, Enter → confirm, Tab → trap focus
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === "Escape") {
        e.preventDefault();
        onCancel();
      } else if (e.key === "Enter") {
        e.preventDefault();
        onConfirm();
      } else if (e.key === "Tab") {
        // Trap focus between cancel and confirm buttons
        const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable || focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    },
    [open, onCancel, onConfirm]
  );

  useEffect(() => {
    if (open) {
      // Save the previously focused element for restoration
      previousFocusRef.current = document.activeElement;

      document.addEventListener("keydown", handleKeyDown);
      // Focus confirm button for screen readers
      requestAnimationFrame(() => confirmBtnRef.current?.focus());
      // Set inert on all sibling content behind the backdrop
      const root = document.getElementById("root");
      if (root) root.setAttribute("inert", "");
      return () => {
        document.removeEventListener("keydown", handleKeyDown);
        if (root) root.removeAttribute("inert");
        // Restore focus to the element that was focused before the dialog opened
        if (previousFocusRef.current instanceof HTMLElement) {
          requestAnimationFrame(() =>
            (previousFocusRef.current as HTMLElement).focus()
          );
        }
      };
    }
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, handleKeyDown]);

  const confirmBg =
    variant === "danger"
      ? "#EF4444"
      : variant === "warning"
        ? cn.amber
        : cn.teal;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.4)" }}
          onClick={onCancel}
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={prefersReducedMotion ? undefined : { opacity: 0 }}
          transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.15 }}
        >
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={descId}
            className="w-full max-w-sm rounded-2xl p-6 space-y-4 shadow-xl"
            style={{ background: cn.bgCard }}
            onClick={(e) => e.stopPropagation()}
            initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.9, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0, scale: 0.95, y: 4 }}
            transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-start gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{
                  background:
                    variant === "danger"
                      ? "rgba(239,68,68,0.12)"
                      : cn.amberBg,
                }}
              >
                <AlertTriangle
                  className="w-5 h-5"
                  style={{
                    color: variant === "danger" ? "#EF4444" : cn.amber,
                  }}
                />
              </div>
              <div>
                <h3 id={titleId} className="text-sm" style={{ color: cn.text }}>
                  {title}
                </h3>
                <p id={descId} className="text-xs mt-1" style={{ color: cn.textSecondary }}>
                  {description}
                </p>
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <button
                onClick={onCancel}
                ref={cancelBtnRef}
                className="px-4 py-2 rounded-xl border text-sm cn-touch-target"
                style={{ borderColor: cn.border, color: cn.textSecondary }}
              >
                {cancelLabel}
              </button>
              <button
                onClick={onConfirm}
                ref={confirmBtnRef}
                className="px-4 py-2 rounded-xl text-sm text-white cn-touch-target"
                style={{ background: confirmBg }}
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}