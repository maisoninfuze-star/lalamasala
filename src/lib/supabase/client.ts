import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./types";

/**
 * Browser Supabase client. Uses the public anon key only — every privileged
 * operation is gated by Row Level Security. Never import the service role key
 * into client code.
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
