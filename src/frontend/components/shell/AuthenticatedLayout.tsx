import { Link, Outlet, useLocation } from "react-router";
import React, { useState, useEffect, Suspense } from "react";
import {
  LayoutDashboard, Calendar, MessageSquare, DollarSign, Star, FileText, User,
  Briefcase, Heart, CreditCard, Users, CheckCircle, BarChart2, Settings,
  Bell, Search, LogOut, Menu, X, ChevronRight, ShoppingBag, Package,
  ClipboardList, Flag, Home, ChevronDown, Sun, Moon,
  Inbox, Shield, Radio, Wallet,
  Building2,
  Globe,
  Coins, Handshake, Receipt,
  Megaphone,
  Gavel,
} from "lucide-react";
import { useTheme } from "@/frontend/components/shared/ThemeProvider";
import { type Role, roleConfig, cn } from "@/frontend/theme/tokens";
import { useTranslation, type TFunction } from "react-i18next";
import { LanguageSwitcher } from "@/frontend/components/shared/LanguageSwitcher";
import { useAuth } from "@/backend/store/auth/AuthContext";
import { setStatusBarForRole } from "@/frontend/native/statusBar";
import { BottomNav } from "@/frontend/components/navigation/BottomNav";
import { OfflineIndicator } from "@/frontend/components/shared/OfflineIndicator";
import { NotificationPermissionPrompt } from "@/frontend/components/shared/NotificationPermissionPrompt";
import { PageSkeleton } from "@/frontend/components/shared/PageSkeleton";
import { RealtimeStatusIndicator } from "@/frontend/components/shared/RealtimeStatusIndicator";
import { RetryOverlay } from "@/frontend/components/shared/RetryOverlay";
import { ConnectivityDebugPanel } from "@/frontend/components/shared/ConnectivityDebugPanel";
import { usePendingProofCount } from "@/frontend/hooks/usePendingProofCount";
import { useTransitionNavigate } from "@/frontend/hooks/useTransitionNavigate";
import { useUnreadCounts } from "@/frontend/hooks/useUnreadCounts";
import { UnreadCountsContext } from "@/frontend/hooks/UnreadCountsContext";

/* ─── Focus main content on route change (a11y) ─── */
function useFocusOnNavigate() {
  const location = useLocation();
  useEffect(() => {
    const main = document.getElementById("main-content");
    if (main) {
      main.focus({ preventScroll: true });
    }
  }, [location.pathname]);
}

/* ─── Navigation links per role ─── */
/* Organized into sections: main links + secondary/tool links */
interface NavSection {
  sectionKey?: string;          // i18n key under sidebar.section.*
  links: { i18nKey: string; path: string; icon: React.ElementType }[];
}

