import "server-only";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

/**
 * Service-role Supabase client. BYPASSES Row Level Security — use ONLY inside
 * trusted server code (webhooks, order finalisation, seed/migration scripts)
 * after the caller's authorization has been verified. The `server-only` import
 * guarantees this module can never be bundled into client code.
 */
export function createAdminClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not configured");
  }
  return createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
