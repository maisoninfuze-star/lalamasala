import "server-only";
import { CATEGORIES, DISHES, MODIFIER_GROUPS } from "@/data/menu";
import { LOCATIONS } from "@/data/locations";
import { BRAND, STORY, MOTTO_VISION, CHEF, CATERING, EVENT_HALL_INFO } from "@/data/brand";
import { readStore } from "@/lib/content-store";
import type { DishSeed, LocationSeed } from "@/lib/types";

/*
  Server-side data access. Merges owner overrides (content-store) on top of the
  seed data so admin edits are reflected on the public site immediately after
  revalidation. All public Server Components should read from here rather than
  importing the raw seed arrays.
*/

export type ResolvedDish = DishSeed & { isSoldOut: boolean; isActive: boolean };

export async function getMenu(): Promise<{
  categories: typeof CATEGORIES;
  dishes: ResolvedDish[];
  modifierGroups: typeof MODIFIER_GROUPS;
}> {
  const store = await readStore();
  const removed = new Set(store.removedDishes);

  // Owner-created dishes become full seed records with sensible defaults.
  const customSeeds: DishSeed[] = store.customDishes.map((c) => ({
    slug: c.slug,
    categorySlug: c.categorySlug,
    name: { en: c.nameEn, fr: c.nameFr || c.nameEn },
    description: { en: c.descEn ?? "", fr: c.descFr ?? c.descEn ?? "" },
    basePriceCents: c.basePriceCents,
    spice: "mild",
    isPopular: false,
    isFeatured: false,
    image: c.image,
    isVegan: !!c.isVegan,
    canBeVegan: !!c.isVegan,
    isGlutenFriendly: !!c.isGlutenFriendly,
    containsDairy: !!c.containsDairy,
    containsNuts: !!c.containsNuts,
  }));

  const dishes: ResolvedDish[] = [
    ...DISHES.filter((d) => !removed.has(d.slug)),
    ...customSeeds,
  ].map((d) => {
    const o = store.dishes[d.slug];
    return {
      ...d,
      basePriceCents: o?.basePriceCents ?? d.basePriceCents,
      isPopular: o?.isPopular ?? d.isPopular,
      isFeatured: o?.isFeatured ?? d.isFeatured,
      isActive: o?.isActive ?? true,
      image: o?.image ?? d.image,
      isSoldOut: o?.isSoldOut ?? false,
      name: {
        en: o?.nameEn ?? d.name.en,
        fr: o?.nameFr ?? d.name.fr,
      },
      description: {
        en: o?.descEn ?? d.description.en,
        fr: o?.descFr ?? d.description.fr,
      },
    };
  });

  const categories = [
    ...CATEGORIES,
    ...store.customCategories.map((c) => ({
      slug: c.slug,
      name: { en: c.nameEn, fr: c.nameFr || c.nameEn },
      description: { en: c.descEn ?? "", fr: c.descEn ?? "" },
    })),
  ];

  return { categories, dishes, modifierGroups: MODIFIER_GROUPS };
}

export async function getDishesByCategory(slug: string): Promise<ResolvedDish[]> {
  const { dishes } = await getMenu();
  return dishes.filter((d) => d.categorySlug === slug && d.isActive);
}

export async function getResolvedDish(slug: string): Promise<ResolvedDish | undefined> {
  const { dishes } = await getMenu();
  return dishes.find((d) => d.slug === slug);
}

export async function getLocations(): Promise<LocationSeed[]> {
  const store = await readStore();
  return LOCATIONS.map((l) => {
    const o = store.locations[l.slug];
    if (!o) return l;
    return {
      ...l,
      phone: o.phone ?? l.phone,
      email: o.email ?? l.email,
      addressLine1: o.addressLine1 ?? l.addressLine1,
      addressLine2: o.addressLine2 ?? l.addressLine2,
      city: o.city ?? l.city,
      province: o.province ?? l.province,
      postalCode: o.postalCode ?? l.postalCode,
      prepTimeMinutes: o.prepTimeMinutes ?? l.prepTimeMinutes,
      payAtPickupEnabled: o.payAtPickupEnabled ?? l.payAtPickupEnabled,
      minimumOrderCents: o.minimumOrderCents ?? l.minimumOrderCents,
      orderingPaused: o.orderingPaused ?? l.orderingPaused,
      closedNote: o.closedNote ?? l.closedNote,
      hours: o.hours ?? l.hours,
    };
  });
}

/** Default chef line for the About storybook (short so it fits a book leaf). */
const CHEF_BOOK_INTRO =
  "Chef Raghbir carries forward a proud culinary legacy from his father, Kundan Laal Chawla — creating every dish with heart, skill and heritage.";

/** Brand copy (About storybook, Catering, Event Hall) with owner overrides. */
export async function getBrandCopy() {
  const store = await readStore();
  const b = store.brandCopy;
  return {
    mottoHeadline: b.mottoHeadlineEn ?? MOTTO_VISION.headline.en,
    mottoLead: b.mottoLeadEn ?? MOTTO_VISION.lead.en,
    mottoBody: b.mottoBodyEn
      ? b.mottoBodyEn.split(/\n\s*\n+/).map((p) => p.trim()).filter(Boolean)
      : MOTTO_VISION.body.en,
    chefIntro: b.chefIntroEn ?? CHEF_BOOK_INTRO,
    cateringIntro: b.cateringIntroEn ?? CATERING.body.en,
    eventCapacity: b.eventCapacity ?? EVENT_HALL_INFO.capacity,
    eventPackages: b.eventPackages ?? EVENT_HALL_INFO.packages.map((p) => ({ ...p })),
  };
}

/** Real guest reviews entered by staff in admin — newest first. */
export async function getReviews() {
  const store = await readStore();
  return [...store.reviews].sort((a, b) => ((a.reviewedAt ?? "") < (b.reviewedAt ?? "") ? 1 : -1));
}

export async function getSiteContent() {
  const store = await readStore();
  return {
    heroTagline: store.content.heroTaglineEn ?? BRAND.tagline.en,
    heroSupporting: store.content.heroSupportingEn ?? BRAND.heroSupporting.en,
    promoBanner: store.content.promoBanner ?? "",
    storyHeadline: store.content.storyHeadlineEn ?? STORY.headline.en,
    storyBody: store.content.storyBodyEn ?? STORY.body.en.join("\n\n"),
  };
}
