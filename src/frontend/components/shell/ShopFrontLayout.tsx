import { Suspense } from "react";
import { Outlet } from "react-router";
import { PublicNavBar } from "@/frontend/components/navigation/PublicNavBar";
import { PublicFooter } from "@/frontend/components/navigation/PublicFooter";
import { PageSkeleton } from "@/frontend/components/shared/PageSkeleton";

/**
 * ShopFrontLayout — shell for customer-facing shop pages (browse, cart, checkout).
 * Same as PublicLayout for now; can diverge later with cart icon in nav, etc.
 * BottomNav is NOT rendered here — it only appears inside AuthenticatedLayout.
 */
export function ShopFrontLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <PublicNavBar />
      <main className="flex-1">
        <Suspense fallback={<div className="p-6 max-w-5xl mx-auto"><PageSkeleton /></div>}>
          <Outlet />
        </Suspense>
      </main>
      <PublicFooter />
    </div>
  );
}