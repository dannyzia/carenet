/**
 * useAsyncData — generic hook for fetching data from async service methods.
 *
 * Returns { data, loading, error, refetch } with automatic cleanup on unmount.
 * Designed for the service layer pattern where every service method returns Promise<T>.
 *
 * Usage:
 *   const { data: jobs, loading } = useAsyncData(() => caregiverService.getAvailableJobs());
 */
import { useState, useEffect, useCallback, useRef } from "react";

export interface AsyncDataState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useAsyncData<T>(
  fetcher: () => Promise<T>,
  deps: React.DependencyList = []
): AsyncDataState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const mountedRef = useRef(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetcher();
      if (mountedRef.current) {
        setData(result);
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(err instanceof Error ? err : new Error(String(err)));
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    mountedRef.current = true;
    fetchData();
    return () => {
      mountedRef.current = false;
    };
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
