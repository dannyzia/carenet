import { useCallback, useTransition } from "react";
import { useNavigate, type NavigateOptions, type To } from "react-router";

/**
 * Drop-in replacement for useNavigate() that wraps every call in
 * startTransition, preventing the "component suspended while
 * responding to synchronous input" error with React.lazy routes.
 */
export function useTransitionNavigate() {
  const navigate = useNavigate();
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
