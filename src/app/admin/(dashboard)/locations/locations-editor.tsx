"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Loader2, Check } from "lucide-react";
import { saveLocationAction } from "../../actions";
import type { WeeklyHours } from "@/lib/types";

interface Loc {
  slug: string;
  name: string;
  phone?: string;
  email: string;
  addressLine1?: string;
  addressLine2: string;
  city: string;
  province: string;
  postalCode: string;
  prepTimeMinutes: number;
  payAtPickupEnabled: boolean;
  minimumOrderCents: number;
  orderingPaused: boolean;
  closedNote: string;
  hours: WeeklyHours[];
}

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function Field({
  label,
  value,
  onChange,
  type = "text",
  hint,
}: {
  label: string;
  value: string | number;
  onChange: (v: string) => void;
  type?: string;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium uppercase tracking-wide text-[color:var(--muted-foreground)]">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-[var(--radius-sm)] border border-[color:var(--lm-line)] bg-white px-3 py-2 outline-none focus:border-[color:var(--lm-saffron)]"
      />
      {hint && <span className="mt-1 block text-xs text-[color:var(--muted-foreground)]">{hint}</span>}
    </label>
  );
}

/** Ensure a full 7-day array (Sun→Sat), filling any gaps with a closed day. */
function normalizeHours(hours: WeeklyHours[]): WeeklyHours[] {
  return Array.from({ length: 7 }, (_, day) => {
    const found = hours.find((h) => h.day === day);
    return found ?? { day, open: null, close: null, closed: true };
  });
}

function HoursRow({
  row,
  onChange,
}: {
  row: WeeklyHours;
  onChange: (patch: Partial<WeeklyHours>) => void;
}) {
  const closed = row.closed || !row.open;
  return (
    <div className="flex flex-wrap items-center gap-3 border-t border-[color:var(--lm-line)] py-2.5">
      <span className="w-24 text-sm font-medium">{DAY_NAMES[row.day]}</span>

      <label className="flex items-center gap-2 text-sm text-[color:var(--muted-foreground)]">
        <input
          type="checkbox"
          checked={closed}
          onChange={(e) =>
            onChange(
              e.target.checked
                ? { closed: true, open: null, close: null }
                : { closed: false, open: row.open ?? "11:00", close: row.close ?? "21:00" },
            )
          }
          className="size-4 accent-[color:var(--lm-burgundy)]"
        />
        Closed
      </label>

      {!closed && (
        <div className="flex items-center gap-2">
          <input
            type="time"
            value={row.open ?? ""}
            onChange={(e) => onChange({ open: e.target.value || null })}
            className="rounded-[var(--radius-sm)] border border-[color:var(--lm-line)] bg-white px-2 py-1.5 text-sm outline-none focus:border-[color:var(--lm-saffron)]"
          />
          <span className="text-[color:var(--muted-foreground)]">–</span>
          <input
            type="time"
            value={row.close ?? ""}
            onChange={(e) => onChange({ close: e.target.value || null })}
            className="rounded-[var(--radius-sm)] border border-[color:var(--lm-line)] bg-white px-2 py-1.5 text-sm outline-none focus:border-[color:var(--lm-saffron)]"
          />
        </div>
      )}
    </div>
  );
}

