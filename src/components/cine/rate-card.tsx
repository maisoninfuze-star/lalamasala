import Link from "next/link";
import { getMenu } from "@/lib/menu-data";
import { formatFrom } from "@/lib/money";
import { SectionMarker, Reveal } from "./hud";

const FEATURE = [
  "build-your-thali",
  "taste-of-the-streets",
  "kathi-rolls",
  "soya-chaap",
  "curries",
  "roti-naan",
  "drinks",
  "desserts",
];

export async function RateCard() {
  const { categories, dishes } = await getMenu();

  const rows = FEATURE.map((slug) => {
    const cat = categories.find((c) => c.slug === slug);
    if (!cat) return null;
    const prices = dishes.filter((d) => d.categorySlug === slug).map((d) => d.basePriceCents);
    const from = prices.length ? Math.min(...prices) : 0;
    return { cat, from };
  }).filter((r): r is NonNullable<typeof r> => Boolean(r));

  return (
    <section className="relative py-24 sm:py-32">
      <div className="lm-container">
        <SectionMarker index="07" label="The Menu" right="CAD · Prices by location" />

        <Reveal className="mt-16 max-w-4xl">
          <h2 className="display text-[clamp(2rem,5vw,4.25rem)]">
            <span className="lead">Every price, up front.</span> No surprises at the counter.
          </h2>
        </Reveal>

        <div className="mt-16 hud-ticks" aria-hidden />

        <div className="mt-6">
          {rows.map((row, i) => (
            <Reveal key={row.cat.slug}>
              <Link
                href="/menu"
                className="row-hover group grid grid-cols-[auto_1fr_auto] items-center gap-4 border-t border-[color:var(--border)] py-6 sm:gap-8 sm:py-7"
              >
                <span className="hud w-8">0{i + 1}</span>
                <div className="min-w-0">
                  <h3 className="text-xl font-medium tracking-tight transition-colors group-hover:text-[color:var(--accent)] sm:text-2xl">
                    {row.cat.name.en}
                  </h3>
                  <p className="mt-1 hidden truncate text-sm text-[color:var(--muted-foreground)] sm:block">
                    {row.cat.description.en}
                  </p>
                </div>
                <div className="flex items-center gap-4 sm:gap-8">
                  <span className="tnum text-lg font-medium sm:text-2xl">
                    from {formatFrom(row.from)}
                  </span>
                  <span className="hud hidden shrink-0 transition-colors group-hover:text-[color:var(--accent)] sm:inline">
                    Order →
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
          <div className="border-t border-[color:var(--border)]" />
        </div>
      </div>
    </section>
  );
}
