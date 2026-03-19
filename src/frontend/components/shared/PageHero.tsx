import React from "react";

/**
 * PageHero — full-bleed gradient header for pages inside AuthenticatedLayout.
 *
 * Uses negative margins to break out of the `<main className="p-4 md:p-6">` padding,
 * so the gradient extends edge-to-edge while the page content stays padded.
 *
 * Usage:
 *   <PageHero gradient="radial-gradient(...)">
 *     <h1>Title</h1>
 *     <StatsCards />
 *   </PageHero>
 */
interface PageHeroProps {
  children: React.ReactNode;
  gradient?: string;           // CSS gradient string
  bgColor?: string;            // fallback plain bg color (e.g. for red emergency hero)
  className?: string;          // padding / overflow classes for the inner container
  style?: React.CSSProperties; // additional inline styles
}

export function PageHero({
  children,
  gradient,
  bgColor,
  className = "pt-8 pb-32 px-6",
  style,
}: PageHeroProps) {
  return (
    <div
      className={`-mx-4 md:-mx-6 -mt-4 md:-mt-6 mb-6 ${className}`}
      style={{
        background: gradient || bgColor || undefined,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
