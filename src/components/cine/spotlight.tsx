"use client";

import { useEffect, useRef } from "react";

/*
  A warm saffron radial glow that follows the pointer within its parent. Drop it
  inside a `position: relative` container. Disabled on touch / reduced-motion.
*/
export function Spotlight() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const parent = el?.parentElement;
    if (!el || !parent) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(hover: none)").matches) return;

    const onMove = (e: PointerEvent) => {
      const r = parent.getBoundingClientRect();
      el.style.setProperty("--mx", `${e.clientX - r.left}px`);
      el.style.setProperty("--my", `${e.clientY - r.top}px`);
      el.setAttribute("data-active", "true");
    };
    const onLeave = () => el.setAttribute("data-active", "false");

    parent.addEventListener("pointermove", onMove);
    parent.addEventListener("pointerleave", onLeave);
    return () => {
      parent.removeEventListener("pointermove", onMove);
      parent.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <div ref={ref} className="lm-spotlight" aria-hidden />;
}
