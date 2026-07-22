"use client";

import { useEffect, useRef } from "react";

/*
  Scroll-scrubbed reveal. Instead of a one-shot fade, each registered element's
  blur/opacity/translate is mapped continuously to its position in the viewport
  — so the de-blur is visible the whole way in, like the reference site.

  A single shared scroll/resize listener drives every element (rAF-batched) so
  the cost stays flat no matter how many reveals are on the page.
*/

type Entry = { el: HTMLElement; blur: boolean };
const entries = new Set<Entry>();
let raf = 0;
let listening = false;

function update() {
  raf = 0;
  const vh = window.innerHeight;
  const start = vh * 0.9; // begins revealing as the top crosses here
  const end = vh * 0.42; // fully revealed once the top reaches here
  for (const e of entries) {
    const rect = e.el.getBoundingClientRect();
    const top = rect.top;
    let p = (start - top) / (start - end);
    // Elements in the last screenful (footer, final rows) can never be scrolled
    // up to the reveal threshold — so once an element is essentially fully in
    // view, treat it as revealed. This fixes the permanently-soft bottom.
    const visible = Math.min(rect.bottom, vh) - Math.max(top, 0);
    const frac = rect.height > 0 ? visible / Math.min(rect.height, vh) : 0;
    if (frac >= 0.85) p = 1;
    p = p < 0 ? 0 : p > 1 ? 1 : p;
    // Reference recipe: opacity fade + scale 1.06→1 + blur 14px→0.
    const scale = (1 + (1 - p) * 0.06).toFixed(4);
    e.el.style.opacity = String(0.04 + p * 0.96);
    e.el.style.transform = `translate3d(0, ${(1 - p) * 34}px, 0) scale(${scale})`;
    // blur={false} frames must actively clear the CSS's initial blur.
    e.el.style.filter = e.blur ? `blur(${((1 - p) * 14).toFixed(2)}px)` : "none";
  }
}

function onScroll() {
  if (!raf) raf = requestAnimationFrame(update);
}

export function useScrub<T extends HTMLElement = HTMLDivElement>(blur = true) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.style.opacity = "1";
      el.style.filter = "none";
      el.style.transform = "none";
      return;
    }
    const entry: Entry = { el, blur };
    entries.add(entry);
    el.style.willChange = "opacity, transform, filter";
    if (!listening) {
      listening = true;
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll);
    }
    onScroll();
    return () => {
      entries.delete(entry);
    };
  }, [blur]);
  return ref;
}
