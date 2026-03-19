import { Suspense } from "react";
import { Outlet } from "react-router";
import { PublicNavBar } from "@/frontend/components/navigation/PublicNavBar";
import { PublicFooter } from "@/frontend/components/navigation/PublicFooter";
import { PageSkeleton } from "@/frontend/components/shared/PageSkeleton";
import { BottomNav } from "@/frontend/components/navigation/BottomNav";

/**
 * PublicLayout — shell for public-facing pages (Home, About, Features, etc.)
 * Provides: PublicNavBar + BottomNav + PublicFooter.
 */
export function PublicLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <PublicNavBar />
      <main className="flex-1 pb-16 md:pb-0">
        <Suspense fallback={<div className="p-6 max-w-5xl mx-auto"><PageSkeleton /></div>}>
          <Outlet />
        </Suspense>
      </main>
      <PublicFooter />
      <BottomNav />
    </div>
  );
}