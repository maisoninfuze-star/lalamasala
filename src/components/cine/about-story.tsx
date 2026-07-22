import Link from "next/link";
import { SectionMarker, Reveal, Viewfinder, MediaCaption } from "./hud";
import { ParallaxImage } from "./parallax";

export function AboutStory() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="lm-container">
        <SectionMarker index="06" label="Our Story" right="A legacy cooked with love" />

        <div className="mt-16 grid items-center gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          <Reveal blur={false}>
            <Viewfinder className="relative aspect-[4/5] w-full bg-[color:var(--surface-2)]">
              <ParallaxImage
                src="/img/brand/hero-kingston.jpg"
                alt="Inside the Lala Masala kitchen"
                sizes="(max-width:1024px) 100vw, 480px"
                speed={0.05}
                overlay={false}
              />
            </Viewfinder>
            <MediaCaption left="chef_raghbir.mov" right="Since 1970s" />
          </Reveal>

          <Reveal>
            <h2 className="display text-[clamp(1.75rem,3.6vw,3.25rem)]">
              Inspired by our patriarch{" "}
              <span className="lead">Kundan Laal Chawla</span>, and carried forward by{" "}
              <span className="lead">Chef Raghbir Singh Chawla</span> — nearly fifty years
              of traditional cooking, <span className="lead">made from scratch.</span>
            </h2>
            <p className="mt-6 max-w-lg text-sm leading-relaxed text-[color:var(--muted-foreground)]">
              Everything is vegetarian and served the way family food should be —
              generous, warm and without pretension.
            </p>
            <Link
              href="/our-story"
              className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-[color:var(--foreground)] hover:text-[color:var(--accent)]"
            >
              Discover our story →
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
