import React from "react";

/**
 * Layout — PASSTHROUGH component.
 *
 * Previously this component rendered a full sidebar + header shell.
 * Now the shell is provided by AuthenticatedLayout in the route tree.
 * This component is kept as a no-op passthrough so existing pages
 * that still import and wrap with <Layout> continue to work
 * without double navigation.
 *
 * Pages should gradually remove their <Layout> wrapper and this file
 * will be deleted once all pages are migrated.
 */

interface LayoutProps {
  children: React.ReactNode;
  role?: string;
  userName?: string;
  className?: string;
}

export function Layout({ children }: LayoutProps) {
  return <>{children}</>;
}
