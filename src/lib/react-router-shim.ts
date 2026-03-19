/**
 * React Router shim — re-exports everything from react-router but replaces
 * useNavigate with a startTransition-wrapped version to prevent
 * "component suspended while responding to synchronous input" errors
 * when navigating to React.lazy routes.
 *
 * Link/NavLink are handled by the `unstable_useTransitions: true` option
 * passed to createBrowserRouter in routes.ts.
 */
// eslint-disable-next-line @typescript-eslint/no-restricted-imports
export * from "react-router-original";

import { useCallback, useTransition } from "react";
// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import { useNavigate as useNavigateOriginal } from "react-router-original";
import type { NavigateOptions, To } from "react-router-original";

export function useNavigate() {
  const navigate = useNavigateOriginal();
  const [, startTransition] = useTransition();

  return useCallback(
    (to: To | number, opts?: NavigateOptions) => {
      startTransition(() => {
        if (typeof to === "number") {
          navigate(to);
        } else {
          navigate(to, opts);
        }
      });
    },
    [navigate, startTransition]
  );
}
