import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Phone, Navigation, Clock } from "lucide-react";
import { PageHeader } from "@/components/cine/page-header";
import { Reveal, Viewfinder, SectionMarker } from "@/components/cine/hud";
import { ParallaxImage } from "@/components/cine/parallax";
import { LOCATIONS, getLocation } from "@/data/locations";

const LOC_IMG: Record<string, string> = {
  montreal: "/img/brand/hero-main.jpg",
  kingston: "/img/brand/hero-kingston.jpg",
  belleville: "/img/brand/hero-2.jpg",
};
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function generateStaticParams() {
  return LOCATIONS.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const loc = getLocation(slug);
  if (!loc) return {};
  return {
    title: `${loc.name} — Vegetarian Indian Restaurant`,
    description: `Lala Masala ${loc.name}: ${loc.addressLine1}, ${loc.city}, ${loc.province}. Vegetarian Indian street food, curries and thalis — order for pickup.`,
    alternates: { canonical: `/locations/${loc.slug}` },
  };
}

export default async function LocationDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const loc = getLocation(slug);
  if (!loc) notFound();

  return (
    <>
      <PageHeader
        index="00"
        label={`Location — ${loc.province}`}
        right={loc.phone}
        title={
          <>
            Lala Masala <span className="lead">{loc.name}.</span>
          </>
        }
        subtitle={`${loc.addressLine1}${loc.addressLine2 ? `, ${loc.addressLine2}` : ""}, ${loc.city}, ${loc.province} ${loc.postalCode}`}
      />

      <section className="lm-container pb-10">
        <Reveal blur={false}>
          <Viewfinder className="relative aspect-[16/9] w-full bg-[color:var(--surface-2)]">
            <ParallaxImage src={LOC_IMG[loc.slug]} alt={`Lala Masala ${loc.name}`} sizes="100vw" speed={0.04} priority />
          </Viewfinder>
        </Reveal>
      </section>

      <section className="lm-container grid gap-x-16 gap-y-10 pb-28 lg:grid-cols-[1fr_1fr]">
        <div>
          <SectionMarker index="01" label="Hours" right={loc.timezone.split("/")[1]?.replace("_", " ")} />
          <dl className="mt-6 divide-y divide-[color:var(--border)] border-y border-[color:var(--border)]">
            {loc.hours.map((h) => (
              <div key={h.day} className="flex items-center justify-between py-3">
                <dt className="flex items-center gap-2 text-sm">
                  <Clock className="size-3.5 text-[color:var(--accent)]" /> {DAYS[h.day]}
                </dt>
                <dd className="tnum text-sm text-[color:var(--muted-foreground)]">
                  {h.closed || !h.open ? "Closed" : `${h.open} – ${h.close}`}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div>
          <SectionMarker index="02" label="Visit & Order" />
          <div className="mt-6 space-y-3">
            <a href={`tel:${loc.phone}`} className="flex items-center gap-3 text-sm hover:text-[color:var(--accent)]">
              <Phone className="size-4 text-[color:var(--accent)]" /> {loc.phone}
            </a>
            {loc.mapsUrl && (
              <a
                href={loc.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm hover:text-[color:var(--accent)]"
              >
                <Navigation className="size-4 text-[color:var(--accent)]" /> Get directions
              </a>
            )}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/menu" className="pill">
              Order for Pickup
            </Link>
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 rounded-[var(--radius-pill)] border border-[color:var(--border)] px-5 py-[0.7rem] text-sm font-medium hover:bg-white/5"
            >
              View menu
            </Link>
          </div>
          {loc.payAtPickupEnabled && (
            <p className="mt-4 hud">Pay online or at pickup</p>
          )}
        </div>
      </section>
    </>
  );
}
