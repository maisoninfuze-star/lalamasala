"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, MapPin } from "lucide-react";
import { LOCATIONS, isOpenNow } from "@/data/locations";
import { usePrefs } from "@/lib/store";

/*
  First-visit location chooser. Appears when no location has been selected yet
  (the choice persists in localStorage via usePrefs), so returning visitors who
  already picked a kitchen never see it again. Dismissable.
*/
export function LocationGate() {
  const { locationSlug, setLocation } = usePrefs();
  const [mounted, setMounted] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      if (sessionStorage.getItem("lala-gate-skipped")) setDismissed(true);
    } catch {
      /* ignore private-mode storage errors */
    }
  }, []);
  useEffect(() => {
    document.body.style.overflow = mounted && !locationSlug && !dismissed ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mounted, locationSlug, dismissed]);

  if (!mounted || locationSlug || dismissed) return null;

  return (
    <div className="lm-gate fixed inset-0 z-[70] grid place-items-center bg-[color:var(--background)]/96 p-5 backdrop-blur-md">
      <div className="w-full max-w-lg">
        <p className="hud text-center">Welcome to Lala Masala</p>
        <h2 className="display mt-3 text-center text-[clamp(2rem,7vw,3.25rem)]">
          Choose your <span className="lead">kitchen.</span>
        </h2>
        <p className="mx-auto mt-3 max-w-xs text-center text-sm text-[color:var(--muted-foreground)]">
          Pick your nearest location to see its menu and order for pickup.
        </p>

        <ul className="mt-8 space-y-3">
          {LOCATIONS.map((loc, i) => {
            const open = isOpenNow(loc);
            return (
              <li key={loc.slug}>
                <button
                  type="button"
                  onClick={() => setLocation(loc.slug)}
                  className="group flex w-full items-center gap-4 rounded-[var(--radius-md)] border border-[color:var(--border)] bg-[color:var(--surface-2)]/40 p-4 text-left transition-colors hover:border-[color:var(--accent)]"
                >
                  <span className="hud w-6">0{i + 1}</span>
                  <MapPin className="size-4 shrink-0 text-[color:var(--accent)]" aria-hidden />
                  <span className="flex-1">
                    <span className="block font-medium">{loc.name}</span>
                    <span className="block text-xs text-[color:var(--muted-foreground)]">
                      {loc.addressLine1}, {loc.city}, {loc.province}
                    </span>
                  </span>
                  <span className="hud hidden items-center gap-1.5 sm:inline-flex">
                    <span
                      className={`size-1.5 rounded-full ${open ? "bg-emerald-400" : "bg-[color:var(--faint)]"}`}
                      aria-hidden
                    />
                    {open ? "Open" : "Closed"}
                  </span>
                  <ArrowUpRight className="size-5 shrink-0 transition-colors group-hover:text-[color:var(--accent)]" />
                </button>
              </li>
            );
          })}
        </ul>

        <button
          type="button"
          onClick={() => {
            try {
              sessionStorage.setItem("lala-gate-skipped", "1");
            } catch {
              /* ignore */
            }
            setDismissed(true);
          }}
          className="hud mx-auto mt-6 block hover:text-[color:var(--foreground)]"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}
