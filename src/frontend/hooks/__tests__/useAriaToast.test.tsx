// @vitest-environment jsdom
/**
 * Tests for useAriaToast — verifies that the hook creates a live region
 * with role="status" and populates it with toast messages for screen readers.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useAriaToast } from "../useAriaToast";

// Mock sonner so we don't need its full DOM setup
vi.mock("sonner", () => ({
  toast: Object.assign(vi.fn(), {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
  }),
}));

/**
 * Flush all pending requestAnimationFrame callbacks.
 * jsdom 29 implements rAF via MessageChannel / setTimeout(cb, 0) internally,
 * so a double-rAF plus microtask drain reliably advances the queue.
 */
async function flushRAF() {
  await act(async () => {
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => resolve());
      });
    });
  });
}

function getLiveRegion(): HTMLElement | null {
  return document.querySelector('[role="status"]');
}

describe("useAriaToast", () => {
  beforeEach(() => {
    document.querySelectorAll('[role="status"]').forEach((el) => el.remove());
  });

  afterEach(() => {
    document.querySelectorAll('[role="status"]').forEach((el) => el.remove());
  });

  it("does not create a live region until a toast is fired", () => {
    renderHook(() => useAriaToast());
    expect(getLiveRegion()).toBeNull();
  });

  it("creates a live region with role='status' and aria-live='polite' on first toast", async () => {
    const { result } = renderHook(() => useAriaToast());

    act(() => {
      result.current.success("Test message");
    });
    await flushRAF();

    const region = getLiveRegion();
    expect(region).not.toBeNull();
    expect(region!.getAttribute("aria-live")).toBe("polite");
    expect(region!.getAttribute("aria-atomic")).toBe("true");
  });

  it("announces success messages via the live region", async () => {
    const { result } = renderHook(() => useAriaToast());

    act(() => {
      result.current.success("Offer submitted!");
    });
    await flushRAF();

    expect(getLiveRegion()!.textContent).toBe("Offer submitted!");
  });

  it("announces error messages via the live region", async () => {
    const { result } = renderHook(() => useAriaToast());

    act(() => {
      result.current.error("Failed to withdraw bid");
    });
    await flushRAF();

    expect(getLiveRegion()!.textContent).toBe("Failed to withdraw bid");
  });

  it("announces warning messages via the live region", async () => {
    const { result } = renderHook(() => useAriaToast());

    act(() => {
      result.current.warning("Channel connection unstable");
    });
    await flushRAF();

    expect(getLiveRegion()!.textContent).toBe("Channel connection unstable");
  });

  it("announces info messages via the live region", async () => {
    const { result } = renderHook(() => useAriaToast());

    act(() => {
      result.current.info("Wallet balance updated");
    });
    await flushRAF();

    expect(getLiveRegion()!.textContent).toBe("Wallet balance updated");
  });

  it("reuses a single live region across multiple toasts", async () => {
    const { result } = renderHook(() => useAriaToast());

    act(() => {
      result.current.success("First");
    });
    await flushRAF();

    act(() => {
      result.current.error("Second");
    });
    await flushRAF();

    const regions = document.querySelectorAll('[role="status"]');
    expect(regions.length).toBe(1);
    expect(regions[0].textContent).toBe("Second");
  });

  it("hides the live region visually (sr-only pattern)", async () => {
    const { result } = renderHook(() => useAriaToast());

    act(() => {
      result.current.success("Hidden visually");
    });
    await flushRAF();

    const region = getLiveRegion()!;
    expect(region.style.position).toBe("absolute");
    expect(region.style.width).toBe("1px");
    expect(region.style.height).toBe("1px");
    expect(region.style.overflow).toBe("hidden");
  });

  it("passes arguments through to sonner toast methods", async () => {
    const { toast: sonnerToast } = await import("sonner");
    const { result } = renderHook(() => useAriaToast());

    const opts = { duration: 3000 };

    act(() => {
      result.current.success("s", opts);
      result.current.error("e", opts);
      result.current.warning("w", opts);
      result.current.info("i", opts);
    });
    await flushRAF();

    expect(sonnerToast.success).toHaveBeenCalledWith("s", opts);
    expect(sonnerToast.error).toHaveBeenCalledWith("e", opts);
    expect(sonnerToast.warning).toHaveBeenCalledWith("w", opts);
    expect(sonnerToast.info).toHaveBeenCalledWith("i", opts);
  });

  it("clears then re-sets text for screen reader re-announcement", async () => {
    const { result } = renderHook(() => useAriaToast());

    act(() => {
      result.current.success("Message A");
    });
    await flushRAF();
    expect(getLiveRegion()!.textContent).toBe("Message A");

    // The announce() fn clears textContent synchronously then sets via rAF
    act(() => {
      result.current.success("Message B");
    });
    // After the synchronous part, textContent should be cleared
    expect(getLiveRegion()!.textContent).toBe("");

    await flushRAF();
    expect(getLiveRegion()!.textContent).toBe("Message B");
  });

  it("shares a single region across multiple hook instances", async () => {
    const { result: hook1 } = renderHook(() => useAriaToast());
    const { result: hook2 } = renderHook(() => useAriaToast());

    act(() => {
      hook1.current.success("From hook 1");
    });
    await flushRAF();

    act(() => {
      hook2.current.error("From hook 2");
    });
    await flushRAF();

    expect(document.querySelectorAll('[role="status"]').length).toBe(1);
    expect(getLiveRegion()!.textContent).toBe("From hook 2");
  });
});
