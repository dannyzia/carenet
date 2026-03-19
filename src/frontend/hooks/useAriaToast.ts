/**
 * useAriaToast — wraps sonner's toast with an ARIA live-region announcement
 * so screen readers announce bid action results.
 *
 * Creates a visually-hidden aria-live="polite" region on mount and injects
 * text into it whenever a toast fires, then clears after a delay.
 */
import { useRef, useEffect, useCallback } from "react";
import { toast as sonnerToast } from "sonner";

let liveRegion: HTMLDivElement | null = null;

function ensureLiveRegion(): HTMLDivElement {
  if (liveRegion && document.body.contains(liveRegion)) return liveRegion;
  liveRegion = document.createElement("div");
  liveRegion.setAttribute("role", "status");
  liveRegion.setAttribute("aria-live", "polite");
  liveRegion.setAttribute("aria-atomic", "true");
  Object.assign(liveRegion.style, {
    position: "absolute",
    width: "1px",
    height: "1px",
    padding: "0",
    margin: "-1px",
    overflow: "hidden",
    clip: "rect(0,0,0,0)",
    whiteSpace: "nowrap",
    border: "0",
  });
  document.body.appendChild(liveRegion);
  return liveRegion;
}

function announce(message: string) {
  const region = ensureLiveRegion();
  // Clear then set to trigger re-announcement
  region.textContent = "";
  requestAnimationFrame(() => {
    region.textContent = message;
  });
}

export function useAriaToast() {
  const clearTimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    return () => {
      if (clearTimer.current) clearTimeout(clearTimer.current);
    };
  }, []);

  const success = useCallback((message: string, opts?: Parameters<typeof sonnerToast.success>[1]) => {
    sonnerToast.success(message, opts);
    announce(message);
  }, []);

  const error = useCallback((message: string, opts?: Parameters<typeof sonnerToast.error>[1]) => {
    sonnerToast.error(message, opts);
    announce(message);
  }, []);

  const warning = useCallback((message: string, opts?: Parameters<typeof sonnerToast.warning>[1]) => {
    sonnerToast.warning(message, opts);
    announce(message);
  }, []);

  const info = useCallback((message: string, opts?: Parameters<typeof sonnerToast.info>[1]) => {
    sonnerToast.info(message, opts);
    announce(message);
  }, []);

  return { success, error, warning, info };
}