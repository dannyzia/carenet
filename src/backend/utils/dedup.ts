/**
 * Request Deduplication
 * ─────────────────────
 * Prevents concurrent identical fetches (e.g. rapid tab switches).
 *
 * If a fetch for key "X" is already in-flight, subsequent calls with the
 * same key return the existing Promise instead of firing a new request.
 * Once the request settles (resolve or reject), the key is freed so
 * the next call will start a fresh request.
 *
 * Usage:
 *   const data = await dedup("wallet:guardian", () => getMyWallet("guardian"));
 */

const _inflight = new Map<string, Promise<unknown>>();

/**
 * Execute `fn` with deduplication by `key`.
 *
 * While a Promise for `key` is still pending, all subsequent calls
 * with the same key return the same Promise (no duplicate request).
 *
 * @param key   Unique identifier for this request (e.g. "wallet:guardian-1")
 * @param fn    The async function to execute
 * @returns     The resolved value of fn()
 */
export function dedup<T>(key: string, fn: () => Promise<T>): Promise<T> {
  const existing = _inflight.get(key);
  if (existing) {
    return existing as Promise<T>;
  }

  const promise = fn().finally(() => {
    // Free the slot once settled (success or error)
    _inflight.delete(key);
  });

  _inflight.set(key, promise);
  return promise;
}

/**
 * Check if a request with the given key is currently in-flight.
 */
export function isInflight(key: string): boolean {
  return _inflight.has(key);
}

/**
 * Cancel / clear a specific in-flight entry (e.g. on unmount).
 * Does NOT abort the underlying fetch — just removes it from the map
 * so the next call will start fresh.
 */
export function clearDedup(key: string): void {
  _inflight.delete(key);
}

/**
 * Clear all in-flight entries. Useful on logout or hard reset.
 */
export function clearAllDedup(): void {
  _inflight.clear();
}

/**
 * Wrap a keyed async function with automatic deduplication.
 *
 * @param keyFn   Derives the dedup key from the function's arguments
 * @param fn      The async function to wrap
 *
 * @example
 * const dedupedGetWallet = withDedup(
 *   (role: string) => `wallet:${role}`,
 *   getMyWallet
 * );
 * // Rapid calls all share one in-flight promise:
 * const [a, b, c] = await Promise.all([
 *   dedupedGetWallet("guardian"),
 *   dedupedGetWallet("guardian"),
 *   dedupedGetWallet("guardian"),
 * ]);
 */
export function withDedup<TArgs extends unknown[], TResult>(
  keyFn: (...args: TArgs) => string,
  fn: (...args: TArgs) => Promise<TResult>
): (...args: TArgs) => Promise<TResult> {
  return (...args: TArgs) => dedup(keyFn(...args), () => fn(...args));
}
