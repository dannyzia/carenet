import { useEffect } from "react";
import { Outlet, useLocation } from "react-router";
import { useGlobalChannelHealthToast } from "@/frontend/hooks/useGlobalChannelHealthToast";
import { useBillingNotifications } from "@/frontend/hooks/useBillingNotifications";
import { useOptimisticUndo } from "@/frontend/hooks/useOptimisticUndo";
import { UndoHint } from "@/frontend/components/shared/UndoHint";

/**
 * RootLayout — bare wrapper at the route tree root.
 * ThemeProvider is applied in App.tsx.
 * Navigation is handled by child layout routes (PublicLayout, AuthenticatedLayout, etc.)
 *
 * Hosts the global channel health toast hook so that any Realtime channel
 * degradation (healthy -> stale -> dead) fires a user-visible toast
 * regardless of which page the user is currently viewing.
 *
 * Also hosts useBillingNotifications to surface billing Realtime events
 * as Sonner toasts across all authenticated pages.
 *
 * Clears stale undo entries on route navigation so optimistic rollbacks
 * from a previous page don't leak into unrelated pages.
 */
export function RootLayout() {
  useGlobalChannelHealthToast();
  useBillingNotifications();

  const { clearUndo, undoHint } = useOptimisticUndo();
  const location = useLocation();

  // Flush stale undo entries whenever the route changes
  useEffect(() => {
    clearUndo();
  }, [location.pathname]);

  return (
    <>
      <Outlet />
      <UndoHint visible={undoHint.visible} label={undoHint.label} />
    </>
  );
}
