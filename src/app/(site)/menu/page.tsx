import type { Metadata } from "next";
import Image from "next/image";
import { PageHeader } from "@/components/cine/page-header";
import { Reveal } from "@/components/cine/hud";
import { MenuNav } from "@/components/cine/menu-nav";
import { AddToCart } from "@/components/cine/add-to-cart";
import { getMenu } from "@/lib/menu-data";
import { formatMoney } from "@/lib/money";
import { BRAND } from "@/data/brand";

export const metadata: Metadata = {
  title: "Menu",
  description:
    "The full Lala Masala menu — Build Your Thali, curry grain bowls, street food, kathi rolls, soya chaap, curries, breads, drinks and desserts. All vegetarian.",
  alternates: { canonical: "/menu" },
};

function Badges({
  d,
}: {
  d: { isVegan: boolean; canBeVegan: boolean; isGlutenFriendly: boolean; spice: string };
}) {
  const tags: string[] = [];
  if (d.isVegan) tags.push("VEGAN");
  else if (d.canBeVegan) tags.push("VEGAN OPT.");
  if (d.isGlutenFriendly) tags.push("GF");
  if (d.spice && d.spice !== "none") tags.push(d.spice.replace("_", " ").toUpperCase());
  return (
    <div className="mt-2 flex flex-wrap gap-1.5">
      {tags.map((t) => (
        <span key={t} className="hud rounded-full border border-[color:var(--border)] px-2 py-0.5 !text-[10px]">
          {t}
        </span>
      ))}
    </div>
  );
}

export default async function MenuPage() {
  const { categories, dishes } = await getMenu();
  const active = categories.filter((c) => dishes.some((d) => d.categorySlug === c.slug && d.isActive));

  return (
    <>
      <PageHeader
        index="00"
        label="The Menu"
        right="All vegetarian · CAD"
        title={
          <>
            Everything, <span className="lead">from scratch.</span>
          </>
        }
        subtitle="Prices shown are starting prices and may vary by location. Order online for pickup, or call your nearest kitchen."
      />

      <MenuNav categories={active.map((c) => ({ slug: c.slug, name: c.name.en }))} orderUrl={BRAND.ordering.montreal} />

      <div className="lm-container pb-28">
        {active.map((cat) => {
          const items = dishes.filter((d) => d.categorySlug === cat.slug && d.isActive);
          return (
            <section key={cat.slug} id={cat.slug} className="scroll-mt-28 border-t border-[color:var(--border)] py-14">
              <div className="mb-8 max-w-2xl">
                <h2 className="font-serif text-[clamp(1.75rem,3vw,2.75rem)]">{cat.name.en}</h2>
                <p className="mt-2 text-sm text-[color:var(--muted-foreground)]">{cat.description.en}</p>
              </div>

              <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((d) => (
                  <Reveal key={d.slug} blur={false}>
                    <article className="group">
                      <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-md)] bg-[color:var(--surface-2)]">
                        {d.image && (
                          <Image
                            src={d.image}
                            alt={d.name.en}
                            fill
                            sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        )}
                        {d.isSoldOut && (
                          <div className="absolute inset-0 grid place-items-center bg-black/60">
                            <span className="hud rounded-full border border-white/40 px-3 py-1 text-white">Sold out</span>
                          </div>
                        )}
                        {d.isPopular && !d.isSoldOut && (
                          <span className="hud absolute left-3 top-3 rounded-full bg-[color:var(--accent)] px-2.5 py-1 !text-[10px] text-[color:var(--lm-wine)]">
                            Popular
                          </span>
                        )}
                      </div>
                      <div className="mt-3 flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-medium leading-tight">{d.name.en}</h3>
                          <p className="text-xs text-[color:var(--faint)]">{d.name.fr}</p>
                        </div>
                        <span className="tnum shrink-0 font-medium">{formatMoney(d.basePriceCents)}</span>
                      </div>
                      <p className="mt-1.5 text-sm leading-relaxed text-[color:var(--muted-foreground)]">
                        {d.description.en}
                      </p>
                      <div className="mt-3 flex items-center justify-between gap-3">
                        <Badges d={d} />
                        <AddToCart
                          slug={d.slug}
                          name={d.name.en}
                          priceCents={d.basePriceCents}
                          image={d.image}
                          disabled={d.isSoldOut}
                        />
                      </div>
                    </article>
                  </Reveal>
                ))}
              </div>
            </section>
          );
        })}
        <div className="border-t border-[color:var(--border)]" />
        <p className="mt-6 hud">
          We can&apos;t claim any dish is fully allergen-free — everything is prepared in a shared kitchen.
        </p>
      </div>
    </>
  );
}
