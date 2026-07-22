"use client";

import { useState } from "react";
import { Plus, Check } from "lucide-react";
import { useCart } from "@/lib/cart";

/** Compact add-to-cart control shown on each menu dish card. */
export function AddToCart({
  slug,
  name,
  priceCents,
  image,
  disabled,
}: {
  slug: string;
  name: string;
  priceCents: number;
  image?: string | null;
  disabled?: boolean;
}) {
  const add = useCart((s) => s.add);
  const [added, setAdded] = useState(false);

  if (disabled) {
    return <span className="hud rounded-full border border-[color:var(--border)] px-3 py-1.5">Sold out</span>;
  }

  return (
    <button
      type="button"
      onClick={() => {
        add({ slug, name, priceCents, image });
        setAdded(true);
        setTimeout(() => setAdded(false), 1100);
      }}
      aria-label={`Add ${name} to cart`}
      className="inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] border border-[color:var(--border)] px-3 py-1.5 text-sm font-medium transition-colors hover:border-[color:var(--accent)] hover:text-[color:var(--accent)]"
    >
      {added ? <Check className="size-4 text-[color:var(--accent)]" /> : <Plus className="size-4" />}
      {added ? "Added" : "Add"}
    </button>
  );
}
