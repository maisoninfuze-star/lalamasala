"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import {
  verifyPassword,
  createSession,
  destroySession,
  isAuthenticated,
} from "@/lib/admin-auth";
import {
  updateDish,
  updateLocation,
  updateContent,
  addCustomDish,
  removeDish,
  restoreDish,
  addCustomCategory,
  upsertReview,
  deleteReview,
  updateBrandCopy,
  type DishOverride,
  type LocationOverride,
  type SiteContent,
  type BrandCopy,
} from "@/lib/content-store";
import { deleteInquiry } from "@/lib/inquiries";
import { getMenu } from "@/lib/menu-data";

/** kebab-case slug from a display name, e.g. "Aloo Tikki  Chaat!" → "aloo-tikki-chaat". */
function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

async function assertAdmin() {
  if (!(await isAuthenticated())) {
    throw new Error("Not authorized");
  }
}

/** Revalidate every public surface a content change can affect. */
function revalidatePublic() {
  revalidatePath("/");
  revalidatePath("/menu");
  revalidatePath("/locations");
  revalidatePath("/contact");
}

export async function loginAction(_prev: unknown, formData: FormData) {
  const password = String(formData.get("password") ?? "");
  if (!verifyPassword(password)) {
    return { error: "Incorrect password. Please try again." };
  }
  await createSession();
  redirect("/admin");
}

export async function logoutAction() {
  await destroySession();
  redirect("/admin/login");
}

const dishSchema = z.object({
  basePriceCents: z.number().int().min(0).max(1_000_00).optional(),
  isPopular: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  isSoldOut: z.boolean().optional(),
  isActive: z.boolean().optional(),
  nameEn: z.string().trim().min(1).max(120).optional(),
  nameFr: z.string().trim().min(1).max(120).optional(),
  descEn: z.string().trim().max(600).optional(),
  descFr: z.string().trim().max(600).optional(),
  image: z.string().trim().max(300).optional(),
});

export async function saveDishAction(slug: string, patch: DishOverride) {
  await assertAdmin();
  const parsed = dishSchema.parse(patch);
  await updateDish(slug, parsed);
  revalidatePublic();
  revalidatePath("/admin/menu");
  return { ok: true };
}

const hoursSchema = z
  .array(
    z.object({
      day: z.number().int().min(0).max(6),
      open: z.string().trim().max(5).nullable(),
      close: z.string().trim().max(5).nullable(),
      closed: z.boolean().optional(),
    }),
  )
  .max(7);

const locationSchema = z.object({
  phone: z.string().trim().max(40).optional(),
  email: z.string().trim().max(160).optional(),
  addressLine1: z.string().trim().max(160).optional(),
  addressLine2: z.string().trim().max(160).optional(),
  city: z.string().trim().max(80).optional(),
  province: z.string().trim().max(8).optional(),
  postalCode: z.string().trim().max(12).optional(),
  minimumOrderCents: z.number().int().min(0).max(500_00).optional(),
  prepTimeMinutes: z.number().int().min(0).max(240).optional(),
  extraDelayMinutes: z.number().int().min(0).max(240).optional(),
  orderingPaused: z.boolean().optional(),
  payAtPickupEnabled: z.boolean().optional(),
  closedNote: z.string().trim().max(160).optional(),
  hours: hoursSchema.optional(),
});

export async function saveLocationAction(slug: string, patch: LocationOverride) {
  await assertAdmin();
  const parsed = locationSchema.parse(patch);
  await updateLocation(slug, parsed);
  revalidatePublic();
  revalidatePath("/admin/locations");
  return { ok: true };
}

const contentSchema = z.object({
  heroTaglineEn: z.string().trim().max(200).optional(),
  heroSupportingEn: z.string().trim().max(400).optional(),
  promoBanner: z.string().trim().max(200).optional(),
  storyHeadlineEn: z.string().trim().max(200).optional(),
  storyBodyEn: z.string().trim().max(2000).optional(),
});

export async function saveContentAction(patch: SiteContent) {
  await assertAdmin();
  const parsed = contentSchema.parse(patch);
  await updateContent(parsed);
  revalidatePublic();
  revalidatePath("/admin/content");
  return { ok: true };
}

export async function deleteInquiryAction(createdAt: string) {
  await assertAdmin();
  await deleteInquiry(String(createdAt));
  revalidatePath("/admin/inbox");
  revalidatePath("/admin");
  return { ok: true };
}

/* ------------------------- Menu: add / remove ------------------------- */

