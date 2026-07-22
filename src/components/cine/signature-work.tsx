import Link from "next/link";
import { getMenu } from "@/lib/menu-data";
import { formatFrom } from "@/lib/money";
import { SectionMarker, Reveal, Viewfinder, MediaCaption } from "./hud";
import { ParallaxImage } from "./parallax";

const PICKS = ["paneer-tikka", "malai-chaap", "daal-makhani", "paneer-butter-masala"];
const POSTER_FALLBACK = "/img/brand/hero-main.jpg";
// Cinematic, purpose-shot photos for the signature section (fal-generated).
const SIG_IMG: Record<string, string> = {
  "paneer-tikka": "/img/dishes/sig-paneer-tikka.jpg",
  "malai-chaap": "/img/dishes/sig-malai-chaap.jpg",
  "daal-makhani": "/img/dishes/sig-daal-makhani.jpg",
  "paneer-butter-masala": "/img/dishes/sig-paneer-butter-masala.jpg",
};

function tag(d: { isVegan: boolean; spice: string }) {
  const diet = d.isVegan ? "VEGAN" : "VEG";
  const spice = d.spice === "none" ? "MILD" : d.spice.replace("_", " ").toUpperCase();
  return `${diet} · ${spice}`;
}

export async function SignatureWork() {
  const { dishes } = await getMenu();
  const items = PICKS.map((s) => dishes.find((d) => d.slug === s)).filter(
    (d): d is NonNullable<typeof d> => Boolean(d),
  );

  return (
    <section className="relative">
      <div className="lm-container pt-24 sm:pt-32">
        <SectionMarker index="01" label="Signature Dishes" right="Straight from the pass" />
      </div>

      {/*
        Sticky stack: each dish pins at the top for a viewport, then the next
        panel (opaque background) scrolls up and covers it.
      */}
      <div className="relative">
        {items.map((d, i) => (
          <div
            key={d.slug}
            className="sticky top-0 flex h-screen items-center bg-[color:var(--background)]"
          >
            <div className="lm-container w-full">
              <Reveal blur={false} className="mx-auto max-w-4xl">
                <div className="mb-3 flex items-center justify-between">
                  <span className="hud">(0{i + 1}) — Signature</span>
                  <span className="hud">{formatFrom(d.basePriceCents)}</span>
                </div>
                <Link href="/menu" className="group block">
                  <Viewfinder className="relative aspect-[16/10] w-full bg-[color:var(--surface-2)]">
                    <ParallaxImage
                      src={SIG_IMG[d.slug] ?? d.image ?? POSTER_FALLBACK}
                      alt={d.name.en}
                      sizes="(max-width:1024px) 100vw, 900px"
                      speed={0.05}
                    />
                    <div className="absolute bottom-0 left-0 p-6 sm:p-8">
                      <h3 className="text-3xl font-medium tracking-tight text-ivory sm:text-5xl">
                        {d.name.en}
                      </h3>
                    </div>
                  </Viewfinder>
                </Link>
                <MediaCaption left={`${d.slug}.mov`} right={tag(d)} />
              </Reveal>
            </div>
          </div>
        ))}
      </div>

      <div className="relative z-10 bg-[color:var(--background)]">
        <div className="lm-container py-16 text-center">
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 text-sm font-medium text-[color:var(--foreground)] hover:text-[color:var(--accent)]"
          >
            View the full menu →
          </Link>
        </div>
      </div>
    </section>
  );
}
