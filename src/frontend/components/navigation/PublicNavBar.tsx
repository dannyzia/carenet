import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { Heart, LogIn, X, Menu } from "lucide-react";
import { Button } from "@/frontend/components/ui/button";
import { cn } from "@/frontend/theme/tokens";
import { useTheme } from "@/frontend/components/ThemeProvider";
import { Sun, Moon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "@/frontend/components/shared/LanguageSwitcher";

const navLinks = [
  { labelKey: "features", to: "/features" },
  { labelKey: "pricing",  to: "/pricing"  },
  { labelKey: "about",    to: "/about"    },
  { labelKey: "contact",  to: "/contact"  },
];

// Extended links for mobile drawer — includes all publicly accessible pages
const mobileNavLinks = [
  { label: "Home", to: "/home", labelKey: "home" },
  { label: "Features", to: "/features", labelKey: "features" },
  { label: "Pricing", to: "/pricing", labelKey: "pricing" },
  { label: "About", to: "/about", labelKey: "about" },
  { label: "Contact", to: "/contact", labelKey: "contact" },
];

const mobileBrowseLinks = [
  { label: "Marketplace", to: "/marketplace" },
  { label: "Agencies", to: "/agencies" },
  { label: "Shop", to: "/shop" },
];

const mobileSupportLinks = [
  { label: "Help Center", to: "/support/help" },
  { label: "Submit Ticket", to: "/support/ticket" },
  { label: "Refund Request", to: "/support/refund" },
  { label: "Contact Us", to: "/support/contact" },
  { label: "Blog", to: "/community/blog" },
  { label: "Careers", to: "/community/careers" },
  { label: "Privacy Policy", to: "/privacy" },
  { label: "Terms of Service", to: "/terms" },
];

export function PublicNavBar() {
  const location = useLocation();
  const { resolvedTheme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { t } = useTranslation("common");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => setMenuOpen(false), [location.pathname]);

  // Listen for toggle event from BottomNav menu button
  useEffect(() => {
    const handler = () => setMenuOpen((o) => !o);
    window.addEventListener("toggle-sidebar", handler);
    window.addEventListener("toggle-public-sidebar", handler);
    return () => {
      window.removeEventListener("toggle-sidebar", handler);
      window.removeEventListener("toggle-public-sidebar", handler);
    };
  }, []);

  return (
    <>
      {/* ─── Top Header Bar ─── */}
      <header
        className="sticky top-0 z-50"
        style={{
          backgroundColor: cn.bgHeader,
          boxShadow: scrolled ? cn.shadowHeader : "0 1px 3px rgba(0,0,0,0.08)",
          borderBottom: `1px solid ${cn.borderLight}`,
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-3">

          {/* Logo */}
          <Link to="/home" className="flex items-center gap-2 shrink-0 no-underline">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: "var(--cn-gradient-caregiver)" }}
            >
              <Heart className="w-4 h-4 text-white" />
            </div>
            <span className="text-base" style={{ color: cn.text }}>CareNet</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1 ml-6">
            {navLinks.map(({ labelKey, to }) => {
              const active = location.pathname === to;
              return (
                <Link key={to} to={to} className="no-underline">
                  <button
                    className="px-4 py-1.5 rounded-lg text-sm transition-all"
                    style={{
                      color: active ? "#FEB4C5" : cn.text,
                      background: active ? "rgba(254,180,197,0.10)" : "transparent",
                      fontWeight: active ? 500 : 400,
                    }}
                  >
                    {t(`nav.${labelKey}`)}
                  </button>
                </Link>
              );
            })}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2 ml-auto">
            {/* Language switcher */}
            <div>
              <LanguageSwitcher variant="compact" />
            </div>
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="flex items-center justify-center w-8 h-8 rounded-lg transition-all hover:opacity-80"
              style={{ color: cn.textSecondary, background: "rgba(128,128,128,0.1)" }}
              aria-label="Toggle theme"
            >
              {resolvedTheme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Divider */}
            <div className="hidden sm:block w-px h-6 mx-1" style={{ background: cn.borderLight }} />

            {/* Auth buttons — desktop only */}
            <Link to="/auth/register" className="hidden sm:block no-underline">
              <Button
                size="sm"
                className="gap-1.5"
                style={{
                  color: cn.pinkLight,
                  borderColor: "rgba(254,180,197,0.3)",
                  background: "transparent",
                  border: "1px solid rgba(254,180,197,0.3)",
                }}
              >
                {t("nav.register")}
              </Button>
            </Link>
            <Link to="/auth/login" className="hidden sm:block no-underline">
              <Button
                size="sm"
                className="gap-1.5"
                style={{
                  background: "var(--cn-gradient-caregiver)",
                  color: "white",
                  boxShadow: "0 2px 10px rgba(254,180,197,0.35)",
                }}
              >
                <LogIn className="w-3.5 h-3.5" />
                {t("nav.login")}
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* ─── Sidebar backdrop ─── */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-[60] md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* ─── Sidebar drawer ─── */}
      <aside
        className="fixed top-0 left-0 h-full w-72 z-[70] flex flex-col md:hidden"
        style={{
          background: cn.bgSidebar,
          boxShadow: menuOpen ? "4px 0 24px rgba(0,0,0,0.18)" : "none",
          transform: menuOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 300ms ease-in-out",
        }}
      >
        {/* Sidebar header */}
        <div className="p-5 flex items-center justify-between" style={{ borderBottom: `1px solid ${cn.borderLight}` }}>
          <Link to="/home" className="flex items-center gap-2 no-underline" onClick={() => setMenuOpen(false)}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "var(--cn-gradient-caregiver)" }}>
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg" style={{ color: cn.text }}>CareNet</span>
          </Link>
          <button onClick={() => setMenuOpen(false)} className="p-2 rounded-lg hover:opacity-80" style={{ color: cn.textSecondary }}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Auth buttons in drawer */}
        <div className="px-4 pt-4 pb-2 flex flex-col gap-2">
          <Link to="/auth/register" onClick={() => setMenuOpen(false)} className="no-underline">
            <Button
              size="sm"
              className="w-full gap-1.5"
              style={{
                color: cn.pinkLight,
                background: "transparent",
                border: "1px solid rgba(254,180,197,0.3)",
              }}
            >
              {t("nav.register")}
            </Button>
          </Link>
          <Link to="/auth/login" onClick={() => setMenuOpen(false)} className="no-underline">
            <Button
              size="sm"
              className="w-full gap-1.5"
              style={{
                background: "var(--cn-gradient-caregiver)",
                color: "white",
              }}
            >
              <LogIn className="w-3.5 h-3.5" />
              {t("nav.login")}
            </Button>
          </Link>
        </div>

        {/* Scrollable nav links */}
        <nav className="flex-1 px-3 py-2 overflow-y-auto">
          {/* Main nav */}
          <div className="space-y-0.5">
            {mobileNavLinks.map(({ to, labelKey }) => {
              const active = location.pathname === to;
              return (
                <Link key={to} to={to} onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm no-underline"
                  style={{
                    color: active ? "#FEB4C5" : cn.text,
                    background: active ? "rgba(254,180,197,0.10)" : "transparent",
                    fontWeight: active ? 500 : 400,
                  }}>
                  <span>{t(`nav.${labelKey}`)}</span>
                </Link>
              );
            })}
          </div>

          {/* Browse links */}
          <p className="px-3 pt-4 pb-1 text-[10px] uppercase tracking-wider" style={{ color: cn.textSecondary, opacity: 0.6 }}>
            Browse
          </p>
          <div className="space-y-0.5">
            {mobileBrowseLinks.map(({ to, label }) => {
              const active = location.pathname === to;
              return (
                <Link key={to} to={to} onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm no-underline"
                  style={{
                    color: active ? "#FEB4C5" : cn.textSecondary,
                    background: active ? "rgba(254,180,197,0.10)" : "transparent",
                  }}>
                  <span>{label}</span>
                </Link>
              );
            })}
          </div>

          {/* Support links */}
          <p className="px-3 pt-4 pb-1 text-[10px] uppercase tracking-wider" style={{ color: cn.textSecondary, opacity: 0.6 }}>
            Support & Info
          </p>
          <div className="space-y-0.5">
            {mobileSupportLinks.map(({ to, label }) => {
              const active = location.pathname === to;
              return (
                <Link key={to} to={to} onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm no-underline"
                  style={{
                    color: active ? "#FEB4C5" : cn.textSecondary,
                    background: active ? "rgba(254,180,197,0.10)" : "transparent",
                  }}>
                  <span>{label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Sidebar footer — language & theme */}
        <div className="p-3 space-y-2" style={{ borderTop: `1px solid ${cn.borderLight}` }}>
          <div className="px-3">
            <LanguageSwitcher variant="dropdown" />
          </div>
          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:opacity-80 transition-all text-sm"
            style={{ color: cn.textSecondary, background: "rgba(128,128,128,0.1)" }}
          >
            {resolvedTheme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            <span>{resolvedTheme === "dark" ? "Light Mode" : "Dark Mode"}</span>
          </button>
        </div>
      </aside>
    </>
  );
}