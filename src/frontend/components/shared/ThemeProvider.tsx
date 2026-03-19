import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

type Theme = "light" | "dark" | "system";

interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: "light" | "dark";
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "light",
  resolvedTheme: "light",
  setTheme: () => {},
  toggleTheme: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function getStoredTheme(): Theme {
  if (typeof window === "undefined") return "light";
  return (localStorage.getItem("carenet-theme") as Theme) || "light";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(getStoredTheme);
  const [resolvedTheme, setResolved] = useState<"light" | "dark">(
    () => (getStoredTheme() === "system" ? getSystemTheme() : getStoredTheme()) as "light" | "dark"
  );

  const applyTheme = useCallback((t: Theme) => {
    const resolved = t === "system" ? getSystemTheme() : t;
    setResolved(resolved);
    const root = document.documentElement;
    if (resolved === "dark") {
      root.classList.add("dark");
      injectDarkOverrides();
    } else {
      root.classList.remove("dark");
      removeDarkOverrides();
    }
  }, []);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    localStorage.setItem("carenet-theme", t);
    applyTheme(t);
  }, [applyTheme]);

  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }, [resolvedTheme, setTheme]);

  // Apply on mount
  useEffect(() => {
    applyTheme(theme);
  }, []);

  // Listen for system theme changes
  useEffect(() => {
    if (theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => applyTheme("system");
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [theme, applyTheme]);

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

/* ─── Runtime dark mode override for inline styles ───
 * React renders inline style={{color:"#535353"}} as
 * style="color: rgb(83, 83, 83)" in the DOM. CSS attribute
 * selectors may not match all variants. This injects a
 * dynamic <style> element covering computed RGB equivalents.
 */
const DARK_OVERRIDE_ID = "carenet-dark-inline-overrides";

function injectDarkOverrides() {
  if (document.getElementById(DARK_OVERRIDE_ID)) return;
  const style = document.createElement("style");
  style.id = DARK_OVERRIDE_ID;
  style.textContent = `
    .dark [style*="color: rgb(83, 83, 83)"],
    .dark [style*="color: rgb(83,83,83)"] {
      color: var(--cn-text) !important;
    }
    .dark [style*="color: rgb(132, 132, 132)"],
    .dark [style*="color: rgb(132,132,132)"] {
      color: var(--cn-text-secondary) !important;
    }
    .dark [style*="color: rgb(30, 41, 59)"],
    .dark [style*="color: rgb(30,41,59)"] {
      color: var(--cn-text-heading) !important;
    }
    .dark [style*="background-color: rgb(245, 247, 250)"],
    .dark [style*="background-color: rgb(245,247,250)"] {
      background-color: var(--cn-bg-page) !important;
    }
    .dark [style*="background-color: rgb(255, 255, 255)"],
    .dark [style*="background-color: rgb(255,255,255)"],
    .dark [style*="background: rgb(255, 255, 255)"],
    .dark [style*="background: rgb(255,255,255)"] {
      background: var(--cn-bg-card) !important;
    }
    .dark [style*="background: rgb(245, 247, 250)"],
    .dark [style*="background: rgb(245,247,250)"],
    .dark [style*="background: rgb(249, 250, 251)"],
    .dark [style*="background: rgb(249,250,251)"] {
      background: var(--cn-bg-input) !important;
    }
    .dark [style*="border-color: rgb(229, 231, 235)"],
    .dark [style*="border-color: rgb(229,231,235)"] {
      border-color: var(--cn-border) !important;
    }
    .dark [style*="border-bottom: 1px solid rgb(243, 244, 246)"],
    .dark [style*="border-bottom: 1px solid rgb(249, 250, 251)"] {
      border-color: var(--cn-border) !important;
    }
  `;
  document.head.appendChild(style);
}

function removeDarkOverrides() {
  const el = document.getElementById(DARK_OVERRIDE_ID);
  if (el) el.remove();
}
