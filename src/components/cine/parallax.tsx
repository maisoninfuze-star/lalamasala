"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

/*
  Lightweight scroll-parallax used across the homepage (the reference drifts many
  elements at different rates as they pass through the viewport). A single shared
  scroll listener updates every registered element for performance. Disabled
  under prefers-reduced-motion.
*/

type Item = { el: HTMLElement; speed: number; axis: "y" | "x" };
const items = new Set<Item>();
let started = false;
let raf = 0;

function tick() {
  raf = 0;
  const vh = window.innerHeight;
  items.forEach(({ el, speed, axis }) => {
    const r = el.getBoundingClientRect();
    const offset = r.top + r.height / 2 - vh / 2;
    const d = (-offset * speed).toFixed(1);
    el.style.transform = axis === "x" ? `translate3d(${d}px,0,0)` : `translate3d(0,${d}px,0)`;
  });
}
function onScroll() {
  if (!raf) raf = requestAnimationFrame(tick);
}
function ensureStarted() {
  if (started) return;
  started = true;
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
}

function useParallax<T extends HTMLElement = HTMLDivElement>(speed: number, axis: "y" | "x" = "y") {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    ensureStarted();
    const item: Item = { el, speed, axis };
    items.add(item);
    onScroll();
    return () => {
      items.delete(item);
    };
  }, [speed, axis]);
  return ref;
}

/** Drift any content at a scroll-linked rate (used for backdrop wordmarks, decor). */
export function Parallax({
  children,
  speed = 0.08,
  axis = "y",
  className,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  speed?: number;
  axis?: "y" | "x";
  className?: string;
  as?: React.ElementType;
}) {
  const ref = useParallax(speed, axis);
  return (
    <Tag ref={ref} className={className} style={{ willChange: "transform" }}>
      {children}
    </Tag>
  );
}

/**
 * A fill image that parallaxes vertically WITHIN its (overflow-hidden) frame —
 * the premium "image drifts inside the crop" effect. Drop into any relatively
 * positioned, clipped container.
 */
export function ParallaxImage({
  src,
  alt,
  sizes,
  speed = 0.05,
  priority,
  overlay = true,
}: {
  src: string;
  alt: string;
  sizes?: string;
  speed?: number;
  priority?: boolean;
  overlay?: boolean;
}) {
  const ref = useParallax(speed);
  return (
    <>
      <div ref={ref} className="absolute inset-x-0 -inset-y-[9%]" style={{ willChange: "transform" }}>
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
      </div>
      {overlay && (
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
      )}
    </>
  );
}

/** Count a number up from 0 → target the first time it scrolls into view. */
export function CountUp({
  value,
  suffix = "",
  className,
}: {
  value: number;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.textContent = `${value}${suffix}`;
      return;
    }
    let done = false;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting || done) return;
        done = true;
        io.disconnect();
        const dur = 1100;
        const start = performance.now();
        const step = (now: number) => {
          const p = Math.min(1, (now - start) / dur);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = `${Math.round(value * eased)}${suffix}`;
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value, suffix]);
  return (
    <span ref={ref} className={cn("tnum", className)}>
      0{suffix}
    </span>
  );
}
