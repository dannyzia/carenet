// @vitest-environment jsdom
/**
 * Tests for useOptimisticUndo — Ctrl+Z keyboard shortcut + visual toast undo.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act, cleanup } from "@testing-library/react";
import { useOptimisticUndo } from "../useOptimisticUndo";

// Mock sonner
const { mockSonnerToast } = vi.hoisted(() => {
  const mockSonnerToast = Object.assign(vi.fn(), {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
  });

  return { mockSonnerToast };
});

vi.mock("sonner", () => ({ toast: mockSonnerToast }));

// Mock i18next — return key as-is with interpolation replaced
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, fallbackOrOpts?: string | Record<string, unknown>, opts?: Record<string, unknown>) => {
      // t("key", "default") or t("key", { action: "x" })
      const interpolations = typeof fallbackOrOpts === "object" ? fallbackOrOpts : opts;
      let result = key;
      if (interpolations) {
        for (const [k, v] of Object.entries(interpolations)) {
          result = result.replace(`{{${k}}}`, String(v));
        }
      }
      return result;
    },
    i18n: { language: "en" },
  }),
}));

function fireCtrlZ() {
  const event = new KeyboardEvent("keydown", {
    key: "z",
    ctrlKey: true,
    bubbles: true,
    cancelable: true,
  });
  document.dispatchEvent(event);
}

function fireCmdZ() {
  const event = new KeyboardEvent("keydown", {
    key: "z",
    metaKey: true,
    bubbles: true,
    cancelable: true,
  });
  document.dispatchEvent(event);
}

describe("useOptimisticUndo", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
    // jsdom doesn't provide matchMedia by default; the hook checks prefers-reduced-motion
    // through matchMedia() so we stub it for deterministic behavior in tests.
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
    document.querySelectorAll('[role="status"]').forEach((el) => el.remove());
  });

  afterEach(() => {
    vi.useRealTimers();
    cleanup();
    document.querySelectorAll('[role="status"]').forEach((el) => el.remove());
  });

  // ─── Ctrl+Z Keyboard Undo ───

  it("calls rollback on Ctrl+Z after pushUndo", () => {
    const rollback = vi.fn();
    const { result } = renderHook(() => useOptimisticUndo());

    act(() => {
      result.current.pushUndo("test action", rollback);
    });

    act(() => {
      fireCtrlZ();
    });

    expect(rollback).toHaveBeenCalledOnce();
  });

  it("calls rollback on Cmd+Z (Mac) after pushUndo", () => {
    const rollback = vi.fn();
    const { result } = renderHook(() => useOptimisticUndo());

    act(() => {
      result.current.pushUndo("test action", rollback);
    });

    act(() => {
      fireCmdZ();
    });

    expect(rollback).toHaveBeenCalledOnce();
  });

  it("does nothing on Ctrl+Z when undo stack is empty", () => {
    renderHook(() => useOptimisticUndo());
    act(() => {
      fireCtrlZ();
    });
    // No error thrown
  });

  it("pops the most recent entry (LIFO order)", () => {
    const rollback1 = vi.fn();
    const rollback2 = vi.fn();
    const { result } = renderHook(() => useOptimisticUndo());

    act(() => {
      result.current.pushUndo("first", rollback1);
      result.current.pushUndo("second", rollback2);
    });

    act(() => fireCtrlZ());
    expect(rollback2).toHaveBeenCalledOnce();
    expect(rollback1).not.toHaveBeenCalled();

    act(() => fireCtrlZ());
    expect(rollback1).toHaveBeenCalledOnce();
  });

  it("auto-expires entries after the undo window", () => {
    const rollback = vi.fn();
    const { result } = renderHook(() => useOptimisticUndo());

    act(() => {
      result.current.pushUndo("expire me", rollback, 3000);
    });

    act(() => {
      vi.advanceTimersByTime(3500);
    });

    act(() => fireCtrlZ());
    expect(rollback).not.toHaveBeenCalled();
  });

  it("clearUndo removes all entries", () => {
    const rollback1 = vi.fn();
    const rollback2 = vi.fn();
    const { result } = renderHook(() => useOptimisticUndo());

    act(() => {
      result.current.pushUndo("a", rollback1);
      result.current.pushUndo("b", rollback2);
      result.current.clearUndo();
    });

    act(() => fireCtrlZ());
    expect(rollback1).not.toHaveBeenCalled();
    expect(rollback2).not.toHaveBeenCalled();
  });

  it("does not intercept Ctrl+Z when focused on an input", () => {
    const rollback = vi.fn();
    const { result } = renderHook(() => useOptimisticUndo());

    act(() => {
      result.current.pushUndo("test", rollback);
    });

    const input = document.createElement("input");
    document.body.appendChild(input);
    input.focus();

    act(() => {
      input.dispatchEvent(new KeyboardEvent("keydown", {
        key: "z",
        ctrlKey: true,
        bubbles: true,
        cancelable: true,
      }));
    });

    expect(rollback).not.toHaveBeenCalled();
    document.body.removeChild(input);
  });

  it("does not intercept Ctrl+Z when focused on a textarea", () => {
    const rollback = vi.fn();
    const { result } = renderHook(() => useOptimisticUndo());

    act(() => {
      result.current.pushUndo("test", rollback);
    });

    const textarea = document.createElement("textarea");
    document.body.appendChild(textarea);
    textarea.focus();

    act(() => {
      textarea.dispatchEvent(new KeyboardEvent("keydown", {
        key: "z",
        ctrlKey: true,
        bubbles: true,
        cancelable: true,
      }));
    });

    expect(rollback).not.toHaveBeenCalled();
    document.body.removeChild(textarea);
  });

  it("cancel function from pushUndo removes the specific entry", () => {
    const rollback = vi.fn();
    const { result } = renderHook(() => useOptimisticUndo());

    let cancel: () => void;
    act(() => {
      cancel = result.current.pushUndo("test", rollback);
    });

    act(() => {
      cancel();
    });

    act(() => fireCtrlZ());
    expect(rollback).not.toHaveBeenCalled();
  });

  // ─── successWithUndo (visual undo toast button) ───

  it("successWithUndo fires a sonner toast with an Undo action button", () => {
    const rollback = vi.fn();
    const { result } = renderHook(() => useOptimisticUndo());

    act(() => {
      result.current.successWithUndo(
        "Offer submitted!",
        "offer submission",
        rollback,
        { description: "500 CP/day for 30 days" }
      );
    });

    // Check that sonner.success was called with action.label = "undo.undoButton"
    expect(mockSonnerToast.success).toHaveBeenCalledOnce();
    const callArgs = mockSonnerToast.success.mock.calls[0];
    expect(callArgs[0]).toBe("Offer submitted!");
    expect(callArgs[1].description).toBe("500 CP/day for 30 days");
    expect(callArgs[1].action).toBeDefined();
    expect(callArgs[1].action.label).toBe("undo.undoButton");
  });

  it("clicking the Undo action button calls rollback", () => {
    const rollback = vi.fn();
    const { result } = renderHook(() => useOptimisticUndo());

    act(() => {
      result.current.successWithUndo("Message", "label", rollback);
    });

    // Simulate clicking the action button
    const actionOnClick = mockSonnerToast.success.mock.calls[0][1].action.onClick;
    act(() => {
      actionOnClick();
    });

    expect(rollback).toHaveBeenCalledOnce();
  });

  it("successWithUndo entry is also undoable via Ctrl+Z", () => {
    const rollback = vi.fn();
    const { result } = renderHook(() => useOptimisticUndo());

    act(() => {
      result.current.successWithUndo("Message", "label", rollback);
    });

    act(() => fireCtrlZ());
    expect(rollback).toHaveBeenCalledOnce();
  });

  it("successWithUndo entry auto-expires after windowMs", () => {
    const rollback = vi.fn();
    const { result } = renderHook(() => useOptimisticUndo());

    act(() => {
      result.current.successWithUndo("Message", "label", rollback, { windowMs: 2000 });
    });

    act(() => {
      vi.advanceTimersByTime(2500);
    });

    act(() => fireCtrlZ());
    expect(rollback).not.toHaveBeenCalled();
  });

  it("clicking Undo button after Ctrl+Z doesn't double-fire", () => {
    const rollback = vi.fn();
    const { result } = renderHook(() => useOptimisticUndo());

    act(() => {
      result.current.successWithUndo("Message", "label", rollback);
    });

    // Undo via keyboard first
    act(() => fireCtrlZ());
    expect(rollback).toHaveBeenCalledOnce();

    // Try to undo again via button — entry already removed from stack
    const actionOnClick = mockSonnerToast.success.mock.calls[0][1].action.onClick;
    act(() => {
      actionOnClick();
    });

    // rollback should NOT fire again (executeUndo guards against consumed entries)
    expect(rollback).toHaveBeenCalledOnce();
  });
});