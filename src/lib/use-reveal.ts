"use client";

import { useEffect, useRef } from "react";

/**
 * Reveal-on-scroll: sets data-shown="true" the first time an element enters the
 * viewport. Pairs with the .lm-reveal CSS primitive and is a no-op under
 * prefers-reduced-motion (CSS forces the visible state there).
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.setAttribute("data-shown", "true");
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.05, rootMargin: "0px 0px -18% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}
