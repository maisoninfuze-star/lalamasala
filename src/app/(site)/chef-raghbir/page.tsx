import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/cine/page-header";
import { Reveal, Viewfinder, MediaCaption } from "@/components/cine/hud";
import { ParallaxImage } from "@/components/cine/parallax";
import { CHEF } from "@/data/brand";

export const metadata: Metadata = {
  title: "Chef Raghbir Singh Chawla",
  description:
    "Chef Raghbir Singh Chawla carries forward nearly fifty years of traditional North Indian cooking learned at his father's side.",
  alternates: { canonical: "/chef-raghbir" },
};

export default function ChefPage() {
  return (
    <>
      <PageHeader
        index="00"
        label="The Chef"
        right="Custodian of the recipes"
        title={
          <>
            Chef <span className="lead">Raghbir Singh Chawla.</span>
          </>
        }
        subtitle={CHEF.role.en}
      />

      <section className="lm-container grid items-center gap-12 pb-28 lg:grid-cols-[0.9fr_1.1fr]">
        <Reveal blur={false}>
          <Viewfinder className="relative aspect-[4/5] w-full bg-[color:var(--surface-2)]">
            <ParallaxImage src="/img/brand/hero-2.jpg" alt="Chef Raghbir at work" sizes="(max-width:1024px) 100vw, 520px" speed={0.05} overlay={false} />
          </Viewfinder>
          <MediaCaption left="chef_raghbir.mov" right="Nearly 50 yrs" />
        </Reveal>

        <Reveal>
          <div className="space-y-5 text-[15px] leading-relaxed text-[color:var(--muted-foreground)]">
            {CHEF.body.en.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>
          <blockquote className="mt-10 border-l-2 border-[color:var(--accent)] pl-5 font-serif text-2xl leading-snug text-[color:var(--foreground)]">
            “Hospitality is not a service — it is who the Chawla family has always been.”
          </blockquote>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/menu" className="pill">
              Taste the menu
            </Link>
            <Link
              href="/our-story"
              className="inline-flex items-center gap-2 rounded-[var(--radius-pill)] border border-[color:var(--border)] px-5 py-[0.7rem] text-sm font-medium hover:bg-white/5"
            >
              Our story
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
