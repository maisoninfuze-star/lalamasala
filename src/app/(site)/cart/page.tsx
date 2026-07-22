"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { Minus, Plus, X, ShoppingBag, Loader2, Clock } from "lucide-react";
import { SectionMarker, Reveal } from "@/components/cine/hud";
import { useCart } from "@/lib/cart";
import { usePrefs } from "@/lib/store";
import { LOCATIONS } from "@/data/locations";
import { formatMoney } from "@/lib/money";
import { createCheckout } from "../checkout";

export default function CartPage() {
  const { items, setQty, remove, clear } = useCart();
  const { locationSlug, setLocation } = usePrefs();
  const [locSlug, setLocSlug] = useState(locationSlug ?? LOCATIONS[0].slug);
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const loc = LOCATIONS.find((l) => l.slug === locSlug) ?? LOCATIONS[0];
  const subtotal = items.reduce((n, i) => n + i.priceCents * i.qty, 0);
  const tax = Math.round((subtotal * loc.taxRatePercent) / 100);
  const total = subtotal + tax;

  const pickupEta = useMemo(() => {
    const t = new Date(Date.now() + loc.prepTimeMinutes * 60000);
    return t.toLocaleTimeString("en-CA", { hour: "numeric", minute: "2-digit" });
  }, [loc.prepTimeMinutes]);

  function checkout() {
    setError(null);
    setLocation(loc.slug);
    start(async () => {
      const res = await createCheckout({
        items: items.map((i) => ({ slug: i.slug, qty: i.qty })),
        locationSlug: loc.slug,
        pickup: "asap",
      });
      if (res.ok && res.url) window.location.href = res.url;
      else setError(res.error ?? "Checkout failed. Please try again.");
    });
  }

  return (
    <>
      <header className="lm-container pb-8 pt-36 sm:pt-44">
        <SectionMarker index="00" label="Your Order" right="Pickup" />
        <Reveal className="mt-10">
          <h1 className="display text-[clamp(2.5rem,7vw,5rem)]">
            Your <span className="lead">order.</span>
          </h1>
        </Reveal>
      </header>

      {items.length === 0 ? (
        <section className="lm-container pb-32">
          <div className="mx-auto max-w-md rounded-[var(--radius-lg)] border border-dashed border-[color:var(--border)] p-12 text-center">
            <ShoppingBag className="mx-auto size-8 text-[color:var(--accent)]" />
            <p className="mt-4 text-[color:var(--muted-foreground)]">Your cart is empty.</p>
            <Link href="/menu" className="pill mt-6">
              Browse the menu
            </Link>
          </div>
        </section>
      ) : (
        <section className="lm-container grid gap-12 pb-32 lg:grid-cols-[1.4fr_0.9fr]">
          {/* Items */}
          <div>
            <div className="border-t border-[color:var(--border)]">
              {items.map((i) => (
                <div key={i.slug} className="flex flex-wrap items-center gap-x-4 gap-y-3 border-b border-[color:var(--border)] py-5 sm:flex-nowrap">
                  <div className="size-16 shrink-0 overflow-hidden rounded-[var(--radius-sm)] bg-[color:var(--surface-2)]">
                    {i.image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={i.image} alt="" className="h-full w-full object-cover" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1 basis-[calc(100%-5rem)] sm:basis-auto">
                    <p className="truncate font-medium">{i.name}</p>
                    <p className="tnum text-sm text-[color:var(--muted-foreground)]">{formatMoney(i.priceCents)}</p>
                  </div>
                  <div className="flex items-center gap-1 rounded-[var(--radius-pill)] border border-[color:var(--border)] p-1">
                    <button type="button" onClick={() => setQty(i.slug, i.qty - 1)} aria-label="Decrease" className="grid size-8 place-items-center rounded-full hover:bg-white/10">
                      <Minus className="size-3.5" />
                    </button>
                    <span className="tnum w-6 text-center text-sm">{i.qty}</span>
                    <button type="button" onClick={() => setQty(i.slug, i.qty + 1)} aria-label="Increase" className="grid size-8 place-items-center rounded-full hover:bg-white/10">
                      <Plus className="size-3.5" />
                    </button>
                  </div>
                  <span className="tnum hidden w-20 text-right font-medium sm:block">{formatMoney(i.priceCents * i.qty)}</span>
                  <button type="button" onClick={() => remove(i.slug)} aria-label="Remove" className="ml-auto grid size-9 place-items-center rounded-full text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)] sm:ml-0">
                    <X className="size-4" />
                  </button>
                </div>
              ))}
            </div>
            <button type="button" onClick={clear} className="hud mt-4 hover:text-[color:var(--foreground)]">
              Clear cart
            </button>
          </div>

          {/* Summary */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-[var(--radius-md)] border border-[color:var(--border)] bg-[color:var(--surface-2)]/40 p-6">
              <label className="block">
                <span className="hud">Pickup location</span>
                <select
                  value={loc.slug}
                  onChange={(e) => setLocSlug(e.target.value)}
                  className="mt-2 w-full rounded-[var(--radius-sm)] border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-2.5 outline-none focus:border-[color:var(--accent)]"
                >
                  {LOCATIONS.map((l) => (
                    <option key={l.slug} value={l.slug}>
                      {l.name} — {l.city}
                    </option>
                  ))}
                </select>
              </label>

              <p className="mt-4 flex items-center gap-2 text-sm text-[color:var(--muted-foreground)]">
                <Clock className="size-4 text-[color:var(--accent)]" />
                Pickup ASAP — ready ≈ {pickupEta}
              </p>

              <dl className="mt-6 space-y-2 border-t border-[color:var(--border)] pt-5 text-sm">
                <div className="flex justify-between">
                  <dt className="text-[color:var(--muted-foreground)]">Subtotal</dt>
                  <dd className="tnum">{formatMoney(subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-[color:var(--muted-foreground)]">Tax ({loc.taxRatePercent}%)</dt>
                  <dd className="tnum">{formatMoney(tax)}</dd>
                </div>
                <div className="flex justify-between border-t border-[color:var(--border)] pt-3 text-base font-medium">
                  <dt>Total</dt>
                  <dd className="tnum">{formatMoney(total)}</dd>
                </div>
              </dl>

              {error && (
                <p role="alert" className="mt-4 text-sm text-red-400">
                  {error}
                </p>
              )}

              <button type="button" onClick={checkout} disabled={pending} className="pill mt-6 w-full justify-center disabled:opacity-60">
                {pending ? <Loader2 className="size-4 animate-spin" /> : null}
                Checkout — {formatMoney(total)}
              </button>
              <p className="hud mt-3 text-center">Secure payment · Pay online</p>
            </div>
          </aside>
        </section>
      )}
    </>
  );
}
