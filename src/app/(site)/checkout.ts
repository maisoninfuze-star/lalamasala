"use server";

import Stripe from "stripe";
import { z } from "zod";
import { getMenu, getLocations } from "@/lib/menu-data";

/*
  Pickup checkout. The browser sends only slugs + quantities; the server
  recomputes authoritative prices and tax from the menu data, then creates a
  Stripe Checkout Session. Money is never trusted from the client.
  Requires STRIPE_SECRET_KEY; without it we return the computed totals + a clear
  message so the cart still works for review.
*/
const schema = z.object({
  items: z.array(z.object({ slug: z.string(), qty: z.number().int().min(1).max(50) })).min(1),
  locationSlug: z.string().min(1),
  pickup: z.string().max(40).optional(),
});

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3210";

export async function createCheckout(input: unknown) {
  const parsed = schema.safeParse(input);
  if (!parsed.success) return { ok: false as const, error: "Something's off with your order." };
  const { items, locationSlug, pickup } = parsed.data;

  const [{ dishes }, locations] = await Promise.all([getMenu(), getLocations()]);
  const loc = locations.find((l) => l.slug === locationSlug);
  if (!loc) return { ok: false as const, error: "Please choose a pickup location." };

  if (loc.orderingPaused) {
    return {
      ok: false as const,
      error: loc.closedNote?.trim() || `Online ordering at ${loc.name} is paused right now.`,
    };
  }

  const lineItems = items
    .map((it) => {
      const d = dishes.find((x) => x.slug === it.slug && x.isActive && !x.isSoldOut);
      return d ? { name: d.name.en, unitAmount: d.basePriceCents, quantity: it.qty } : null;
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);

  if (!lineItems.length) return { ok: false as const, error: "Your items are no longer available." };

  const subtotalCents = lineItems.reduce((n, li) => n + li.unitAmount * li.quantity, 0);
  const taxCents = Math.round((subtotalCents * loc.taxRatePercent) / 100);
  const totalCents = subtotalCents + taxCents;

  if (loc.minimumOrderCents && subtotalCents < loc.minimumOrderCents) {
    return {
      ok: false as const,
      error: `Minimum order at ${loc.name} is $${(loc.minimumOrderCents / 100).toFixed(0)}.`,
    };
  }

  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    return {
      ok: false as const,
      error: "Online payment isn't connected yet — add STRIPE_SECRET_KEY to enable checkout.",
      subtotalCents,
      taxCents,
      totalCents,
    };
  }

  const stripe = new Stripe(key);
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      ...lineItems.map((li) => ({
        price_data: {
          currency: "cad",
          product_data: { name: li.name },
          unit_amount: li.unitAmount,
        },
        quantity: li.quantity,
      })),
      {
        price_data: { currency: "cad", product_data: { name: "Tax" }, unit_amount: taxCents },
        quantity: 1,
      },
    ],
    success_url: `${SITE}/order/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${SITE}/cart`,
    metadata: { locationSlug, pickup: pickup ?? "asap" },
  });

  return { ok: true as const, url: session.url };
}