function getRoleNavSections(t: TFunction): Record<Role, NavSection[]> {
  return {
    guardian: [
      {
        sectionKey: "main",
        links: [
          { i18nKey: "dashboard", path: "/guardian/dashboard", icon: LayoutDashboard },
          { i18nKey: "careRequirements", path: "/guardian/care-requirements", icon: ClipboardList },
          { i18nKey: "marketplaceHub", path: "/guardian/marketplace-hub", icon: Megaphone },
          { i18nKey: "placements", path: "/guardian/placements", icon: Shield },
          { i18nKey: "myPatients", path: "/guardian/patients", icon: Heart },
          { i18nKey: "schedule", path: "/guardian/schedule", icon: Calendar },
          { i18nKey: "messages", path: "/guardian/messages", icon: MessageSquare },
          { i18nKey: "payments", path: "/guardian/payments", icon: CreditCard },
          { i18nKey: "billing", path: "/billing", icon: Receipt },
          { i18nKey: "wallet", path: "/wallet?role=guardian", icon: Coins },
          { i18nKey: "contracts", path: "/contracts?role=guardian", icon: Handshake },
          { i18nKey: "reviews", path: "/guardian/reviews", icon: Star },
          { i18nKey: "profile", path: "/guardian/profile", icon: User },
        ],
      },
      {
        sectionKey: "tools",
        links: [
          { i18nKey: "findCaregivers", path: "/guardian/search", icon: Search },
          { i18nKey: "compareCaregivers", path: "/guardian/caregiver-comparison", icon: Users },
          { i18nKey: "newBooking", path: "/guardian/booking", icon: Calendar },
          { i18nKey: "postRequirement", path: "/guardian/care-requirement-wizard", icon: FileText },
          { i18nKey: "patientIntake", path: "/guardian/patient-intake", icon: Heart },
          { i18nKey: "familyHub", path: "/guardian/family-hub", icon: Home },
        ],
      },
      {
        sectionKey: "browse",
        links: [
          { i18nKey: "marketplace", path: "/marketplace", icon: Search },
          { i18nKey: "agencies", path: "/agencies", icon: Building2 },
          { i18nKey: "shop", path: "/shop", icon: ShoppingBag },
        ],
      },
    ],
    patient: [
      {
        sectionKey: "main",
        links: [
          { i18nKey: "dashboard", path: "/patient/dashboard", icon: LayoutDashboard },
          { i18nKey: "careHistory", path: "/patient/care-history", icon: Heart },
          { i18nKey: "medicalRecords", path: "/patient/medical-records", icon: FileText },
          { i18nKey: "schedule", path: "/patient/schedule", icon: Calendar },
          { i18nKey: "messages", path: "/patient/messages", icon: MessageSquare },
          { i18nKey: "profile", path: "/patient/profile", icon: User },
        ],
      },
      {
        sectionKey: "health",
        links: [
          { i18nKey: "vitalsTracking", path: "/patient/vitals", icon: Heart },
          { i18nKey: "medications", path: "/patient/medications", icon: ClipboardList },
          { i18nKey: "healthReport", path: "/patient/health-report", icon: BarChart2 },
          { i18nKey: "emergencyHub", path: "/patient/emergency", icon: Shield },
        ],
      },
      {
        sectionKey: "privacyBrowse",
        links: [
          { i18nKey: "dataPrivacy", path: "/patient/data-privacy", icon: Shield },
          { i18nKey: "shop", path: "/shop", icon: ShoppingBag },
          { i18nKey: "helpCenter", path: "/support/help", icon: FileText },
        ],
      },
    ],
    caregiver: [
      {
        sectionKey: "main",
        links: [
          { i18nKey: "dashboard", path: "/caregiver/dashboard", icon: LayoutDashboard },
          { i18nKey: "myPatients", path: "/caregiver/assigned-patients", icon: Heart },
          { i18nKey: "myJobs", path: "/caregiver/jobs", icon: Briefcase },
          { i18nKey: "careLog", path: "/caregiver/care-log", icon: ClipboardList },
          { i18nKey: "careNotes", path: "/caregiver/care-notes", icon: FileText },
          { i18nKey: "schedule", path: "/caregiver/schedule", icon: Calendar },
          { i18nKey: "messages", path: "/caregiver/messages", icon: MessageSquare },
          { i18nKey: "earnings", path: "/caregiver/earnings", icon: DollarSign },
          { i18nKey: "reviews", path: "/caregiver/reviews", icon: Star },
          { i18nKey: "documents", path: "/caregiver/documents", icon: FileText },
          { i18nKey: "profile", path: "/caregiver/profile", icon: User },
        ],
      },
      {
        sectionKey: "patientCare",
        links: [
          { i18nKey: "prescriptions", path: "/caregiver/prescription", icon: ClipboardList },
          { i18nKey: "medSchedule", path: "/caregiver/med-schedule", icon: Calendar },
          { i18nKey: "shiftPlanner", path: "/caregiver/shift-planner", icon: CheckCircle },
        ],
      },
      {
        sectionKey: "finance",
        links: [
          { i18nKey: "wallet", path: "/wallet?role=caregiver", icon: Coins },
          { i18nKey: "contracts", path: "/contracts?role=caregiver", icon: Handshake },
          { i18nKey: "billing", path: "/billing", icon: Receipt },
          { i18nKey: "dailyEarnings", path: "/caregiver/daily-earnings", icon: DollarSign },
          { i18nKey: "payoutSetup", path: "/caregiver/payout-setup", icon: Wallet },
          { i18nKey: "taxReports", path: "/caregiver/tax-reports", icon: FileText },
        ],
      },
      {
        sectionKey: "growth",
        links: [
          { i18nKey: "trainingPortal", path: "/caregiver/training", icon: Star },
          { i18nKey: "skillsAssessment", path: "/caregiver/skills-assessment", icon: CheckCircle },
          { i18nKey: "portfolio", path: "/caregiver/portfolio", icon: FileText },
          { i18nKey: "references", path: "/caregiver/references", icon: Users },
        ],
      },
    ],
    agency: [
      {
        sectionKey: "main",
        links: [
          { i18nKey: "dashboard", path: "/agency/dashboard", icon: LayoutDashboard },
          { i18nKey: "requirements", path: "/agency/requirements-inbox", icon: Inbox },
          { i18nKey: "marketplaceBrowse", path: "/agency/marketplace-browse", icon: Megaphone },
          { i18nKey: "bidManagement", path: "/agency/bid-management", icon: Gavel },
          { i18nKey: "jobManagement", path: "/agency/job-management", icon: Briefcase },
          { i18nKey: "placements", path: "/agency/placements", icon: Shield },
          { i18nKey: "shiftMonitor", path: "/agency/shift-monitoring", icon: Radio },
          { i18nKey: "caregivers", path: "/agency/caregivers", icon: Users },
          { i18nKey: "clients", path: "/agency/clients", icon: Heart },
          { i18nKey: "messages", path: "/agency/messages", icon: MessageSquare },
          { i18nKey: "reports", path: "/agency/reports", icon: BarChart2 },
        ],
      },
      {
        sectionKey: "operations",
        links: [
          { i18nKey: "staffHiring", path: "/agency/hiring", icon: Briefcase },
          { i18nKey: "staffAttendance", path: "/agency/attendance", icon: Calendar },
          { i18nKey: "clientIntake", path: "/agency/client-intake", icon: ClipboardList },
          { i18nKey: "incidentReport", path: "/agency/incident-report", icon: Flag },
          { i18nKey: "incidentsList", path: "/agency/incidents", icon: Flag },
          { i18nKey: "branches", path: "/agency/branches", icon: Building2 },
        ],
      },
      {
        sectionKey: "financeSettings",
        links: [
          { i18nKey: "wallet", path: "/wallet?role=agency", icon: Coins },
          { i18nKey: "contracts", path: "/contracts?role=agency", icon: Handshake },
          { i18nKey: "billing", path: "/billing", icon: Receipt },
          { i18nKey: "payroll", path: "/agency/payroll", icon: Wallet },
          { i18nKey: "payments", path: "/agency/payments", icon: CreditCard },
          { i18nKey: "storefront", path: "/agency/storefront", icon: Home },
          { i18nKey: "settings", path: "/agency/settings", icon: Settings },
        ],
      },
    ],
    shop: [
      {
        sectionKey: "main",
        links: [
          { i18nKey: "dashboard", path: "/shop/dashboard", icon: LayoutDashboard },
          { i18nKey: "products", path: "/shop/products", icon: Package },
          { i18nKey: "orders", path: "/shop/orders", icon: ShoppingBag },
          { i18nKey: "inventory", path: "/shop/inventory", icon: ClipboardList },
          { i18nKey: "analytics", path: "/shop/analytics", icon: BarChart2 },
          { i18nKey: "billing", path: "/billing", icon: Receipt },
        ],
      },
      {
        sectionKey: "management",
        links: [
          { i18nKey: "productEditor", path: "/shop/product-editor", icon: FileText },
          { i18nKey: "fulfillment", path: "/shop/fulfillment", icon: Package },
          { i18nKey: "merchantAnalytics", path: "/shop/merchant-analytics", icon: BarChart2 },
          { i18nKey: "onboarding", path: "/shop/onboarding", icon: CheckCircle },
        ],
      },
    ],
    admin: [
      {
        sectionKey: "main",
        links: [
          { i18nKey: "dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
          { i18nKey: "users", path: "/admin/users", icon: Users },
          { i18nKey: "verifications", path: "/admin/verifications", icon: CheckCircle },
          { i18nKey: "agencyApprovals", path: "/admin/agency-approvals", icon: Building2 },
          { i18nKey: "placements", path: "/admin/placement-monitoring", icon: Shield },
          { i18nKey: "walletManagement", path: "/admin/wallet-management", icon: Coins },
          { i18nKey: "contractsOverview", path: "/admin/contracts", icon: Handshake },
          { i18nKey: "payments", path: "/admin/payments", icon: CreditCard },
          { i18nKey: "billing", path: "/billing", icon: Receipt },
          { i18nKey: "reports", path: "/admin/reports", icon: BarChart2 },
        ],
      },
      {
        sectionKey: "system",
        links: [
          { i18nKey: "systemHealth", path: "/admin/system-health", icon: Radio },
          { i18nKey: "auditLogs", path: "/admin/audit-logs", icon: FileText },
          { i18nKey: "userInspector", path: "/admin/user-inspector", icon: Search },
          { i18nKey: "financialAudit", path: "/admin/financial-audit", icon: DollarSign },
          { i18nKey: "disputes", path: "/admin/disputes", icon: Flag },
        ],
      },
      {
        sectionKey: "contentConfig",
        links: [
          { i18nKey: "cmsManager", path: "/admin/cms", icon: FileText },
          { i18nKey: "policyManager", path: "/admin/policy", icon: Shield },
          { i18nKey: "promoManagement", path: "/admin/promos", icon: Star },
          { i18nKey: "languages", path: "/admin/languages", icon: Globe },
          { i18nKey: "sitemap", path: "/admin/sitemap", icon: Globe },
          { i18nKey: "settings", path: "/admin/settings", icon: Settings },
        ],
      },
    ],
    moderator: [
      {
        sectionKey: "main",
        links: [
          { i18nKey: "dashboard", path: "/moderator/dashboard", icon: LayoutDashboard },
          { i18nKey: "reviews", path: "/moderator/reviews", icon: Star },
          { i18nKey: "reports", path: "/moderator/reports", icon: Flag },
          { i18nKey: "content", path: "/moderator/content", icon: FileText },
          { i18nKey: "billing", path: "/billing", icon: Receipt },
        ],
      },
    ],
  };
}

// Flatten for backward compatibility (used by BottomNav role detection etc.)
// NOTE: This uses English fallback labels since it runs at module scope.
// BottomNav has its own i18n, so this is only for type compatibility.
const roleNavLinks: Record<Role, { label: string; path: string; icon: React.ElementType }[]> = Object.fromEntries(
  Object.entries(getRoleNavSections(((key: string) => key) as unknown as TFunction)).map(([role, sections]) => [
    role,
    sections.flatMap((s) => s.links.map((l) => ({ label: l.i18nKey, path: l.path, icon: l.icon }))),
  ])
) as Record<Role, { label: string; path: string; icon: React.ElementType }[]>;

/* ─── Demo user names per role ─── */
const roleUserNames: Record<Role, string> = {
  caregiver: "Karim Uddin",
  guardian: "Rashed Hossain",
  admin: "Admin",
  moderator: "Mod User",
  patient: "Patient User",
  agency: "Agency Manager",
  shop: "Shop Owner",
};

/**
 * AuthenticatedLayout — shell for all role-based (logged-in) pages.
 * Provides:
 *   - Desktop: persistent sidebar + header
 *   - Mobile: hamburger-triggered sidebar + mobile header + BottomNav
 * Pages rendered via <Outlet /> should NOT wrap themselves in <Layout>.
 */
export function AuthenticatedLayout() {
  const location = useLocation();
  const navigate = useTransitionNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { resolvedTheme, toggleTheme } = useTheme();
  const { t } = useTranslation("common");
  const { user, logout } = useAuth();
  const pendingProofCount = usePendingProofCount();

  // A11y: move focus to main content on route change
  useFocusOnNavigate();

  // Listen for toggle-sidebar events from BottomNav "Menu" tab
  useEffect(() => {
    const handler = () => setSidebarOpen((prev) => !prev);
    window.addEventListener("toggle-sidebar", handler);
    return () => window.removeEventListener("toggle-sidebar", handler);
  }, []);

  // Detect role: prefer auth context, fallback to URL
  const segment = location.pathname.split("/")[1];
  const currentRole: Role = user?.activeRole || ((segment && segment in roleNavLinks) ? segment as Role : "guardian");
  const unreadCounts = useUnreadCounts(currentRole);
  const navSections = getRoleNavSections(t)[currentRole];
  const rCfg = roleConfig[currentRole];
  const rolePrimary = `var(--${rCfg.cssVar})`;
  const userName = user?.name || roleUserNames[currentRole];

  // Update native status bar color when role changes
  useEffect(() => {
    setStatusBarForRole(currentRole);
  }, [currentRole]);

  const handleLogout = () => {
    logout();
    navigate("/auth/login", { replace: true });
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: cn.bgPage }}>
      {/* Skip to main content — a11y */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:text-white focus:text-sm focus:outline-none"
        style={{ background: cn.pink }}
      >
        {t("a11y.skipToContent", "Skip to main content")}
      </a>

      {/* Offline status banner — full-width above everything */}
      <OfflineIndicator />

      {/* Retry backoff banner — shows when API calls are retrying */}
      <RetryOverlay />

      {/* Notification permission prompt — shows once on first login */}
      <NotificationPermissionPrompt />

      <div className="flex flex-1 min-h-0">
      {/* Backdrop overlay when sidebar is open on mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ─── Sidebar (hidden on mobile, always visible on desktop) ─── */}
      <aside
        aria-label={t("a11y.sidebarNav", "Sidebar navigation")}
        className={`fixed top-0 left-0 h-full w-64 z-50 flex flex-col ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:static md:flex`}
        style={{
          background: cn.bgSidebar,
          boxShadow: cn.shadowSidebar,
          minHeight: "100vh",
          transition: "translate 300ms ease-in-out, transform 300ms ease-in-out",
        }}
      >
        <div className="p-5 flex items-center justify-between" style={{ borderBottom: `1px solid ${cn.borderLight}` }}>
          <Link to="/" className="flex items-center gap-2 no-underline">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: rCfg.gradient }}>
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg" style={{ color: cn.text }}>CareNet</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden p-1" style={{ color: cn.textSecondary }} aria-label={t("a11y.closeSidebar", "Close sidebar")}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mx-4 mt-3 mb-1 px-3 py-1.5 rounded-lg text-center text-xs"
          style={{ background: rCfg.lightBg, color: rolePrimary }}>
          {t("sidebar.portal", { role: rCfg.label })}
        </div>

        <nav className="flex-1 px-3 py-3 overflow-y-auto" aria-label={t("a11y.roleNav", "Role navigation")}>
          {navSections.map((section, sIdx) => (
            <div key={sIdx} className={sIdx > 0 ? "mt-3" : ""}>
              {section.sectionKey && sIdx > 0 && (
                <p
                  className="px-3 pt-2 pb-1 text-[10px] uppercase tracking-wider"
                  style={{ color: cn.textSecondary, opacity: 0.6 }}
                >
                  {t(`sidebar.section.${section.sectionKey}`)}
                </p>
              )}
              <div className="space-y-0.5">
                {section.links.map((link) => {
                  const Icon = link.icon;
                  const isActive = location.pathname === link.path;
                  return (
                    <Link key={link.path} to={link.path} onClick={() => setSidebarOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm no-underline"
                      style={{
                        background: isActive ? rCfg.lightBg : "transparent",
                        color: isActive ? rolePrimary : cn.text,
                        fontWeight: isActive ? 500 : 400,
                      }}>
                      <Icon className="shrink-0" style={{ width: "1.125rem", height: "1.125rem" }} />
                      <span className="flex-1">{t(`sidebar.${link.i18nKey}`)}</span>
                      {link.i18nKey === "messages" && unreadCounts.messages > 0 && (
                        <span
                          className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] text-white shrink-0"
                          style={{ background: cn.green }}
                        >
                          {unreadCounts.messages > 9 ? "9+" : unreadCounts.messages}
                        </span>
                      )}
                      {link.i18nKey === "billing" && pendingProofCount > 0 && (
                        <span
                          className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] text-white shrink-0"
                          style={{ background: cn.pink }}
                        >
                          {pendingProofCount}
                        </span>
                      )}
                      {isActive && !(link.i18nKey === "billing" && pendingProofCount > 0) && <ChevronRight className="w-4 h-4 ml-auto" />}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* ─── Shared links — accessible to all signed-in users ─── */}
        <div className="px-3 pt-2 pb-1" style={{ borderTop: `1px solid ${cn.borderLight}` }}>
          <p
            className="px-3 pt-1 pb-1 text-[10px] uppercase tracking-wider"
            style={{ color: cn.textSecondary, opacity: 0.6 }}
          >
            {t("sidebar.section.general")}
          </p>
          <div className="space-y-0.5">
            {[
              { i18nKey: "nav.home", path: "/", icon: Home },
              { i18nKey: "sidebar.notifications", path: "/notifications", icon: Bell },
              { i18nKey: "sidebar.messages", path: "/messages", icon: MessageSquare },
              { i18nKey: "sidebar.marketplace", path: "/marketplace", icon: Search },
              { i18nKey: "sidebar.agencies", path: "/agencies", icon: Building2 },
              { i18nKey: "sidebar.shop", path: "/shop", icon: ShoppingBag },
            ].map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              const badgeCount =
                link.i18nKey === "sidebar.notifications" ? unreadCounts.notifications :
                link.i18nKey === "sidebar.messages" ? unreadCounts.messages : 0;
              const badgeColor =
                link.i18nKey === "sidebar.notifications" ? cn.pink : cn.green;
              return (
                <Link key={link.path} to={link.path} onClick={() => setSidebarOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-sm no-underline"
                  style={{
                    color: isActive ? rolePrimary : cn.textSecondary,
                    background: isActive ? rCfg.lightBg : "transparent",
                  }}>
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="flex-1">{t(link.i18nKey)}</span>
                  {badgeCount > 0 && (
                    <span
                      className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] text-white shrink-0"
                      style={{ background: badgeColor }}
                    >
                      {badgeCount > 9 ? "9+" : badgeCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
          <p
            className="px-3 pt-3 pb-1 text-[10px] uppercase tracking-wider"
            style={{ color: cn.textSecondary, opacity: 0.6 }}
          >
            {t("sidebar.section.supportInfo")}
          </p>
          <div className="space-y-0.5">
            {[
              { i18nKey: "sidebar.helpCenter", path: "/support/help", icon: Shield },
              { i18nKey: "sidebar.submitTicket", path: "/support/ticket", icon: ClipboardList },
              { i18nKey: "sidebar.refundRequest", path: "/support/refund", icon: CreditCard },
              { i18nKey: "sidebar.contactUs", path: "/support/contact", icon: MessageSquare },
              { i18nKey: "sidebar.blog", path: "/community/blog", icon: FileText },
              { i18nKey: "sidebar.careers", path: "/community/careers", icon: Briefcase },
              { i18nKey: "sidebar.about", path: "/about", icon: Heart },
              { i18nKey: "sidebar.features", path: "/features", icon: Star },
              { i18nKey: "sidebar.pricing", path: "/pricing", icon: DollarSign },
              { i18nKey: "sidebar.privacyPolicy", path: "/privacy", icon: Shield },
              { i18nKey: "sidebar.termsOfService", path: "/terms", icon: FileText },
            ].map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link key={link.path} to={link.path} onClick={() => setSidebarOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-sm no-underline"
                  style={{
                    color: isActive ? rolePrimary : cn.textSecondary,
                    background: isActive ? rCfg.lightBg : "transparent",
                  }}>
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{t(link.i18nKey)}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* ─── Settings & Logout ─── */}
        <div className="p-3 space-y-0.5" style={{ borderTop: `1px solid ${cn.borderLight}` }}>
          {/* Realtime connection health */}
          <div className="mb-2">
            <RealtimeStatusIndicator variant="full" />
          </div>

          {/* Language & Theme controls */}
          <div className="flex items-center gap-2 px-3 py-2">
            <LanguageSwitcher />
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:opacity-80 transition-all"
              style={{ color: cn.textSecondary }}
              aria-label={resolvedTheme === "dark" ? t("a11y.switchToLight", "Switch to light mode") : t("a11y.switchToDark", "Switch to dark mode")}
              title={resolvedTheme === "dark" ? "Switch to light" : "Switch to dark"}
            >
              {resolvedTheme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>

          <Link to="/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:opacity-80 transition-all text-sm no-underline" style={{ color: cn.textSecondary }}>
            <Settings className="w-4 h-4" />
            <span>{t("nav.settings")}</span>
          </Link>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:opacity-80 transition-all text-sm" style={{ color: cn.red }}>
            <LogOut className="w-4 h-4" />
            <span>{t("nav.logout")}</span>
          </button>
        </div>
      </aside>

      {/* ─── Main content area ─── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Desktop header + Mobile header */}
        <header className="sticky top-0 z-30 px-4 md:px-6 py-3 flex items-center gap-4"
          style={{ background: cn.bgHeader, boxShadow: cn.shadowHeader }}>
          {/* Hamburger — mobile only */}
          <button
            className="md:hidden p-2 -ml-2 rounded-lg hover:opacity-80 transition-all"
            style={{ color: cn.textSecondary }}
            onClick={() => setSidebarOpen((o) => !o)}
            aria-label={sidebarOpen ? t("a11y.closeMenu", "Close menu") : t("a11y.openMenu", "Open menu")}
            aria-expanded={sidebarOpen}
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Search — hidden on mobile */}
          <div role="search" className="flex-1 max-w-xs hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: cn.bgInput }}>
            <Search className="w-4 h-4 shrink-0" style={{ color: cn.textSecondary }} aria-hidden="true" />
            <input placeholder={t("sidebar.searchPlaceholder")} className="bg-transparent outline-none text-sm flex-1" style={{ color: cn.text }} aria-label={t("sidebar.searchPlaceholder")} />
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <Link to="/notifications" className="relative p-2 rounded-lg hover:opacity-80 transition-all no-underline" aria-label={t("a11y.notifications", "Notifications")}>
              <Bell className="w-5 h-5" style={{ color: cn.textSecondary }} aria-hidden="true" />
              {unreadCounts.notifications > 0 && (
                unreadCounts.notifications <= 9 ? (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full flex items-center justify-center text-[10px] text-white px-1"
                    style={{ background: cn.pink }}
                    aria-label={t("a11y.unreadNotifications", { count: unreadCounts.notifications })}
                  >
                    {unreadCounts.notifications}
                  </span>
                ) : (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full flex items-center justify-center text-[10px] text-white px-1"
                    style={{ background: cn.pink }}
                    aria-label={t("a11y.unreadNotifications", { count: unreadCounts.notifications })}
                  >
                    9+
                  </span>
                )
              )}
            </Link>
            <Link to={`/${currentRole}/messages`} className="relative p-2 rounded-lg hover:opacity-80 transition-all no-underline" aria-label={t("a11y.messages", "Messages")}>
              <MessageSquare className="w-5 h-5" style={{ color: cn.textSecondary }} aria-hidden="true" />
              {unreadCounts.messages > 0 && (
                unreadCounts.messages <= 9 ? (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full flex items-center justify-center text-[10px] text-white px-1"
                    style={{ background: cn.green }}
                    aria-label={t("a11y.unreadMessages", { count: unreadCounts.messages })}
                  >
                    {unreadCounts.messages}
                  </span>
                ) : (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full flex items-center justify-center text-[10px] text-white px-1"
                    style={{ background: cn.green }}
                    aria-label={t("a11y.unreadMessages", { count: unreadCounts.messages })}
                  >
                    9+
                  </span>
                )
              )}
            </Link>
            <div className="flex items-center gap-2 pl-2 cursor-pointer">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm"
                style={{ background: rCfg.gradient }}>
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="hidden md:block">
                <p className="text-sm leading-tight" style={{ color: cn.text }}>{userName}</p>
                <p className="text-xs leading-tight" style={{ color: cn.textSecondary }}>{rCfg.label}</p>
              </div>
              <ChevronDown className="w-4 h-4 hidden md:block" style={{ color: cn.textSecondary }} />
            </div>
          </div>
        </header>

        {/* Page content rendered by router */}
        <main className="flex-1 p-4 md:p-6 pb-24 md:pb-6 overflow-y-auto" id="main-content" tabIndex={-1} aria-label={t("a11y.mainContent", "Main content")}>
          <UnreadCountsContext.Provider value={unreadCounts}>
            <Suspense fallback={<PageSkeleton variant="dashboard" />}>
              <Outlet />
            </Suspense>
          </UnreadCountsContext.Provider>
        </main>
      </div>
      </div>

      {/* BottomNav — mobile only, OUTSIDE the flex row */}
      <BottomNav
        unreadMessages={unreadCounts.messages}
        unreadNotifications={unreadCounts.notifications}
        aria-label={t("a11y.bottomNav", "Bottom navigation")}
      />

      {/* Dev-only connectivity debug panel (Ctrl+Shift+D or triple-tap) */}
      <ConnectivityDebugPanel />
    </div>
  );
}
