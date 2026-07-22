"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Star, Plus, Trash2, Loader2, Check } from "lucide-react";
import { saveReviewAction, deleteReviewAction } from "../../actions";
import type { StoredReview } from "@/lib/content-store";
import { cn } from "@/lib/utils";

interface LocOption {
  slug: string;
  name: string;
}

const inputCls =
  "w-full rounded-[var(--radius-sm)] border border-[color:var(--lm-line)] bg-white px-3 py-2 text-sm outline-none focus:border-[color:var(--lm-saffron)]";

function StarPicker({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <div className="flex gap-1" role="radiogroup" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={value === n}
          aria-label={`${n} star${n === 1 ? "" : "s"}`}
          onClick={() => onChange(n)}
          className="p-0.5"
        >
          <Star
            className={cn(
              "size-6 transition-colors",
              n <= value ? "text-[color:var(--lm-saffron)]" : "text-[color:var(--lm-line)]",
            )}
            fill={n <= value ? "currentColor" : "none"}
          />
        </button>
      ))}
    </div>
  );
}

function ReviewForm({
  initial,
  locations,
  onDone,
}: {
  initial?: StoredReview;
  locations: LocOption[];
  onDone?: () => void;
}) {
  const [author, setAuthor] = useState(initial?.authorName ?? "");
  const [rating, setRating] = useState(initial?.rating ?? 5);
  const [body, setBody] = useState(initial?.body ?? "");
  const [locationSlug, setLocationSlug] = useState(initial?.locationSlug ?? "");
  const [reviewedAt, setReviewedAt] = useState(initial?.reviewedAt ?? "");
  const [pending, start] = useTransition();
  const router = useRouter();

  function submit() {
    if (!author.trim()) return toast.error("Please add the guest's name.");
    if (!body.trim()) return toast.error("Please add the review text.");
    start(async () => {
      try {
        await saveReviewAction({
          id: initial?.id,
          authorName: author.trim(),
          rating,
          body: body.trim(),
          locationSlug: locationSlug || undefined,
          reviewedAt: reviewedAt || undefined,
        });
        toast.success(initial ? "Review updated" : "Review added");
        if (!initial) {
          setAuthor("");
          setRating(5);
          setBody("");
          setLocationSlug("");
          setReviewedAt("");
        }
        onDone?.();
        router.refresh();
      } catch {
        toast.error("Could not save the review. Please try again.");
      }
    });
  }

  return (
    <div className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-xs font-medium uppercase tracking-wide text-[color:var(--muted-foreground)]">Guest name *</span>
          <input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="e.g. Sarah M." className={cn(inputCls, "mt-1")} />
        </label>
        <div className="block">
          <span className="text-xs font-medium uppercase tracking-wide text-[color:var(--muted-foreground)]">Rating</span>
          <div className="mt-1.5">
            <StarPicker value={rating} onChange={setRating} />
          </div>
        </div>
        <label className="block">
          <span className="text-xs font-medium uppercase tracking-wide text-[color:var(--muted-foreground)]">Location</span>
          <select value={locationSlug} onChange={(e) => setLocationSlug(e.target.value)} className={cn(inputCls, "mt-1")}>
            <option value="">Not specified</option>
            {locations.map((l) => (
              <option key={l.slug} value={l.slug}>{l.name}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-xs font-medium uppercase tracking-wide text-[color:var(--muted-foreground)]">Date</span>
          <input type="date" value={reviewedAt} onChange={(e) => setReviewedAt(e.target.value)} className={cn(inputCls, "mt-1")} />
        </label>
      </div>
      <label className="block">
        <span className="text-xs font-medium uppercase tracking-wide text-[color:var(--muted-foreground)]">Review *</span>
        <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={3} placeholder="What did the guest say?" className={cn(inputCls, "mt-1")} />
      </label>
      <div>
        <button type="button" onClick={submit} disabled={pending} className="lm-btn disabled:opacity-60">
          {pending ? <Loader2 className="size-4 animate-spin" /> : initial ? <Check className="size-4" /> : <Plus className="size-4" />}
          {initial ? "Save changes" : "Add review"}
        </button>
      </div>
    </div>
  );
}

function ReviewCard({ review, locations }: { review: StoredReview; locations: LocOption[] }) {
  const [editing, setEditing] = useState(false);
  const [pending, start] = useTransition();
  const router = useRouter();

  function remove() {
    if (!confirm(`Delete the review from ${review.authorName}?`)) return;
    start(async () => {
      try {
        await deleteReviewAction(review.id);
        toast.success("Review deleted");
        router.refresh();
      } catch {
        toast.error("Could not delete. Please try again.");
      }
    });
  }

  const locName = locations.find((l) => l.slug === review.locationSlug)?.name;

  return (
    <article className="rounded-[var(--radius-md)] border border-[color:var(--lm-line)] bg-[color:var(--lm-ivory)] p-5">
      {editing ? (
        <ReviewForm initial={review} locations={locations} onDone={() => setEditing(false)} />
      ) : (
        <>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex gap-0.5" aria-label={`${review.rating} out of 5 stars`}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star
                    key={n}
                    className={cn("size-4", n <= review.rating ? "text-[color:var(--lm-saffron)]" : "text-[color:var(--lm-line)]")}
                    fill={n <= review.rating ? "currentColor" : "none"}
                  />
                ))}
              </div>
              <h2 className="mt-1.5 font-serif text-lg">{review.authorName}</h2>
              <p className="text-xs text-[color:var(--muted-foreground)]">
                {[locName, review.reviewedAt].filter(Boolean).join(" · ") || "—"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="rounded-[var(--radius-pill)] border border-[color:var(--lm-line)] px-3 py-1.5 text-sm font-medium hover:bg-[color:var(--lm-cream)]"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={remove}
                disabled={pending}
                aria-label="Delete review"
                className="grid size-8 place-items-center rounded-full text-[color:var(--muted-foreground)] transition-colors hover:bg-[color:var(--lm-cream)] hover:text-[color:var(--lm-crimson)]"
              >
                {pending ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
              </button>
            </div>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-[color:var(--lm-charcoal)]/90">&ldquo;{review.body}&rdquo;</p>
        </>
      )}
    </article>
  );
}

export function ReviewsEditor({ reviews, locations }: { reviews: StoredReview[]; locations: LocOption[] }) {
  return (
    <div className="max-w-3xl space-y-8">
      <section className="rounded-[var(--radius-md)] border border-[color:var(--lm-line)] bg-[color:var(--lm-ivory)] p-5">
        <h2 className="mb-4 font-serif text-xl">Add a review</h2>
        <ReviewForm locations={locations} />
      </section>

      {reviews.length > 0 ? (
        <section className="space-y-4">
          <h2 className="font-serif text-xl">Published ({reviews.length})</h2>
          {reviews.map((r) => (
            <ReviewCard key={r.id} review={r} locations={locations} />
          ))}
        </section>
      ) : (
        <p className="text-sm text-[color:var(--muted-foreground)]">
          No reviews yet. The homepage Guest Book stays hidden until you add one.
        </p>
      )}
    </div>
  );
}
