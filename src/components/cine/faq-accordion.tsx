"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

export interface Faq {
  q: string;
  a: string;
}

export function FaqAccordion({ items }: { items: Faq[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="border-t border-[color:var(--border)]">
      {items.map((f, i) => {
        const isOpen = open === i;
        return (
          <div key={f.q} className="border-b border-[color:var(--border)]">
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center gap-4 py-6 text-left"
            >
              <span className="hud w-8">0{i + 1}</span>
              <span className="flex-1 text-lg font-medium tracking-tight sm:text-xl">{f.q}</span>
              <Plus
                className="size-5 shrink-0 text-[color:var(--accent)] transition-transform duration-300"
                style={{ transform: isOpen ? "rotate(45deg)" : "none" }}
              />
            </button>
            <div
              className="grid transition-all duration-300 ease-out"
              style={{ gridTemplateRows: isOpen ? "1fr" : "0fr", opacity: isOpen ? 1 : 0 }}
            >
              <div className="overflow-hidden">
                <p className="max-w-2xl pb-6 pl-12 text-sm leading-relaxed text-[color:var(--muted-foreground)]">
                  {f.a}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