const newDishSchema = z.object({
  nameEn: z.string().trim().min(1).max(120),
  nameFr: z.string().trim().max(120).optional(),
  categorySlug: z.string().trim().min(1).max(80),
  basePriceCents: z.number().int().min(0).max(1_000_00),
  descEn: z.string().trim().max(600).optional(),
  descFr: z.string().trim().max(600).optional(),
  isVegan: z.boolean().optional(),
  isGlutenFriendly: z.boolean().optional(),
  containsDairy: z.boolean().optional(),
  containsNuts: z.boolean().optional(),
});

export async function addDishAction(input: unknown) {
  await assertAdmin();
  const parsed = newDishSchema.parse(input);

  const { categories, dishes } = await getMenu();
  if (!categories.some((c) => c.slug === parsed.categorySlug)) {
    throw new Error("Unknown category");
  }

  // Unique slug from the dish name.
  const base = slugify(parsed.nameEn) || "dish";
  const taken = new Set(dishes.map((d) => d.slug));
  let slug = base;
  for (let n = 2; taken.has(slug); n++) slug = `${base}-${n}`;

  await addCustomDish({ slug, ...parsed });
  revalidatePublic();
  revalidatePath("/admin/menu");
  return { ok: true, slug };
}

export async function deleteDishAction(slug: string) {
  await assertAdmin();
  await removeDish(String(slug));
  revalidatePublic();
  revalidatePath("/admin/menu");
  return { ok: true };
}

export async function restoreDishAction(slug: string) {
  await assertAdmin();
  await restoreDish(String(slug));
  revalidatePublic();
  revalidatePath("/admin/menu");
  return { ok: true };
}

/* ---------------------- Brand copy (About / Catering / Event) ---------------------- */

const brandCopySchema = z.object({
  mottoHeadlineEn: z.string().trim().max(120).optional(),
  mottoLeadEn: z.string().trim().max(300).optional(),
  mottoBodyEn: z.string().trim().max(1500).optional(),
  chefIntroEn: z.string().trim().max(400).optional(),
  cateringIntroEn: z.string().trim().max(400).optional(),
  eventCapacity: z.string().trim().max(80).optional(),
  eventPackages: z
    .array(
      z.object({
        name: z.string().trim().min(1).max(60),
        price: z.string().trim().min(1).max(30),
        note: z.string().trim().max(220),
      }),
    )
    .max(4)
    .optional(),
});

export async function saveBrandCopyAction(patch: BrandCopy) {
  await assertAdmin();
  const parsed = brandCopySchema.parse(patch);
  await updateBrandCopy(parsed);
  revalidatePath("/our-story");
  revalidatePath("/catering");
  revalidatePath("/event-hall");
  revalidatePath("/admin/content");
  return { ok: true };
}

/* ----------------------------- Reviews ----------------------------- */

const reviewSchema = z.object({
  id: z.string().trim().max(60).optional(),
  authorName: z.string().trim().min(1).max(80),
  rating: z.number().int().min(1).max(5),
  body: z.string().trim().min(1).max(600),
  locationSlug: z.string().trim().max(40).optional(),
  reviewedAt: z.string().trim().max(20).optional(),
});

export async function saveReviewAction(input: unknown) {
  await assertAdmin();
  const parsed = reviewSchema.parse(input);
  const id = parsed.id || crypto.randomUUID();
  await upsertReview({ ...parsed, id });
  revalidatePath("/");
  revalidatePath("/admin/reviews");
  return { ok: true, id };
}

export async function deleteReviewAction(id: string) {
  await assertAdmin();
  await deleteReview(String(id));
  revalidatePath("/");
  revalidatePath("/admin/reviews");
  return { ok: true };
}

const newCategorySchema = z.object({
  nameEn: z.string().trim().min(1).max(80),
  nameFr: z.string().trim().max(80).optional(),
  descEn: z.string().trim().max(300).optional(),
});

export async function addCategoryAction(input: unknown) {
  await assertAdmin();
  const parsed = newCategorySchema.parse(input);

  const { categories } = await getMenu();
  const base = slugify(parsed.nameEn) || "category";
  const taken = new Set(categories.map((c) => c.slug));
  let slug = base;
  for (let n = 2; taken.has(slug); n++) slug = `${base}-${n}`;

  await addCustomCategory({ slug, ...parsed });
  revalidatePublic();
  revalidatePath("/admin/menu");
  return { ok: true, slug };
}
