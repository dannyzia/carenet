import { useEffect } from "react";

/**
 * useDocumentTitle
 * ─────────────────
 * Sets document.title for the current page so screen readers announce
 * the page name on route change. Satisfies WCAG 2.4.2 (Page Titled, Level A).
 *
 * Appends " — CareNet" to keep titles consistent across the platform.
 * Restores the previous title on unmount (prevents stale titles on back-nav).
 *
 * Usage:
 *   useDocumentTitle(t("pageTitles.caregiverDashboard"))
 *   useDocumentTitle("Dashboard")           // English fallback
 */
export function useDocumentTitle(title: string | undefined): void {
  useEffect(() => {
    if (!title) return;
    const previous = document.title;
    document.title = `${title} — CareNet`;
    return () => {
      document.title = previous;
    };
  }, [title]);
}
