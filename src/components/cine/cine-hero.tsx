"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, ArrowDown } from "lucide-react";
import { Spotlight } from "./spotlight";
import { Magnetic } from "./magnetic";

// Spices-morph hero: floating spices resolve into a butter-chicken-style paneer
// makhani. Plays once and rests on the dish. Poster = spices (video start);
// static/mobile = the finished dish.
const VIDEO = "/video/hero-lux.mp4";
const POSTER = "/img/brand/hero-lux-start.jpg";
const STILL = "/img/brand/hero-lux-end.jpg";

export function CineHero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [motionVideo, setMotionVideo] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isDesktop = window.matchMedia("(min-width: 768px)").matches;
    const conn = (navigator as { connection?: { saveData?: boolean } }).connection;
    setMotionVideo(!reduce && isDesktop && !conn?.saveData);
    if (reduce) return;

    // Parallax: spices drift up + slightly out of focus as you scroll away.
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        const p = Math.min(y / 800, 1);
        if (bgRef.current) {
          bgRef.current.style.transform = `translate3d(0, ${y * 0.35}px, 0) scale(${1.08 + p * 0.08})`;
        }
        if (contentRef.current) {
          contentRef.current.style.transform = `translate3d(0, ${y * 0.12}px, 0)`;
          contentRef.current.style.opacity = String(1 - p * 0.9);
        }
        // Pause the pinned video once it's covered by the content slab.
        if (videoRef.current) {
          if (y > window.innerHeight * 1.3) videoRef.current.pause();
          else videoRef.current.play().catch(() => {});
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    if (motionVideo) videoRef.current?.play().catch(() => {});
  }, [motionVideo]);

  return (
    <section className="sticky top-0 z-0 flex h-[100svh] flex-col justify-end overflow-hidden">
      {/* Background: cinematic spice video (poster fallback on mobile/reduced) */}
      <div ref={bgRef} className="absolute inset-0 will-change-transform" style={{ transform: "scale(1.08)" }}>
        {motionVideo ? (
          // eslint-disable-next-line jsx-a11y/media-has-caption
          <video
            ref={videoRef}
            className="h-full w-full object-cover"
            autoPlay
            muted
            playsInline
            poster={POSTER}
            onCanPlay={(e) => e.currentTarget.play().catch(() => {})}
          >
            <source src={VIDEO} type="video/mp4" />
          </video>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={STILL} alt="A plated Lala Masala dish in warm candlelight" className="h-full w-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--background)] via-[color:var(--background)]/45 to-[color:var(--background)]/30" />
      </div>

      {/* Warm cursor spotlight */}
      <Spotlight />

      {/* HUD corner label */}
      <div className="lm-container relative z-10 pt-28">
        <span className="hud">(00) — Lala Masala · Est. MMXX</span>
      </div>

      {/* Bottom content */}
      <div ref={contentRef} className="lm-container relative z-10 pb-24 will-change-transform">
        <h1 className="display max-w-4xl text-[clamp(2.75rem,8vw,7rem)]">
          <span className="lead">Indian flavour,</span> served{" "}
          <span className="lead">from the heart.</span>
        </h1>
        <p className="mt-7 max-w-md text-[15px] leading-relaxed text-[color:var(--muted-foreground)]">
          A family legacy of vegetarian recipes, vibrant street food and
          unforgettable masala.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Magnetic>
            <Link href="/menu" className="pill">
              Order for Pickup <ArrowUpRight className="size-4" />
            </Link>
          </Magnetic>
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 rounded-[var(--radius-pill)] border border-[color:var(--border)] px-5 py-[0.7rem] text-sm font-medium text-[color:var(--foreground)] transition-colors hover:bg-white/5"
          >
            Explore the Menu
          </Link>
          <span className="hud ml-1">Montreal · Kingston · Belleville</span>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="pointer-events-none absolute bottom-6 right-8 z-10 hidden items-center gap-2 md:flex">
        <span className="hud">Scroll</span>
        <ArrowDown className="size-4 animate-bounce text-[color:var(--faint)]" aria-hidden />
      </div>
    </section>
  );
}
