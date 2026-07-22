"use client";

import { useRef, type ReactNode } from "react";

/*
  Magnetic hover: the child gently drifts toward the cursor while hovered and
  springs back on leave. A premium micro-interaction for primary CTAs. Disabled
  on touch / reduced-motion (renders a plain inline-flex wrapper).
*/
export function Magnetic({
  children,
  strength = 0.35,
  className,
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  function onMove(e: React.PointerEvent) {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce), (hover: none)").matches) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width / 2)) * strength;
    const y = (e.clientY - (r.top + r.height / 2)) * strength;
    el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
  }
  function reset() {
    if (ref.current) ref.current.style.transform = "translate3d(0,0,0)";
  }

  return (
    <span
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      className={className}
      style={{ display: "inline-flex", transition: "transform 0.45s cubic-bezier(0.16,1,0.3,1)", willChange: "transform" }}
    >
      {children}
    </span>
  );
}
