"use client";

import { useActionState } from "react";
import { loginAction } from "../actions";

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, null);

  return (
    <main className="grid min-h-screen place-items-center bg-[color:var(--lm-wine)] px-4">
      <div className="w-full max-w-sm rounded-[var(--radius-lg)] bg-[color:var(--lm-ivory)] p-8 shadow-[var(--shadow-float)]">
        <div className="flex items-center gap-2">
          <span className="grid size-9 place-items-center rounded-full bg-[color:var(--lm-burgundy)] font-serif text-lg text-ivory">
            L
          </span>
          <span className="font-serif text-xl text-[color:var(--lm-charcoal)]">Lala Masala</span>
        </div>
        <h1 className="mt-6 font-serif text-2xl text-[color:var(--lm-charcoal)]">
          Owner Dashboard
        </h1>
        <p className="mt-1 text-sm text-[color:var(--muted-foreground)]">
          Sign in to manage your menu, photos and locations.
        </p>

        <form action={formAction} className="mt-6 space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-[color:var(--lm-charcoal)]">Password</span>
            <input
              type="password"
              name="password"
              required
              autoFocus
              autoComplete="current-password"
              className="mt-1.5 w-full rounded-[var(--radius-sm)] border border-[color:var(--border)] bg-white px-3 py-2.5 text-[color:var(--lm-charcoal)] outline-none focus:border-[color:var(--lm-saffron)] focus:ring-2 focus:ring-[color:var(--lm-saffron)]/40"
            />
          </label>
          {state?.error && (
            <p role="alert" className="text-sm text-red-700">
              {state.error}
            </p>
          )}
          <button
            type="submit"
            disabled={pending}
            className="lm-btn w-full disabled:opacity-60"
          >
            {pending ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </main>
  );
}
