/**
 * register-device — Supabase Edge Function
 * ──────────────────────────────────────────
 * Registers or re-activates an FCM/APNs device token for push notifications.
 * Called by the Capacitor app on launch after obtaining a push token.
 *
 * POST body:
 *   { platform: "fcm" | "apns", token: string }
 *
 * Auth: Bearer token (Supabase JWT)
 *
 * Logic:
 *   - If the (user_id, token) pair already exists, set active = true + update timestamp
 *   - Otherwise, insert a new row
 *   - Deactivate any tokens for the same user + platform that are older than 90 days
 *
 * Deployment:
 *   supabase functions deploy register-device
 */

// @ts-ignore Deno import
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
// @ts-ignore Deno import
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

// ─── CORS ───

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// ─── Types ───

interface RegisterPayload {
  platform: "fcm" | "apns";
  token: string;
}

// ─── Main handler ───

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS });
  }

  if (req.method !== "POST") {
    return jsonError("Method not allowed", 405);
  }

  try {
    // ── 1. Validate JWT ──
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return jsonError("Missing or invalid Authorization header", 401);
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    const callerClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const {
      data: { user },
      error: authError,
    } = await callerClient.auth.getUser();

    if (authError || !user) {
      return jsonError("Invalid or expired token", 401);
    }

    // ── 2. Parse & validate body ──
    const payload: RegisterPayload = await req.json();

    if (!payload.platform || !payload.token) {
      return jsonError("Missing required fields: platform, token", 400);
    }

    if (payload.platform !== "fcm" && payload.platform !== "apns") {
      return jsonError('platform must be "fcm" or "apns"', 400);
    }

    if (payload.token.length < 10) {
      return jsonError("Token appears invalid (too short)", 400);
    }

    // ── 3. Upsert device token ──
    const adminClient = createClient(supabaseUrl, supabaseServiceKey);
    const now = new Date().toISOString();

    // Check if the (user_id, token) pair already exists
    const { data: existing } = await adminClient
      .from("device_tokens")
      .select("id, active")
      .eq("user_id", user.id)
      .eq("token", payload.token)
      .single();

    let action: "inserted" | "reactivated" | "already_active";

    if (existing) {
      if (existing.active) {
        // Already registered and active — just update timestamp
        await adminClient
          .from("device_tokens")
          .update({ updated_at: now })
          .eq("id", existing.id);
        action = "already_active";
      } else {
        // Was deactivated — reactivate
        await adminClient
          .from("device_tokens")
          .update({ active: true, updated_at: now })
          .eq("id", existing.id);
        action = "reactivated";
      }
    } else {
      // New token — insert
      const { error: insertError } = await adminClient
        .from("device_tokens")
        .insert({
          user_id: user.id,
          platform: payload.platform,
          token: payload.token,
          active: true,
          created_at: now,
          updated_at: now,
        });

      if (insertError) {
        console.error("[register-device] Insert error:", insertError);
        return jsonError(
          `Failed to register device: ${insertError.message}`,
          500
        );
      }
      action = "inserted";
    }

    // ── 4. Cleanup: deactivate stale tokens (>90 days old) ──
    const ninetyDaysAgo = new Date(
      Date.now() - 90 * 24 * 60 * 60 * 1000
    ).toISOString();

    const { data: staleTokens } = await adminClient
      .from("device_tokens")
      .select("id")
      .eq("user_id", user.id)
      .eq("platform", payload.platform)
      .eq("active", true)
      .lte("updated_at", ninetyDaysAgo);

    let staleCount = 0;
    if (staleTokens && staleTokens.length > 0) {
      for (const stale of staleTokens) {
        await adminClient
          .from("device_tokens")
          .update({ active: false })
          .eq("id", (stale as { id: string }).id);
        staleCount++;
      }
    }

    return jsonOk({
      status: "ok",
      action,
      stale_tokens_deactivated: staleCount,
    });
  } catch (err) {
    console.error("[register-device] Unhandled error:", err);
    return jsonError("Internal server error", 500);
  }
});

// ─── Response helpers ───

function jsonOk(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
  });
}

function jsonError(message: string, status: number) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
  });
}
