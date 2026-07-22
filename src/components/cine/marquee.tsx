import { cn } from "@/lib/utils";

/*
  Infinite marquee ticker — a duplicated track scrolls -50% for a seamless loop,
  edge-faded, pausing on hover. Original CSS implementation (no external lib).
*/
export function Marquee({
  items,
  reverse = false,
  durationSec = 34,
  className,
}: {
  items: string[];
  reverse?: boolean;
  durationSec?: number;
  className?: string;
}) {
  const row = (
    <div
      className="lm-marquee-track"
      style={
        {
          "--marquee-dur": `${durationSec}s`,
          animationDirection: reverse ? "reverse" : "normal",
        } as React.CSSProperties
      }
      aria-hidden
    >
      {[0, 1].map((dup) => (
        <div key={dup} className="flex shrink-0 items-center">
          {items.map((it, i) => (
            <span key={`${dup}-${i}`} className="flex items-center">
              <span className="whitespace-nowrap px-6 text-[clamp(1.25rem,2.4vw,2rem)] font-medium tracking-tight text-[color:var(--muted-foreground)]">
                {it}
              </span>
              <span className="size-1.5 shrink-0 rounded-full bg-[color:var(--accent)]" />
            </span>
          ))}
        </div>
      ))}
    </div>
  );

  return (
    <div
      className={cn(
        "lm-marquee group [mask-image:linear-gradient(to_right,transparent,#000_8%,#000_92%,transparent)]",
        className,
      )}
    >
      {row}
    </div>
  );
}
