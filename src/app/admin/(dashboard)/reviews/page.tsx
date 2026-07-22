import { getReviews, getLocations } from "@/lib/menu-data";
import { ReviewsEditor } from "./reviews-editor";

export const dynamic = "force-dynamic";

export default async function AdminReviewsPage() {
  const [reviews, locations] = await Promise.all([getReviews(), getLocations()]);

  return (
    <div>
      <header className="mb-6">
        <h1 className="font-serif text-3xl">Reviews</h1>
        <p className="mt-1 text-sm text-[color:var(--muted-foreground)]">
          Add real guest reviews and they appear in the &ldquo;Guest Book&rdquo; on your homepage.
          Only genuine reviews, please — copy them from Google or your comment cards.
        </p>
      </header>
      <ReviewsEditor
        reviews={reviews}
        locations={locations.map((l) => ({ slug: l.slug, name: l.name }))}
      />
    </div>
  );
}
