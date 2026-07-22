"use client";

import { useActionState } from "react";
import { Check, Loader2 } from "lucide-react";
import { submitInquiry } from "@/app/(site)/actions";
import { LOCATIONS } from "@/data/locations";
import type { InquiryKind } from "@/lib/inquiries";

const inputCls =
  "w-full rounded-[var(--radius-sm)] border border-[color:var(--border)] bg-[color:var(--surface-2)]/40 px-3.5 py-2.5 text-[color:var(--foreground)] outline-none transition-colors placeholder:text-[color:var(--faint)] focus:border-[color:var(--accent)]";

function Field({ index, label, children }: { index: string; label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="hud">
        <span className="text-[color:var(--accent)]">{index}</span> {label}
      </span>
      <div className="mt-2">{children}</div>
    </label>
  );
}

export function InquiryForm({
  kind,
  eventFields = false,
}: {
  kind: InquiryKind;
  eventFields?: boolean;
}) {
  const [state, action, pending] = useActionState(submitInquiry, null);

  if (state?.ok) {
    return (
      <div className="rounded-[var(--radius-md)] border border-[color:var(--border)] bg-[color:var(--surface-2)]/40 p-8 text-center">
        <span className="mx-auto grid size-11 place-items-center rounded-full bg-[color:var(--accent)] text-[color:var(--lm-wine)]">
          <Check className="size-5" />
        </span>
        <p className="mt-4 font-medium">Thank you — we&apos;ve received your request.</p>
        <p className="mt-1 text-sm text-[color:var(--muted-foreground)]">
          Our team will be in touch shortly.
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="kind" value={kind} />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field index="01" label="Name">
          <input name="name" required autoComplete="name" placeholder="Your name" className={inputCls} />
        </Field>
        <Field index="02" label="Email">
          <input type="email" name="email" required autoComplete="email" placeholder="you@email.com" className={inputCls} />
        </Field>
        <Field index="03" label="Phone">
          <input name="phone" autoComplete="tel" placeholder="Optional" className={inputCls} />
        </Field>
        <Field index="04" label="Location">
          <select name="location" defaultValue="" className={inputCls}>
            <option value="">No preference</option>
            {LOCATIONS.map((l) => (
              <option key={l.slug} value={l.name}>
                {l.name}
              </option>
            ))}
          </select>
        </Field>
        {eventFields && (
          <>
            <Field index="05" label="Event date">
              <input type="date" name="eventDate" className={inputCls} />
            </Field>
            <Field index="06" label="Guests">
              <input type="number" name="guestCount" min="1" placeholder="e.g. 40" className={inputCls} />
            </Field>
          </>
        )}
      </div>
      <Field index={eventFields ? "07" : "05"} label="Message">
        <textarea name="message" rows={4} placeholder="Tell us about your event or request…" className={inputCls} />
      </Field>

      {state?.error && (
        <p role="alert" className="text-sm text-red-400">
          {state.error}
        </p>
      )}

      <button type="submit" disabled={pending} className="pill disabled:opacity-60">
        {pending ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
        Send request
      </button>
    </form>
  );
}
