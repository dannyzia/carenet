/**
 * Shared Supabase query helpers for all domain services.
 * Provides thin wrappers around dedup + withRetry + getSupabaseClient
 * so each service doesn't have to repeat boilerplate.
 */
import { USE_SUPABASE, getSupabaseClient } from "./supabase";
import { withRetry } from "@/backend/utils/retry";
import { dedup } from "@/backend/utils/dedup";

export { USE_SUPABASE };

const READ_RETRY = {
  maxRetries: 3,
  baseDelayMs: 800,
  onRetry: (_e: unknown, a: number, d: number) =>
    console.log(`[SB] Retry #${a} in ${d}ms`),
};
const WRITE_RETRY = { maxRetries: 2, baseDelayMs: 500 };

/** Get the Supabase client (convenience re-export) */
export const sb = () => getSupabaseClient();

/** Get the current authenticated user's ID. Throws if not authed. */
export async function currentUserId(): Promise<string> {
  const { data: { user } } = await sb().auth.getUser();
  if (!user) throw new Error("Not authenticated");
  return user.id;
}

/**
 * Deduplicated read query with retry.
 * @param key   Dedup key
 * @param fn    Async function that does the Supabase query
 */
export function sbRead<T>(key: string, fn: () => Promise<T>): Promise<T> {
  return dedup(key, () => withRetry(fn, READ_RETRY));
}

/**
 * Write with retry (no dedup — writes are always executed).
 */
export function sbWrite<T>(fn: () => Promise<T>): Promise<T> {
  return withRetry(fn, WRITE_RETRY);
}

/**
 * Select rows from a table, mapping snake_case → camelCase via `mapFn`.
 */
export async function sbSelect<T>(
  table: string,
  mapFn: (row: Record<string, unknown>) => T,
  build?: (q: any) => any,
): Promise<T[]> {
  let q = sb().from(table).select("*");
  if (build) q = build(q);
  const { data, error } = await q;
  if (error) throw error;
  return (data || []).map((d: Record<string, unknown>) => mapFn(d));
}

/**
 * Select a single row from a table.
 */
export async function sbSelectOne<T>(
  table: string,
  mapFn: (row: Record<string, unknown>) => T,
  build?: (q: any) => any,
): Promise<T | null> {
  let q = sb().from(table).select("*");
  if (build) q = build(q);
  q = q.single();
  const { data, error } = await q;
  if (error) {
    if ((error as any).code === "PGRST116") return null; // no rows
    throw error;
  }
  return data ? mapFn(data as Record<string, unknown>) : null;
}
