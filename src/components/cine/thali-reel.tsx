import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SectionMarker, Reveal, Viewfinder } from "./hud";
import { Parallax, ParallaxImage } from "./parallax";

const STEPS = [
  { n: "01", t: "Choose your bread", d: "Naan, garlic naan, tandoori roti or parantha." },
  { n: "02", t: "Rice or quinoa", d: "Basmati, jeera rice or quinoa." },
  { n: "03", t: "Select three curries", d: "Daal makhani, palak paneer, cholle & more." },
  { n: "04", t: "Add a side", d: "Cucumber raita or a garden salad." },
  { n: "05", t: "Select a dessert", d: "Gulab jamun, kheer or gajar halwa." },
];

export function ThaliReel() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      <div className="lm-container">
        <SectionMarker index="04" label="Build Your Thali" right="Runtime — 5 steps" />
      </div>

      {/* Stage: giant backdrop word + centered framed thali */}
      <div className="relative mt-16 flex items-center justify-center">
        <Parallax
          axis="x"
          speed={0.06}
          as="span"
          className="backdrop-word pointer-events-none absolute select-none text-[clamp(5rem,22vw,20rem)]"
        >
          THALI
        </Parallax>
        <Reveal blur={false} className="relative z-10">
          <Viewfinder className="relative aspect-[4/5] w-[min(78vw,360px)] bg-[color:var(--surface-2)]">
            <ParallaxImage
              src="/img/brand/hero-main.jpg"
              alt="A Lala Masala thali platter"
              sizes="360px"
              speed={0.05}
            />
          </Viewfinder>
        </Reveal>
      </div>

      <div className="lm-container mt-16">
        <ol className="grid gap-px overflow-hidden rounded-[var(--radius-md)] border border-[color:var(--border)] sm:grid-cols-5">
          {STEPS.map((s) => (
            <li key={s.n} className="bg-[color:var(--surface-2)]/40 p-5">
              <span className="hud">{s.n}</span>
              <p className="mt-3 font-medium">{s.t}</p>
              <p className="mt-1 text-xs leading-relaxed text-[color:var(--muted-foreground)]">
                {s.d}
              </p>
            </li>
          ))}
        </ol>

        <div className="mt-8 flex justify-center">
          <Link href="/menu" className="pill">
            Start your thali <ArrowUpRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
