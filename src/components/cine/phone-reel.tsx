"use client";

import { useEffect, useRef, useState } from "react";
import { Heart, MessageCircle, Send, Bookmark, Plus, SlidersHorizontal } from "lucide-react";
import { SectionMarker } from "./hud";
import { Parallax } from "./parallax";

/*
  "Street-food reels" — a PINNED, scroll-driven section (mirrors the reference's
  sticky "Reels Stage"). The section is tall; a sticky phone stays centred while
  you scroll, and the active reel advances with scroll progress (not a timer).
  Only the active reel plays. Real Lala Masala Instagram reels (720x1280).
*/

const REELS = [
  { src: "/video/reel-1.mp4", handle: "@lalamasala", caption: "Fresh off the tandoor.", likes: "48.2k", comments: "612", shares: "1.2k" },
  { src: "/video/reel-2.mp4", handle: "@lalamasala", caption: "Street food, made to order.", likes: "21.6k", comments: "204", shares: "540" },
  { src: "/video/reel-3.mp4", handle: "@lalamasala", caption: "The full Lala Masala spread.", likes: "33.1k", comments: "410", shares: "880" },
];

export function PhoneReel() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [i, setI] = useState(0);

  // Drive the active reel from scroll progress through the pinned section.
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const sec = sectionRef.current;
        if (!sec) return;
        const rect = sec.getBoundingClientRect();
        const total = rect.height - window.innerHeight;
        const p = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;
        const idx = Math.min(REELS.length - 1, Math.floor(p * REELS.length));
        setI((cur) => (cur === idx ? cur : idx));
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Play only the active reel.
  useEffect(() => {
    videoRefs.current.forEach((v, idx) => {
      if (!v) return;
      if (idx === i) v.play().catch(() => {});
      else v.pause();
    });
  }, [i]);

  const reel = REELS[i];

  return (
    <section ref={sectionRef} className="relative" style={{ height: `${REELS.length * 95}vh` }}>
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <div className="lm-container">
          <SectionMarker index="02" label="Street-Food Reels" right="Runtime — 0:16 · Ratio 9:16" />
        </div>

        <div className="relative flex flex-1 items-center justify-center">
          {/* Giant two-tone backdrop word split by the phone */}
          <Parallax
            axis="x"
            speed={0.05}
            as="span"
            className="pointer-events-none absolute select-none whitespace-nowrap text-[clamp(3.5rem,15vw,13rem)] font-medium leading-none tracking-tighter text-[color:var(--muted-foreground)]/20"
          >
            Street Food
          </Parallax>

          {/* iPhone */}
          <div className="relative z-10 h-[560px] w-[280px] rounded-[2.6rem] border border-[color:var(--border)] bg-black p-2 shadow-[0_40px_120px_-40px_rgba(0,0,0,0.9)]">
            <div className="relative h-full w-full overflow-hidden rounded-[2.1rem] bg-[color:var(--surface-2)]">
              {REELS.map((r, idx) => (
                // eslint-disable-next-line jsx-a11y/media-has-caption
                <video
                  key={r.src}
                  ref={(el) => {
                    videoRefs.current[idx] = el;
                  }}
                  className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500"
                  style={{ opacity: idx === i ? 1 : 0 }}
                  muted
                  loop
                  playsInline
                  preload={idx === 0 ? "auto" : "metadata"}
                  aria-hidden={idx !== i}
                >
                  <source src={r.src} type="video/mp4" />
                </video>
              ))}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/35" />

              <div className="absolute inset-x-0 top-5 flex items-center justify-center gap-5 text-sm text-white">
                <Plus className="size-4 opacity-80" />
                <span className="font-semibold">Reels</span>
                <span className="opacity-50">Following</span>
                <SlidersHorizontal className="size-4 opacity-80" />
              </div>

              <div className="absolute bottom-24 right-3 flex flex-col items-center gap-4 text-white">
                {[
                  { Icon: Heart, n: reel.likes },
                  { Icon: MessageCircle, n: reel.comments },
                  { Icon: Send, n: reel.shares },
                  { Icon: Bookmark, n: "" },
                ].map(({ Icon, n }, k) => (
                  <div key={k} className="flex flex-col items-center gap-1">
                    <Icon className="size-6 drop-shadow" />
                    {n && <span className="text-[11px] tnum">{n}</span>}
                  </div>
                ))}
              </div>

              <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                <p className="text-sm font-semibold">{reel.handle}</p>
                <p className="mt-1 text-xs text-white/85">{reel.caption}</p>
              </div>

              <div className="absolute inset-x-4 bottom-[70px] flex gap-1">
                {REELS.map((_, k) => (
                  <span
                    key={k}
                    className={`h-0.5 flex-1 rounded-full transition-colors ${k === i ? "bg-white" : "bg-white/30"}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
