/**
 * useDebouncedValue — Debounces a value by a configurable delay.
 *
 * Usage:
 *   const [search, setSearch] = useState("");
 *   const debouncedSearch = useDebouncedValue(search, 300);
 *   // debouncedSearch updates 300ms after the last search change
 */

import { useState, useEffect } from "react";

export function useDebouncedValue<T>(value: T, delayMs: number = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}
