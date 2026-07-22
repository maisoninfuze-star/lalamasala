import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHeader } from "@/components/cine/page-header";
import { Reveal, Viewfinder } from "@/components/cine/hud";
import { ParallaxImage } from "@/components/cine/parallax";
import { LOCATIONS } from "@/data/locations";

export const metadata: Metadata = {
  title: "Locations",
  description:
    "Find Lala Masala in Montreal (Dollard-des-Ormeaux), Kingston and Belleville — addresses, hours and menus.",
  alternates: { canonical: "/locations" },
};

const LOC_IMG: Record<string, string> = {
  montreal: "/img/brand/hero-main.jpg",
  kingston: "/img/brand/hero-kingston.jpg",
  belleville: "/img/brand/hero-2.jpg",
};

export default function LocationsPage() {
  return (
    <>
      <PageHeader
        index="00"
        label="Locations"
        right="Three kitchens"
        title={
          <>
            Three kitchens, <span className="lead">one table.</span>
          </>
        }
        subtitle="Choose your nearest Lala Masala to browse its menu and order for pickup."
      />

      <section className="lm-container grid gap-6 pb-28 md:grid-cols-3">
        {LOCATIONS.map((loc, i) => (
          <Reveal key={loc.slug} blur={false}>
            <Link href={`/locations/${loc.slug}`} className="group block">
              <Viewfinder className="relative aspect-[4/3] w-full bg-[color:var(--surface-2)]">
                <ParallaxImage src={LOC_IMG[loc.slug]} alt={`Lala Masala ${loc.name}`} sizes="(max-width:768px) 100vw, 33vw" speed={0.05} />
                <div className="absolute bottom-0 left-0 flex w-full items-end justify-between p-5">
                  <div>
                    <span className="hud">0{i + 1}</span>
                    <h2 className="mt-1 font-serif text-3xl text-ivory">{loc.name}</h2>
                  </div>
                  <ArrowUpRight className="size-6 text-ivory transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                </div>
              </Viewfinder>
            </Link>
            <p className="mt-4 text-sm text-[color:var(--muted-foreground)]">
              {loc.addressLine1}, {loc.city}, {loc.province} · {loc.phone}
            </p>
          </Reveal>
        ))}
      </section>
    </>
  );
}
