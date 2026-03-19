/**
 * useDebouncedSearch — debounced search with async fetcher.
 *
 * Debounces the search input and calls the fetcher only after the user
 * stops typing for `delay` ms. Supports the offline-first pattern from
 * the CODING_PLAN (debounced search with Supabase Realtime).
 *
 * Usage:
 *   const { query, setQuery, results, loading } = useDebouncedSearch(
 *     (q) => searchService.globalSearch(q), 300
 *   );
 */
import { useState, useEffect, useRef } from "react";

export interface DebouncedSearchState<T> {
  query: string;
  setQuery: (q: string) => void;
  results: T | null;
  loading: boolean;
  error: Error | null;
}

export function useDebouncedSearch<T>(
  fetcher: (query: string) => Promise<T>,
  delay = 300
): DebouncedSearchState<T> {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    if (!query.trim()) {
      setResults(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    timerRef.current = setTimeout(async () => {
      try {
        const res = await fetcher(query);
        if (mountedRef.current) setResults(res);
      } catch (err) {
        if (mountedRef.current) setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        if (mountedRef.current) setLoading(false);
      }
    }, delay);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, delay]);

  return { query, setQuery, results, loading, error };
}
