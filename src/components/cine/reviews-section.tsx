import { Star } from "lucide-react";
import { SectionMarker, Reveal } from "./hud";
import type { StoredReview } from "@/lib/content-store";
import { LOCATIONS } from "@/data/locations";

/*
  "Guest Book" — real reviews entered by staff in the admin. The section renders
  nothing until at least one review exists (testimonials are never invented).
*/
export function ReviewsSection({ reviews }: { reviews: StoredReview[] }) {
  if (reviews.length === 0) return null;

  return (
    <section className="lm-container py-24 sm:py-28">
      <SectionMarker index="04" label="Guest Book" right="Real reviews" />
      <Reveal className="mt-10">
        <h2 className="display-serif max-w-3xl text-[clamp(1.9rem,4vw,3rem)]">
          Kind words, <span className="lead">from the table.</span>
        </h2>
      </Reveal>

      <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {reviews.slice(0, 6).map((r) => {
          const loc = LOCATIONS.find((l) => l.slug === r.locationSlug)?.name;
          return (
            <Reveal key={r.id}>
              <figure className="flex h-full flex-col rounded-[var(--radius-lg)] border border-[color:var(--border)] bg-[color:var(--surface-2)]/40 p-6">
                <div className="flex gap-0.5" aria-label={`${r.rating} out of 5 stars`}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Star
                      key={n}
                      className="size-4"
                      style={{ color: n <= r.rating ? "var(--lm-marigold)" : "var(--faint)" }}
                      fill={n <= r.rating ? "currentColor" : "none"}
                      aria-hidden
                    />
                  ))}
                </div>
                <blockquote className="quote-serif mt-4 flex-1 text-[1.05rem]">
                  &ldquo;{r.body}&rdquo;
                </blockquote>
                <figcaption className="mt-5 flex items-center justify-between gap-3">
                  <span className="text-sm font-medium">{r.authorName}</span>
                  {loc && <span className="hud">{loc}</span>}
                </figcaption>
              </figure>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
