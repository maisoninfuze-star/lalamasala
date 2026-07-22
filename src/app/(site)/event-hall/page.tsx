import type { Metadata } from "next";
import { Users, Music, MapPin } from "lucide-react";
import { PageHeader } from "@/components/cine/page-header";
import { Reveal, Viewfinder, SectionMarker } from "@/components/cine/hud";
import { ParallaxImage } from "@/components/cine/parallax";
import { InquiryForm } from "@/components/cine/inquiry-form";
import { EVENT_HALL_INFO } from "@/data/brand";
import { getBrandCopy } from "@/lib/menu-data";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Lala Event Hall — Kingston",
  description:
    "A cozy, private venue in Kingston for birthdays, engagements, small weddings and community gatherings, with in-house vegetarian catering by Lala Masala.",
  alternates: { canonical: "/event-hall" },
};

const STATS = [
  { icon: Users, k: "70", label: "guests standing · 64 seated" },
  { icon: MapPin, k: "Kingston", label: "43 Hickson Avenue, ON" },
  { icon: Music, k: "In-house", label: "catering, service & sound" },
];

export default async function EventHallPage() {
  const copy = await getBrandCopy();
  return (
    <>
      <PageHeader
        index="00"
        label="Event Hall — Kingston"
        right={copy.eventCapacity}
        eyebrow="Kingston Venue"
        title={
          <>
            A space to <span className="lead">gather.</span>
          </>
        }
        subtitle="A cozy, private venue in Kingston for intimate celebrations and community gatherings — with in-house vegetarian catering from the Lala Masala kitchen."
      />

      <section className="lm-container pb-14">
        <Reveal blur={false}>
          <Viewfinder className="relative aspect-[16/9] w-full bg-[color:var(--surface-2)]">
            <ParallaxImage src="/img/brand/hero-kingston.jpg" alt="Lala Event Hall in Kingston" sizes="100vw" speed={0.04} />
          </Viewfinder>
        </Reveal>
      </section>

      {/* Quick facts */}
      <section className="lm-container pb-20">
        <div className="grid gap-px overflow-hidden rounded-[var(--radius-lg)] border border-[color:var(--border)] bg-[color:var(--border)] sm:grid-cols-3">
          {STATS.map((s) => (
            <Reveal key={s.label} className="flex items-center gap-4 bg-[color:var(--background)] p-6">
              <s.icon className="size-6 shrink-0 text-[color:var(--lm-marigold)]" aria-hidden />
              <div>
                <p className="display-serif text-2xl leading-none text-[color:var(--foreground)]">{s.k}</p>
                <p className="mt-1 text-sm text-[color:var(--muted-foreground)]">{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Packages */}
      <section className="lm-container pb-20">
        <SectionMarker index="01" label="Packages" right="CAD" />
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {copy.eventPackages.map((p, i) => {
            const featured = i === 1;
            return (
              <Reveal key={p.name}>
                <div
                  className={cn(
                    "relative flex h-full flex-col rounded-[var(--radius-lg)] border p-7",
                    featured
                      ? "border-[color:var(--lm-marigold)]/45 plum-panel"
                      : "border-[color:var(--border)] bg-[color:var(--surface-2)]/40",
                  )}
                >
                  {featured && (
                    <span className="absolute -top-3 left-7 rounded-full bg-[color:var(--lm-marigold)] px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-[color:var(--lm-wine)]">
                      Most popular
                    </span>
                  )}
                  <span className="hud accent-marigold">0{i + 1}</span>
                  <h3 className="display-serif mt-3 text-2xl">{p.name}</h3>
                  <p className="display-serif mt-2 text-3xl text-[color:var(--lm-marigold)]">{p.price}</p>
                  <p className="mt-4 text-sm leading-relaxed text-[color:var(--muted-foreground)]">{p.note}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Details grid */}
      <section className="lm-container grid gap-x-16 gap-y-12 pb-20 lg:grid-cols-3">
        {[
          { label: "Perfect for", items: EVENT_HALL_INFO.events },
          { label: "Add-ons", items: EVENT_HALL_INFO.addons },
          { label: "Included", items: EVENT_HALL_INFO.amenities },
        ].map((col, i) => (
          <Reveal key={col.label}>
            <SectionMarker index={`0${i + 2}`} label={col.label} />
            <ul className="mt-6 space-y-2.5">
              {col.items.map((it) => (
                <li key={it} className="flex gap-3 text-sm text-[color:var(--muted-foreground)]">
                  <span className="mt-1.5 size-1 shrink-0 rounded-full bg-[color:var(--lm-marigold)]" aria-hidden />
                  {it}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </section>

      {/* Inquiry */}
      <section className="lm-container max-w-2xl pb-28">
        <SectionMarker index="05" label="Check Availability" right="Kingston" />
        <Reveal className="mt-8">
          <InquiryForm kind="event" eventFields />
        </Reveal>
      </section>
    </>
  );
}
