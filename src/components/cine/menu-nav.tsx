"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

/*
  Sticky menu category nav with scroll-spy: the active category highlights as
  you scroll past its section (IntersectionObserver), and clicking scrolls to it.
*/
export function MenuNav({
  categories,
  orderUrl,
}: {
  categories: { slug: string; name: string }[];
  orderUrl?: string;
}) {
  const [active, setActive] = useState(categories[0]?.slug);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );
    categories.forEach((c) => {
      const el = document.getElementById(c.slug);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [categories]);

  return (
    <div className="sticky top-[var(--header-h)] z-30 border-y border-[color:var(--border)] bg-[color:var(--background)]/90 backdrop-blur">
      <div className="lm-container flex items-center gap-4 py-3">
        <nav className="flex flex-1 gap-1 overflow-x-auto" aria-label="Menu categories">
          {categories.map((c) => (
            <a
              key={c.slug}
              href={`#${c.slug}`}
              className={cn(
                "hud whitespace-nowrap rounded-full px-3 py-1.5 transition-colors",
                active === c.slug
                  ? "bg-[color:var(--accent)] !text-[color:var(--lm-wine)]"
                  : "hover:text-[color:var(--foreground)]",
              )}
            >
              {c.name}
            </a>
          ))}
        </nav>
        {orderUrl && (
          <a
            href={orderUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden shrink-0 items-center gap-1.5 rounded-[var(--radius-pill)] bg-[color:var(--accent)] px-4 py-2 text-sm font-medium text-[color:var(--lm-wine)] sm:inline-flex"
          >
            Order online <ArrowUpRight className="size-4" />
          </a>
        )}
      </div>
    </div>
  );
}
