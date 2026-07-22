"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/*
  An original page-turn "storybook". Not the Framer InteractiveBook (that was an
  image-only, fixed-size flipbook that needed the Framer runtime) — this is built
  from scratch on our own stack so every page is real, selectable, translatable,
  crawlable HTML themed to the site.

    • Desktop (≥768px): a true 3D book. Each leaf rotates around the spine; the
      front face is a recto, the back face a verso, so pages turn like paper.
    • Mobile (<768px): a swipeable single-page reader (a 3D spread is unreadable
      on a phone).
    • SSR / no-JS / crawlers: a plain vertical stack of every page, in order.

  The first client render matches the SSR stack, then an effect upgrades to the
  interactive book/reader — so there is no hydration mismatch.
*/

export type StoryPage = {
  tone?: "cover" | "paper";
  folio?: string;
  content: React.ReactNode;
};

export function Storybook({ pages }: { pages: StoryPage[] }) {
  const [mounted, setMounted] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia("(min-width: 768px)");
    const sync = () => setIsDesktop(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  if (!mounted) return <StaticStack pages={pages} />;
  return isDesktop ? <Book pages={pages} /> : <Reader pages={pages} />;
}

/* ------------------------------- Desktop 3D book ------------------------------- */

function Book({ pages }: { pages: StoryPage[] }) {
  const leaves: [StoryPage | undefined, StoryPage | undefined][] = [];
  for (let i = 0; i < pages.length; i += 2) leaves.push([pages[i], pages[i + 1]]);
  const leafCount = leaves.length;

  const [current, setCurrent] = useState(0); // number of leaves turned
  const [anim, setAnim] = useState<number | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const turn = useCallback(
    (dir: 1 | -1) => {
      setCurrent((c) => {
        const next = Math.min(leafCount, Math.max(0, c + dir));
        if (next !== c) {
          setAnim(dir > 0 ? c : c - 1); // keep the moving leaf on top
          if (timer.current) clearTimeout(timer.current);
          timer.current = setTimeout(() => setAnim(null), 950);
        }
        return next;
      });
    },
    [leafCount],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") turn(1);
      else if (e.key === "ArrowLeft") turn(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      if (timer.current) clearTimeout(timer.current);
    };
  }, [turn]);

  const closed = current === 0;
  const ended = current === leafCount;
  const shift = closed ? "-25%" : ended ? "25%" : "0%";

  return (
    <div className="storybook flex flex-col items-center">
      <div className="flex w-full items-center justify-center gap-3 sm:gap-6">
        <button className="sb-arrow" onClick={() => turn(-1)} disabled={closed} aria-label="Previous page">
          <ChevronLeft className="size-5" />
        </button>

        <div className="sb-book" style={{ transform: `translateX(${shift})` }}>
          {leaves.map((leaf, i) => {
            const flipped = i < current;
            const z = i === anim ? leafCount + 10 : flipped ? i : leafCount - i;
            return (
              <div key={i} className={cn("sb-leaf", flipped && "flip")} style={{ zIndex: z }}>
                <div className="sb-face front">
                  <PageFace page={leaf[0]} />
                </div>
                <div className="sb-face back">
                  <PageFace page={leaf[1]} />
                </div>
              </div>
            );
          })}
        </div>

        <button className="sb-arrow" onClick={() => turn(1)} disabled={ended} aria-label="Next page">
          <ChevronRight className="size-5" />
        </button>
      </div>

      <div className="mt-8 flex items-center gap-4">
        <span className="hud tnum">
          {String(current).padStart(2, "0")} / {String(leafCount).padStart(2, "0")}
        </span>
        <div className="sb-dots">
          {Array.from({ length: leafCount + 1 }).map((_, i) => (
            <button
              key={i}
              className={cn("sb-dot", i === current && "on")}
              aria-label={`Turn to spread ${i + 1}`}
              onClick={() => setCurrent(i)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function PageFace({ page }: { page?: StoryPage }) {
  if (!page) return <div className="sb-page" aria-hidden />;
  return (
    <div className={cn("sb-page", page.tone === "cover" && "cover")}>
      {page.content}
      {page.tone !== "cover" && (
        <div className="sb-folio">
          <span>Lala&nbsp;Masala</span>
          <span>{page.folio ?? ""}</span>
        </div>
      )}
    </div>
  );
}

/* ------------------------------- Mobile reader ------------------------------- */

function Reader({ pages }: { pages: StoryPage[] }) {
  const [i, setI] = useState(0);
  const startX = useRef<number | null>(null);
  const total = pages.length;
  const go = (d: number) => setI((v) => Math.min(total - 1, Math.max(0, v + d)));

  return (
    <div className="storybook flex flex-col items-center">
      <div
        className="sb-reader"
        onPointerDown={(e) => (startX.current = e.clientX)}
        onPointerUp={(e) => {
          if (startX.current === null) return;
          const dx = e.clientX - startX.current;
          startX.current = null;
          if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
        }}
      >
        <div className="sb-track" style={{ transform: `translateX(-${i * 100}%)` }}>
          {pages.map((p, idx) => (
            <div className="sb-card" key={idx}>
              <div className={cn("sb-page", p.tone === "cover" && "cover")}>
                {p.content}
                {p.tone !== "cover" && (
                  <div className="sb-folio">
                    <span>Lala&nbsp;Masala</span>
                    <span>{p.folio ?? ""}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex items-center gap-4">
        <button className="sb-arrow" onClick={() => go(-1)} disabled={i === 0} aria-label="Previous page">
          <ChevronLeft className="size-5" />
        </button>
        <span className="hud tnum">
          {String(i + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
        <button className="sb-arrow" onClick={() => go(1)} disabled={i === total - 1} aria-label="Next page">
          <ChevronRight className="size-5" />
        </button>
      </div>
    </div>
  );
}

/* --------------------------- SSR / no-JS fallback --------------------------- */

function StaticStack({ pages }: { pages: StoryPage[] }) {
  return (
    <div className="storybook">
      <div className="sb-stack mx-auto max-w-md">
        {pages.map((p, i) => (
          <div key={i} className={cn("sb-page", p.tone === "cover" && "cover")}>
            {p.content}
          </div>
        ))}
      </div>
    </div>
  );
}
