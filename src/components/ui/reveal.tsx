"use client";

import { useReveal } from "@/lib/use-reveal";
import { cn } from "@/lib/utils";

/** Wraps children in a scroll-reveal container with optional stagger delay. */
export function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: React.ElementType;
}) {
  const ref = useReveal<HTMLElement>();
  return (
    <Tag
      ref={ref}
      className={cn("lm-reveal", className)}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
