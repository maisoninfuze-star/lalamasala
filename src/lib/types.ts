/*
  Domain types shared by the presentation layer and the seed script.
  These mirror the database schema (supabase/migrations) so the UI can render
  from local seed data now and switch to live Supabase queries with no changes
  to component contracts.
*/

export type Locale = "en" | "fr";

export type SpiceLevel = "none" | "mild" | "medium" | "hot" | "extra_hot";

export type Localized = { en: string; fr: string };

export interface DietaryFlags {
  isVegan: boolean;
  canBeVegan: boolean;
  isGlutenFriendly: boolean;
  containsDairy: boolean;
  containsNuts: boolean;
}

export interface DishSeed extends DietaryFlags {
  slug: string;
  categorySlug: string;
  name: Localized;
  description: Localized;
  basePriceCents: number;
  spice: SpiceLevel;
  isPopular: boolean;
  isFeatured: boolean;
  image?: string;
  modifierGroupSlugs?: string[];
}

export interface CategorySeed {
  slug: string;
  name: Localized;
  description: Localized;
  image?: string;
}

export interface ModifierOptionSeed {
  name: Localized;
  priceDeltaCents: number;
}

export interface ModifierGroupSeed {
  slug: string;
  name: Localized;
  selection: "single" | "multiple";
  minSelect: number;
  maxSelect: number | null;
  isRequired: boolean;
  options: ModifierOptionSeed[];
}

export interface WeeklyHours {
  /** 0=Sun … 6=Sat */
  day: number;
  open: string | null; // "11:00"
  close: string | null; // "21:00"
  closed?: boolean;
}

export interface LocationSeed {
  slug: string;
  name: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  province: string;
  postalCode: string;
  phone: string;
  email?: string;
  mapsUrl?: string;
  timezone: string;
  taxRatePercent: number;
  prepTimeMinutes: number;
  payAtPickupEnabled: boolean;
  heroImage?: string;
  hours: WeeklyHours[];
  /** Operational controls the owner can flip from the admin dashboard. */
  minimumOrderCents?: number;
  orderingPaused?: boolean;
  /** Short public note shown when the kitchen is closed / paused (e.g. holiday). */
  closedNote?: string;
}

export interface Review {
  authorName: string;
  rating: number;
  body: string;
  locationSlug?: string;
  source: "manual" | "google";
  reviewedAt?: string;
}
