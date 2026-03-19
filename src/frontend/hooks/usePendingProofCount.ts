/**
 * usePendingProofCount — returns the current pending billing proof count
 * for sidebar badge display. Subscribes to real-time count changes.
 */
import { useState, useEffect } from "react";
import { getPendingProofCount, onPendingProofCountChange } from "./useBillingNotifications";

export function usePendingProofCount(): number {
  const [count, setCount] = useState(getPendingProofCount);

  useEffect(() => {
    return onPendingProofCountChange(setCount);
  }, []);

  return count;
}
