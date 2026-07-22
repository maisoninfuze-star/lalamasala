import type { Metadata } from "next";
import { UtensilsCrossed, Soup, Wheat, Sparkles, IceCreamBowl, Salad } from "lucide-react";
import { PageHeader } from "@/components/cine/page-header";
import { Reveal, Viewfinder, SectionMarker } from "@/components/cine/hud";
import { ParallaxImage } from "@/components/cine/parallax";
import { InquiryForm } from "@/components/cine/inquiry-form";
import { getBrandCopy } from "@/lib/menu-data";

export const metadata: Metadata = {
  title: "Catering",
  description:
    "Vegetarian Indian catering for offices, weddings and community celebrations across Montreal, Kingston and Belleville — thalis, live chaat, curries and fresh tandoor breads.",
  alternates: { canonical: "/catering" },
};

const SPREAD = [
  { icon: UtensilsCrossed, t: "Thalis & grain bowls", d: "Balanced, boxed or family-style — the everyday favourite." },
  { icon: Sparkles, t: "Live chaat counter", d: "Gol gappe, dahi bhalle and tikki, assembled fresh on site." },
  { icon: Soup, t: "Curries & paneer", d: "Butter masala, kadhai paneer, daal makhani and more." },
  { icon: Wheat, t: "Fresh tandoor breads", d: "Naan, kulcha and roti pulled hot from the tandoor." },
  { icon: Salad, t: "Street-food snacks", d: "Soya chaap, pakora, samosa and kathi rolls by the tray." },
  { icon: IceCreamBowl, t: "Desserts & chai", d: "Gulab jamun, rasmalai, jalebi and masala chai to finish." },
];

const OCCASIONS = [
  { t: "Office lunches", d: "Boxed thalis and grain bowls, delivered on time." },
  { t: "Weddings & engagements", d: "Full vegetarian spreads at any scale." },
  { t: "Community & cultural events", d: "Chaat counters, curries and fresh breads." },
  { t: "Celebrations at home", d: "Family-style trays with all the sides." },
];

const STEPS = [
  { t: "Tell us", d: "Share your date, headcount and the feel you're after." },
  { t: "We plan", d: "We shape a vegetarian menu and quote to fit your budget." },
  { t: "We cater", d: "Everything arrives fresh, set up and ready to serve." },
];

export default async function CateringPage() {
  const copy = await getBrandCopy();
  return (
    <>
      <PageHeader
        index="00"
        label="Catering"
        right="Any scale, all vegetarian"
        eyebrow="Vegetarian Catering"
        title={
          <>
            Catering for <span className="lead">every gathering.</span>
          </>
        }
        subtitle={copy.cateringIntro}
      />

      <section className="lm-container pb-16">
        <Reveal blur={false}>
          <Viewfinder className="relative aspect-[16/9] w-full bg-[color:var(--surface-2)]">
            <ParallaxImage src="/img/categories/taste-of-the-streets.jpeg" alt="A Lala Masala catering spread" sizes="100vw" speed={0.04} />
          </Viewfinder>
        </Reveal>
      </section>

      {/* What we bring */}
      <section className="lm-container pb-20">
        <SectionMarker index="01" label="What We Bring" right="Fully customisable" />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SPREAD.map((s) => (
            <Reveal key={s.t}>
              <div className="group flex h-full flex-col rounded-[var(--radius-lg)] border border-[color:var(--border)] bg-[color:var(--surface-2)]/40 p-6 transition-colors hover:border-[color:var(--lm-marigold)]/40">
                <s.icon className="size-6 text-[color:var(--lm-marigold)]" aria-hidden />
                <h3 className="display-serif mt-4 text-xl">{s.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[color:var(--muted-foreground)]">{s.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="lm-container pb-20">
        <SectionMarker index="02" label="How It Works" />
        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <Reveal key={s.t}>
              <div className="border-t-2 border-[color:var(--lm-marigold)]/50 pt-5">
                <span className="display-serif text-[color:var(--lm-marigold)]" style={{ fontSize: "2.25rem", lineHeight: 1 }}>
                  0{i + 1}
                </span>
                <h3 className="display-serif mt-3 text-xl">{s.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[color:var(--muted-foreground)]">{s.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Occasions + request form */}
      <section className="lm-container grid gap-x-16 gap-y-12 pb-28 lg:grid-cols-2">
        <div>
          <SectionMarker index="03" label="Occasions" />
          <div className="mt-8">
            {OCCASIONS.map((o, i) => (
              <Reveal key={o.t}>
                <div className="flex items-baseline gap-5 border-t border-[color:var(--border)] py-6">
                  <span className="hud accent-marigold">0{i + 1}</span>
                  <div>
                    <h3 className="display-serif text-xl">{o.t}</h3>
                    <p className="mt-1 text-sm text-[color:var(--muted-foreground)]">{o.d}</p>
                  </div>
                </div>
              </Reveal>
            ))}
            <div className="border-t border-[color:var(--border)]" />
          </div>
        </div>

        <div>
          <SectionMarker index="04" label="Request Catering" right="We'll be in touch" />
          <Reveal className="mt-8">
            <InquiryForm kind="catering" eventFields />
          </Reveal>
        </div>
      </section>
    </>
  );
}
