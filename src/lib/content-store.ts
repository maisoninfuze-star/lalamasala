import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import type { WeeklyHours } from "@/lib/types";

/*
  Owner-editable content store.

  This is the persistence layer behind the admin dashboard. It keeps a small
  JSON file of *overrides* that are layered on top of the seed data in
  `src/data`, so a non-technical owner can change prices, availability, photos,
  location details and homepage copy without touching code or redeploying.

  It is intentionally a single, well-defined interface: to move to Supabase in
  production, swap the read/write internals here — every caller (server pages +
  admin actions) keeps working unchanged. On a read-only host (e.g. Vercel),
  point these functions at the `settings` / `location_dishes` / `content_sections`
  tables instead of the local file.
*/

export interface DishOverride {
  basePriceCents?: number;
  isPopular?: boolean;
  isFeatured?: boolean;
  isSoldOut?: boolean;
  isActive?: boolean;
  nameEn?: string;
  nameFr?: string;
  descEn?: string;
  descFr?: string;
  image?: string;
}

export interface LocationOverride {
  phone?: string;
  email?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  minimumOrderCents?: number;
  prepTimeMinutes?: number;
  extraDelayMinutes?: number;
  orderingPaused?: boolean;
  payAtPickupEnabled?: boolean;
  closedNote?: string;
  hours?: WeeklyHours[];
}

export interface SiteContent {
  heroTaglineEn?: string;
  heroSupportingEn?: string;
  promoBanner?: string;
  storyHeadlineEn?: string;
  storyBodyEn?: string;
}

/** A dish the owner created from the admin (not part of the seed menu). */
export interface CustomDish {
  slug: string;
  categorySlug: string;
  nameEn: string;
  nameFr?: string;
  descEn?: string;
  descFr?: string;
  basePriceCents: number;
  image?: string;
  isVegan?: boolean;
  isGlutenFriendly?: boolean;
  containsDairy?: boolean;
  containsNuts?: boolean;
}

/** A category the owner created from the admin. */
export interface CustomCategory {
  slug: string;
  nameEn: string;
  nameFr?: string;
  descEn?: string;
}

/** Owner-editable brand copy: About storybook, Catering & Event Hall. */
export interface BrandCopy {
  mottoHeadlineEn?: string;
  mottoLeadEn?: string;
  /** Paragraphs separated by blank lines. */
  mottoBodyEn?: string;
  chefIntroEn?: string;
  cateringIntroEn?: string;
  eventCapacity?: string;
  eventPackages?: { name: string; price: string; note: string }[];
}

/** A real guest review, entered by staff (testimonials are never invented). */
export interface StoredReview {
  id: string;
  authorName: string;
  rating: number; // 1–5
  body: string;
  locationSlug?: string;
  reviewedAt?: string;
}

export interface ContentStore {
  dishes: Record<string, DishOverride>;
  locations: Record<string, LocationOverride>;
  content: SiteContent;
  /** Owner-created dishes & categories, and seed dishes the owner removed. */
  customDishes: CustomDish[];
  removedDishes: string[];
  customCategories: CustomCategory[];
  reviews: StoredReview[];
  brandCopy: BrandCopy;
  updatedAt: string | null;
}

const STORE_PATH = path.join(process.cwd(), "content-store.json");

const EMPTY: ContentStore = {
  dishes: {},
  locations: {},
  content: {},
  customDishes: [],
  removedDishes: [],
  customCategories: [],
  reviews: [],
  brandCopy: {},
  updatedAt: null,
};

export async function readStore(): Promise<ContentStore> {
  try {
    const raw = await fs.readFile(STORE_PATH, "utf8");
    const parsed = JSON.parse(raw) as Partial<ContentStore>;
    return {
      dishes: parsed.dishes ?? {},
      locations: parsed.locations ?? {},
      content: parsed.content ?? {},
      customDishes: parsed.customDishes ?? [],
      removedDishes: parsed.removedDishes ?? [],
      customCategories: parsed.customCategories ?? [],
      reviews: parsed.reviews ?? [],
      brandCopy: parsed.brandCopy ?? {},
      updatedAt: parsed.updatedAt ?? null,
    };
  } catch {
    return { ...EMPTY };
  }
}

async function writeStore(store: ContentStore): Promise<void> {
  store.updatedAt = new Date().toISOString();
  await fs.writeFile(STORE_PATH, JSON.stringify(store, null, 2), "utf8");
}

export async function updateDish(slug: string, patch: DishOverride): Promise<void> {
  const store = await readStore();
  store.dishes[slug] = { ...store.dishes[slug], ...patch };
  await writeStore(store);
}

export async function updateLocation(slug: string, patch: LocationOverride): Promise<void> {
  const store = await readStore();
  store.locations[slug] = { ...store.locations[slug], ...patch };
  await writeStore(store);
}

export async function updateContent(patch: SiteContent): Promise<void> {
  const store = await readStore();
  store.content = { ...store.content, ...patch };
  await writeStore(store);
}

/** Create (or replace) an owner-added dish. */
export async function addCustomDish(dish: CustomDish): Promise<void> {
  const store = await readStore();
  store.customDishes = [...store.customDishes.filter((d) => d.slug !== dish.slug), dish];
  await writeStore(store);
}

/** Remove a dish: owner-added dishes are deleted outright; seed dishes are
 *  soft-removed (kept in `removedDishes` so they can be restored). */
export async function removeDish(slug: string): Promise<void> {
  const store = await readStore();
  const customIdx = store.customDishes.findIndex((d) => d.slug === slug);
  if (customIdx >= 0) {
    store.customDishes.splice(customIdx, 1);
    delete store.dishes[slug];
  } else if (!store.removedDishes.includes(slug)) {
    store.removedDishes.push(slug);
  }
  await writeStore(store);
}

/** Bring a soft-removed seed dish back onto the menu. */
export async function restoreDish(slug: string): Promise<void> {
  const store = await readStore();
  store.removedDishes = store.removedDishes.filter((s) => s !== slug);
  await writeStore(store);
}

/** Create (or replace) an owner-added category. */
export async function addCustomCategory(cat: CustomCategory): Promise<void> {
  const store = await readStore();
  store.customCategories = [...store.customCategories.filter((c) => c.slug !== cat.slug), cat];
  await writeStore(store);
}

/** Create or update a guest review (matched by id). */
export async function upsertReview(review: StoredReview): Promise<void> {
  const store = await readStore();
  store.reviews = [...store.reviews.filter((r) => r.id !== review.id), review];
  await writeStore(store);
}

export async function deleteReview(id: string): Promise<void> {
  const store = await readStore();
  store.reviews = store.reviews.filter((r) => r.id !== id);
  await writeStore(store);
}

export async function updateBrandCopy(patch: BrandCopy): Promise<void> {
  const store = await readStore();
  store.brandCopy = { ...store.brandCopy, ...patch };
  await writeStore(store);
}
