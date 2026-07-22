import "server-only";
import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "node:crypto";

/*
  Admin session auth.

  A pragmatic, app-level password gate for the owner dashboard: the password is
  never stored client-side, the session is an HMAC-signed HttpOnly cookie, and
  every admin route verifies it server-side. This is the interim mechanism; in
  production it should be replaced by Supabase Auth + the role tables already in
  the schema (staff_role / user_roles) so individual staff have their own
  accounts and scoped permissions. It deliberately does NOT rely on Vercel
  deployment protection as the security boundary.
*/

const COOKIE = "lm_admin";
const SECRET = process.env.ADMIN_SESSION_SECRET ?? "dev-only-insecure-secret-change-me";
// Dev default so the dashboard is usable immediately; set ADMIN_PASSWORD in prod.
const PASSWORD = process.env.ADMIN_PASSWORD ?? "lalamasala2026";

function sign(value: string): string {
  return createHmac("sha256", SECRET).update(value).digest("hex");
}

function sessionToken(): string {
  return sign("admin-session-v1");
}

export function verifyPassword(input: string): boolean {
  const a = Buffer.from(input);
  const b = Buffer.from(PASSWORD);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function createSession(): Promise<void> {
  const store = await cookies();
  store.set(COOKIE, sessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12, // 12h
  });
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE);
}

export async function isAuthenticated(): Promise<boolean> {
  const store = await cookies();
  const token = store.get(COOKIE)?.value;
  if (!token) return false;
  const expected = sessionToken();
  const a = Buffer.from(token);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}
