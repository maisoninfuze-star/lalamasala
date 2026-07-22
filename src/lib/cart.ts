"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

/*
  Client cart for the pickup ordering flow. Persisted to localStorage so it
  survives navigation/reloads. Prices here are for display only — the server
  ALWAYS recomputes authoritative prices from the database at checkout, so the
  browser is never trusted for money.
*/
export interface CartItem {
  slug: string;
  name: string;
  priceCents: number;
  image?: string | null;
  qty: number;
}

interface CartState {
  items: CartItem[];
  add: (item: Omit<CartItem, "qty">, qty?: number) => void;
  remove: (slug: string) => void;
  setQty: (slug: string, qty: number) => void;
  clear: () => void;
  count: () => number;
  subtotalCents: () => number;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (item, qty = 1) =>
        set((s) => {
          const existing = s.items.find((i) => i.slug === item.slug);
          if (existing) {
            return { items: s.items.map((i) => (i.slug === item.slug ? { ...i, qty: i.qty + qty } : i)) };
          }
          return { items: [...s.items, { ...item, qty }] };
        }),
      remove: (slug) => set((s) => ({ items: s.items.filter((i) => i.slug !== slug) })),
      setQty: (slug, qty) =>
        set((s) => ({
          items:
            qty <= 0
              ? s.items.filter((i) => i.slug !== slug)
              : s.items.map((i) => (i.slug === slug ? { ...i, qty } : i)),
        })),
      clear: () => set({ items: [] }),
      count: () => get().items.reduce((n, i) => n + i.qty, 0),
      subtotalCents: () => get().items.reduce((n, i) => n + i.priceCents * i.qty, 0),
    }),
    { name: "lala-cart" },
  ),
);
