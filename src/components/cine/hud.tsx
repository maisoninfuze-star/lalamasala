"use client";

import { useScrub } from "@/lib/scrub";
import { cn } from "@/lib/utils";

/*
  Shared "film-reel HUD" primitives used across the cinematic homepage:
  section markers, blur-reveal wrapper and viewfinder framing.
*/

/** Top-of-section rule with center crosshair + mono labels (left index, right meta). */
export function SectionMarker({
  index,
  label,
  right,
  className,
}: {
  index: string;
  label: string;
  right?: string;
  className?: string;
}) {
  return (
    <div className={cn("relative", className)}>
      <div className="hud-rule">
        <span className="hud-cross" aria-hidden />
      </div>
      <div className="mt-3 flex items-center justify-between gap-3">
        <span className="hud">
          ({index}) — {label}
        </span>
        {right && <span className="hud hidden text-right sm:inline">{right}</span>}
      </div>
    </div>
  );
}

/**
 * Scroll-scrubbed blur-in reveal (the reference's signature motion). Set
 * `blur={false}` on large image frames to scrub opacity/translate only.
 */
export function Reveal({
  children,
  className,
  blur = true,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  blur?: boolean;
  as?: React.ElementType;
}) {
  const ref = useScrub<HTMLElement>(blur);
  return (
    <Tag ref={ref} className={cn("blur-reveal", className)}>
      {children}
    </Tag>
  );
}

/** Wrap media in camera-viewfinder corner brackets. */
export function Viewfinder({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("viewfinder overflow-hidden", className)}>
      <span className="vf-b" aria-hidden />
      {children}
    </div>
  );
}

/** Mono caption row under a framed media, e.g. "● paneer-tikka  ·  VEG · TANDOOR". */
export function MediaCaption({
  left,
  right,
}: {
  left: string;
  right?: string;
}) {
  return (
    <div className="mt-3 flex items-center justify-between">
      <span className="hud inline-flex items-center gap-2">
        <span className="size-1.5 rounded-full bg-[color:var(--accent)]" aria-hidden />
        {left}
      </span>
      {right && <span className="hud">{right}</span>}
    </div>
  );
}
