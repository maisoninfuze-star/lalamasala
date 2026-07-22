import { getMenu } from "@/lib/menu-data";
import { readStore } from "@/lib/content-store";
import { DISHES } from "@/data/menu";
import { MenuManager } from "./menu-manager";

export const dynamic = "force-dynamic";

export default async function AdminMenuPage() {
  const [{ categories, dishes }, store] = await Promise.all([getMenu(), readStore()]);

  const customSlugs = new Set(store.customDishes.map((d) => d.slug));
  const grouped = categories.map((c) => ({
    category: c,
    dishes: dishes.filter((d) => d.categorySlug === c.slug),
  }));

  // Seed dishes the owner removed — shown in a "removed" tray for restore.
  const removed = store.removedDishes
    .map((slug) => DISHES.find((d) => d.slug === slug))
    .filter((d): d is NonNullable<typeof d> => Boolean(d))
    .map((d) => ({ slug: d.slug, name: d.name.en, image: d.image ?? null }));

  return (
    <div>
      <header className="mb-6">
        <h1 className="font-serif text-3xl">Menu &amp; Prices</h1>
        <p className="mt-1 text-sm text-[color:var(--muted-foreground)]">
          Change a price, mark a dish sold out, feature it, or replace its photo — or add a
          brand-new dish or category. Changes go live on your website right away.
        </p>
      </header>
      <MenuManager
        groups={grouped.map((g) => ({
          category: { slug: g.category.slug, name: g.category.name.en },
          dishes: g.dishes.map((d) => ({
            slug: d.slug,
            name: d.name.en,
            image: d.image ?? null,
            basePriceCents: d.basePriceCents,
            isPopular: d.isPopular,
            isFeatured: d.isFeatured,
            isSoldOut: d.isSoldOut,
            isActive: d.isActive,
            isCustom: customSlugs.has(d.slug),
          })),
        }))}
        removed={removed}
      />
    </div>
  );
}
