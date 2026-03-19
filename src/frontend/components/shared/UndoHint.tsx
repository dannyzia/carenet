/**
 * UndoHint — Subtle "Ctrl+Z to undo" tooltip shown on desktop
 * after optimistic actions. Fades out after 2s.
 *
 * Respects prefers-reduced-motion: skips fade animation, shows/hides instantly.
 */
import { useReducedMotion } from "motion/react";

interface UndoHintProps {
  visible: boolean;
  label?: string;
}

export function UndoHint({ visible, label }: UndoHintProps) {
  const reducedMotion = useReducedMotion();

  // Don't render on touch devices (the hook already gates visibility,
  // but this is a safety net for SSR / edge cases)
  if (!visible) return null;

  const isMac = typeof navigator !== "undefined" && /Mac|iPod|iPhone|iPad/.test(navigator.platform);
  const shortcut = isMac ? "⌘Z" : "Ctrl+Z";

  return (
    <div
      className="fixed bottom-20 left-1/2 z-50 -translate-x-1/2 pointer-events-none"
      style={{
        animation: reducedMotion ? "none" : "cn-undo-hint-fade 2s ease-in-out forwards",
      }}
    >
      <div
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs"
        style={{
          background: "rgba(0,0,0,0.75)",
          color: "#fff",
          backdropFilter: "blur(8px)",
        }}
      >
        <kbd
          className="px-1.5 py-0.5 rounded text-[10px]"
          style={{ background: "rgba(255,255,255,0.15)", fontFamily: "monospace" }}
        >
          {shortcut}
        </kbd>
        <span>to undo{label ? ` ${label}` : ""}</span>
      </div>
    </div>
  );
}
