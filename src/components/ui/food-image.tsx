import Image from "next/image";
import { cn } from "@/lib/utils";

/*
  FoodImage renders real photography when a `src` is provided, otherwise a
  deliberately designed placeholder (warm duotone + fine grain) so the layout
  reads as intentional and premium before the owner uploads real dish photos
  from the admin dashboard. Never renders a broken image.
*/

// Warm palette stops within the brand range — chosen deterministically by seed.
const DUOTONES: [string, string][] = [
  ["#6b1026", "#a65b43"],
  ["#3b0715", "#6b1026"],
  ["#a65b43", "#d59a35"],
  ["#7a2233", "#e3b04b"],
  ["#521018", "#a65b43"],
  ["#8a3b1f", "#d59a35"],
];

function hueFor(seed: string): [string, string] {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return DUOTONES[h % DUOTONES.length];
}

export function FoodImage({
  src,
  alt,
  seed = alt,
  label,
  className,
  sizes,
  priority,
  rounded = true,
}: {
  src?: string | null;
  alt: string;
  seed?: string;
  label?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  rounded?: boolean;
}) {
  const [from, to] = hueFor(seed);
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-wine",
        rounded && "rounded-[var(--radius-lg)]",
        className,
      )}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes ?? "(max-width: 768px) 100vw, 50vw"}
          priority={priority}
          className="object-cover"
        />
      ) : (
        <div
          role="img"
          aria-label={alt}
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(120% 120% at 30% 20%, ${to}, ${from} 70%)`,
          }}
        >
          {/* fine grain + soft vignette so the fill never looks flat */}
          <div
            className="absolute inset-0 opacity-[0.12] mix-blend-overlay"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23n)'/%3E%3C/svg%3E\")",
            }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(80%_80%_at_50%_120%,rgba(0,0,0,0.45),transparent)]" />
          {label && (
            <div className="absolute inset-0 flex items-end p-5">
              <span className="font-serif text-ivory/90 text-lg leading-tight">
                {label}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
