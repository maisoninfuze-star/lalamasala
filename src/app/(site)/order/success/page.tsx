"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { SectionMarker, Reveal } from "@/components/cine/hud";
import { useCart } from "@/lib/cart";

export default function OrderSuccessPage() {
  const clear = useCart((s) => s.clear);
  // Payment is confirmed server-side by the Stripe webhook; here we simply clear
  // the cart and confirm to the customer.
  useEffect(() => {
    clear();
  }, [clear]);

  return (
    <>
      <header className="lm-container pb-8 pt-36 sm:pt-44">
        <SectionMarker index="00" label="Order Confirmed" right="Thank you" />
      </header>
      <section className="lm-container pb-32">
        <Reveal>
          <div className="mx-auto max-w-lg rounded-[var(--radius-lg)] border border-[color:var(--border)] bg-[color:var(--surface-2)]/40 p-10 text-center">
            <span className="mx-auto grid size-12 place-items-center rounded-full bg-[color:var(--accent)] text-[color:var(--lm-wine)]">
              <Check className="size-6" />
            </span>
            <h1 className="display mt-6 text-4xl">
              Order <span className="lead">received.</span>
            </h1>
            <p className="mt-4 text-[color:var(--muted-foreground)]">
              Thank you — your pickup order is confirmed. We&apos;ll send a confirmation email
              with your order number and pickup time, and let you know the moment it&apos;s ready.
            </p>
            <div className="mt-8 flex justify-center gap-3">
              <Link href="/menu" className="pill">
                Order again
              </Link>
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-[var(--radius-pill)] border border-[color:var(--border)] px-5 py-[0.7rem] text-sm font-medium hover:bg-white/5"
              >
                Back home
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
