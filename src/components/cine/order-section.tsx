"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { LOCATIONS, isOpenNow, todayHoursLabel } from "@/data/locations";
import { usePrefs } from "@/lib/store";
import { SectionMarker, Reveal } from "./hud";

export function OrderSection() {
  const { setLocation } = usePrefs();

  return (
    <section className="relative py-24 sm:py-32">
      <div className="lm-container">
        <SectionMarker index="03" label="Order" right="End of reel" />

        <Reveal className="mt-16 max-w-4xl">
          <h2 className="display text-[clamp(2rem,5.5vw,4.75rem)]">
            <span className="lead">Your next Lala Masala craving</span> is closer than you think.
          </h2>
        </Reveal>

        <p className="hud mt-12">Select your kitchen</p>
        <div className="mt-4">
          {LOCATIONS.map((loc, i) => {
            const open = isOpenNow(loc);
            return (
              <Reveal key={loc.slug}>
                <Link
                  href="/menu"
                  onClick={() => setLocation(loc.slug)}
                  className="row-hover group grid grid-cols-[auto_1fr_auto] items-center gap-4 border-t border-[color:var(--border)] py-6 sm:gap-8"
                >
                  <span className="hud w-8">0{i + 1}</span>
                  <div className="min-w-0">
                    <h3 className="text-2xl font-medium tracking-tight transition-colors group-hover:text-[color:var(--accent)] sm:text-3xl">
                      {loc.name}
                    </h3>
                    <p className="mt-1 text-sm text-[color:var(--muted-foreground)]">
                      {loc.addressLine1}, {loc.city} · {todayHoursLabel(loc)}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 sm:gap-8">
                    <span className="hud hidden items-center gap-1.5 sm:inline-flex">
                      <span
                        className={`size-1.5 rounded-full ${open ? "bg-emerald-400" : "bg-[color:var(--faint)]"}`}
                        aria-hidden
                      />
                      {open ? "Open now" : "Closed"}
                    </span>
                    <ArrowUpRight className="size-5 transition-colors group-hover:text-[color:var(--accent)]" />
                  </div>
                </Link>
              </Reveal>
            );
          })}
          <div className="border-t border-[color:var(--border)]" />
        </div>
      </div>
    </section>
  );
}
