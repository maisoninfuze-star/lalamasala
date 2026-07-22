import type { Review } from "@/lib/types";

/*
  REAL REVIEWS ONLY. This array is intentionally empty at seed time — the brief
  is explicit that testimonials must never be invented. Reviews are added by
  staff in the admin dashboard or imported through a legitimate Google Reviews
  integration, and surfaced from the `reviews` table in production.
*/
export const REVIEWS: Review[] = [];