function LocationCard({ initial }: { initial: Loc }) {
  const [loc, setLoc] = useState<Loc>({ ...initial, hours: normalizeHours(initial.hours) });
  const [pending, start] = useTransition();
  const set = <K extends keyof Loc>(k: K, v: Loc[K]) => setLoc((s) => ({ ...s, [k]: v }));

  const setDay = (day: number, patch: Partial<WeeklyHours>) =>
    setLoc((s) => ({
      ...s,
      hours: s.hours.map((h) => (h.day === day ? { ...h, ...patch } : h)),
    }));

  function save() {
    start(async () => {
      try {
        await saveLocationAction(loc.slug, {
          phone: loc.phone,
          email: loc.email,
          addressLine1: loc.addressLine1,
          addressLine2: loc.addressLine2,
          city: loc.city,
          province: loc.province,
          postalCode: loc.postalCode,
          prepTimeMinutes: Number(loc.prepTimeMinutes),
          payAtPickupEnabled: loc.payAtPickupEnabled,
          minimumOrderCents: Math.max(0, Math.round(Number(loc.minimumOrderCents) || 0)),
          orderingPaused: loc.orderingPaused,
          closedNote: loc.closedNote,
          hours: loc.hours,
        });
        toast.success(`${loc.name} updated`);
      } catch {
        toast.error("Could not save. Please try again.");
      }
    });
  }

  return (
    <section className="rounded-[var(--radius-md)] border border-[color:var(--lm-line)] bg-[color:var(--lm-ivory)] p-6">
      <h2 className="font-serif text-2xl">{loc.name}</h2>

      {/* Contact & address */}
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Field label="Phone" value={loc.phone ?? ""} onChange={(v) => set("phone", v)} />
        <Field label="Email" value={loc.email} onChange={(v) => set("email", v)} />
        <Field label="Address" value={loc.addressLine1 ?? ""} onChange={(v) => set("addressLine1", v)} />
        <Field label="Unit / Line 2" value={loc.addressLine2} onChange={(v) => set("addressLine2", v)} />
        <Field label="City" value={loc.city} onChange={(v) => set("city", v)} />
        <Field label="Province" value={loc.province} onChange={(v) => set("province", v)} />
        <Field label="Postal code" value={loc.postalCode} onChange={(v) => set("postalCode", v)} />
        <Field label="Prep time (minutes)" type="number" value={loc.prepTimeMinutes} onChange={(v) => set("prepTimeMinutes", Number(v))} />
        <Field
          label="Minimum order ($)"
          type="number"
          value={(loc.minimumOrderCents / 100) || 0}
          onChange={(v) => set("minimumOrderCents", Math.round((Number(v) || 0) * 100))}
          hint="0 for no minimum. Enforced at checkout."
        />
      </div>

      {/* Opening hours */}
      <div className="mt-6">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-[color:var(--muted-foreground)]">
          Opening hours
        </h3>
        <p className="mb-2 mt-1 text-xs text-[color:var(--muted-foreground)]">
          Shown on your Contact &amp; Locations pages and used for the “Open / Closed” badge.
        </p>
        <div>
          {loc.hours.map((h) => (
            <HoursRow key={h.day} row={h} onChange={(patch) => setDay(h.day, patch)} />
          ))}
        </div>
      </div>

      {/* Operational toggles */}
      <div className="mt-6 space-y-3 rounded-[var(--radius-sm)] border border-[color:var(--lm-line)] bg-white p-4">
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={loc.payAtPickupEnabled}
            onChange={(e) => set("payAtPickupEnabled", e.target.checked)}
            className="size-4 accent-[color:var(--lm-burgundy)]"
          />
          <span className="text-sm">Allow customers to pay at pickup</span>
        </label>

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={loc.orderingPaused}
            onChange={(e) => set("orderingPaused", e.target.checked)}
            className="size-4 accent-[color:var(--lm-crimson)]"
          />
          <span className="text-sm">
            Pause online ordering
            <span className="ml-2 text-xs text-[color:var(--muted-foreground)]">
              (use when you&apos;re slammed or closed)
            </span>
          </span>
        </label>

        {loc.orderingPaused && (
          <Field
            label="Message to show customers"
            value={loc.closedNote}
            onChange={(v) => set("closedNote", v)}
            hint="e.g. “Back at 4pm” or “Closed for the holiday — see you Monday!”"
          />
        )}
      </div>

      <button type="button" onClick={save} disabled={pending} className="lm-btn mt-5 disabled:opacity-60">
        {pending ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
        Save changes
      </button>
    </section>
  );
}

export function LocationsEditor({ locations }: { locations: Loc[] }) {
  return (
    <div className="space-y-6">
      {locations.map((l) => (
        <LocationCard key={l.slug} initial={l} />
      ))}
    </div>
  );
}
