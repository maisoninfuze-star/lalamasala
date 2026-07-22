import Link from "next/link";
import { SectionMarker, Reveal, Viewfinder } from "./hud";
import { ParallaxImage } from "./parallax";
import { cn } from "@/lib/utils";

const ITEMS = [
  {
    n: "01",
    title: "Order for Pickup",
    body: "Browse a location menu, build your order and collect it fresh from the pass.",
    img: "/img/dishes/chilli-paneer.png",
    href: "/menu",
  },
  {
    n: "02",
    title: "Catering",
    body: "Vegetarian menus at any scale — offices, weddings and community celebrations.",
    img: "/img/categories/taste-of-the-streets.jpeg",
    href: "/catering",
  },
  {
    n: "03",
    title: "Event Hall — Kingston",
    body: "A warm, elegant space for gatherings, with in-house catering from our kitchen.",
    img: "/img/brand/hero-kingston.jpg",
    href: "/event-hall",
  },
  {
    n: "04",
    title: "Build Your Thali",
    body: "A complete plate, your way — bread, grains, three curries, a side and dessert.",
    img: "/img/brand/hero-main.jpg",
    href: "/menu",
  },
];

export function Offering() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="lm-container">
        <SectionMarker index="05" label="What We Serve" right="The offering" />

        <div className="mt-12">
          {ITEMS.map((item, i) => {
            const flip = i % 2 === 1;
            return (
              <Reveal key={item.n} blur={false}>
                <Link
                  href={item.href}
                  className={cn(
                    "group flex flex-col gap-6 border-t border-[color:var(--border)] py-10 sm:flex-row sm:items-center sm:gap-10",
                    flip && "sm:flex-row-reverse sm:text-right",
                  )}
                >
                  <span className="text-[clamp(3rem,7vw,6rem)] font-medium leading-none tracking-tight text-[color:var(--faint)] transition-colors group-hover:text-[color:var(--accent)]">
                    {item.n}
                  </span>
                  <Viewfinder className="relative aspect-[16/10] w-full shrink-0 bg-[color:var(--surface-2)] sm:w-64">
                    <ParallaxImage src={item.img} alt={item.title} sizes="256px" speed={0.04} overlay={false} />
                  </Viewfinder>
                  <div className={cn("flex-1", flip && "sm:flex sm:flex-col sm:items-end")}>
                    <h3 className="text-2xl font-medium tracking-tight sm:text-3xl">
                      {item.title}
                    </h3>
                    <p className="mt-2 max-w-md text-sm leading-relaxed text-[color:var(--muted-foreground)]">
                      {item.body}
                    </p>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
