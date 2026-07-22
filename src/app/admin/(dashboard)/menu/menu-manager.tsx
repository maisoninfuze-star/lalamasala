"use client";

import { useState, useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Star, Ban, Upload, Check, Loader2, Plus, Trash2, Tag, RotateCcw, X } from "lucide-react";
import { saveDishAction, addDishAction, deleteDishAction, restoreDishAction, addCategoryAction } from "../../actions";
import { cn } from "@/lib/utils";

interface DishRowData {
  slug: string;
  name: string;
  image: string | null;
  basePriceCents: number;
  isPopular: boolean;
  isFeatured: boolean;
  isSoldOut: boolean;
  isActive: boolean;
  isCustom: boolean;
}

interface Group {
  category: { slug: string; name: string };
  dishes: DishRowData[];
}

interface RemovedDish {
  slug: string;
  name: string;
  image: string | null;
}

const inputCls =
  "w-full rounded-[var(--radius-sm)] border border-[color:var(--lm-line)] bg-white px-3 py-2 text-sm outline-none focus:border-[color:var(--lm-saffron)]";

export function MenuManager({ groups, removed }: { groups: Group[]; removed: RemovedDish[] }) {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <input
          type="search"
          placeholder="Search dishes…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full max-w-sm rounded-[var(--radius-pill)] border border-[color:var(--lm-line)] bg-[color:var(--lm-ivory)] px-4 py-2.5 text-sm outline-none focus:border-[color:var(--lm-saffron)]"
        />
        <AddDishPanel categories={groups.map((g) => g.category)} />
        <AddCategoryPanel />
      </div>

      <div className="space-y-8">
        {groups.map((g) => {
          const dishes = g.dishes.filter((d) => !q || d.name.toLowerCase().includes(q));
          if (dishes.length === 0) return null;
          return (
            <section key={g.category.slug}>
              <h2 className="mb-3 font-serif text-xl">{g.category.name}</h2>
              <div className="overflow-hidden rounded-[var(--radius-md)] border border-[color:var(--lm-line)] bg-[color:var(--lm-ivory)]">
                {dishes.map((d, i) => (
                  <DishRow key={d.slug} dish={d} last={i === dishes.length - 1} />
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {removed.length > 0 && <RemovedTray removed={removed} />}
    </div>
  );
}

/* ---------------------------- Add a new dish ---------------------------- */

function AddDishPanel({ categories }: { categories: { slug: string; name: string }[] }) {
  const [open, setOpen] = useState(false);
  const [nameEn, setNameEn] = useState("");
  const [nameFr, setNameFr] = useState("");
  const [categorySlug, setCategorySlug] = useState(categories[0]?.slug ?? "");
  const [price, setPrice] = useState("");
  const [descEn, setDescEn] = useState("");
  const [flags, setFlags] = useState({ isVegan: false, isGlutenFriendly: false, containsDairy: false, containsNuts: false });
  const [pending, start] = useTransition();
  const router = useRouter();

  function submit() {
    const cents = Math.round(parseFloat(price) * 100);
    if (!nameEn.trim()) return toast.error("Please give the dish a name.");
    if (Number.isNaN(cents) || cents < 0) return toast.error("Please enter a valid price.");
    start(async () => {
      try {
        await addDishAction({
          nameEn: nameEn.trim(),
          nameFr: nameFr.trim() || undefined,
          categorySlug,
          basePriceCents: cents,
          descEn: descEn.trim() || undefined,
          ...flags,
        });
        toast.success(`${nameEn.trim()} added to the menu`);
        setNameEn(""); setNameFr(""); setPrice(""); setDescEn("");
        setFlags({ isVegan: false, isGlutenFriendly: false, containsDairy: false, containsNuts: false });
        setOpen(false);
        router.refresh();
      } catch {
        toast.error("Could not add the dish. Please try again.");
      }
    });
  }

  const FLAG_LABELS: { key: keyof typeof flags; label: string }[] = [
    { key: "isVegan", label: "Vegan" },
    { key: "isGlutenFriendly", label: "Gluten-friendly" },
    { key: "containsDairy", label: "Contains dairy" },
    { key: "containsNuts", label: "Contains nuts" },
  ];

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] bg-[color:var(--lm-burgundy)] px-4 py-2.5 text-sm font-semibold text-ivory"
      >
        {open ? <X className="size-4" /> : <Plus className="size-4" />}
        {open ? "Close" : "Add a dish"}
      </button>

      {open && (
        <div className="w-full rounded-[var(--radius-md)] border border-[color:var(--lm-line)] bg-[color:var(--lm-ivory)] p-5">
          <h3 className="font-serif text-xl">New dish</h3>
          <p className="mt-0.5 text-xs text-[color:var(--muted-foreground)]">
            It appears on your website right away — you can add a photo from its row afterwards.
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-xs font-medium uppercase tracking-wide text-[color:var(--muted-foreground)]">Name (English) *</span>
              <input value={nameEn} onChange={(e) => setNameEn(e.target.value)} placeholder="e.g. Paneer 65" className={cn(inputCls, "mt-1")} />
            </label>
            <label className="block">
              <span className="text-xs font-medium uppercase tracking-wide text-[color:var(--muted-foreground)]">Name (French)</span>
              <input value={nameFr} onChange={(e) => setNameFr(e.target.value)} placeholder="Optional" className={cn(inputCls, "mt-1")} />
            </label>
            <label className="block">
              <span className="text-xs font-medium uppercase tracking-wide text-[color:var(--muted-foreground)]">Category</span>
              <select value={categorySlug} onChange={(e) => setCategorySlug(e.target.value)} className={cn(inputCls, "mt-1")}>
                {categories.map((c) => (
                  <option key={c.slug} value={c.slug}>{c.name}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-xs font-medium uppercase tracking-wide text-[color:var(--muted-foreground)]">Price ($) *</span>
              <input type="number" step="0.01" min="0" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="12.99" className={cn(inputCls, "mt-1")} />
            </label>
            <label className="block sm:col-span-2">
              <span className="text-xs font-medium uppercase tracking-wide text-[color:var(--muted-foreground)]">Description</span>
              <textarea value={descEn} onChange={(e) => setDescEn(e.target.value)} rows={2} placeholder="A short, appetising description." className={cn(inputCls, "mt-1")} />
            </label>
          </div>

          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
            {FLAG_LABELS.map((f) => (
              <label key={f.key} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={flags[f.key]}
                  onChange={(e) => setFlags((s) => ({ ...s, [f.key]: e.target.checked }))}
                  className="size-4 accent-[color:var(--lm-burgundy)]"
                />
                {f.label}
              </label>
            ))}
          </div>

          <button type="button" onClick={submit} disabled={pending} className="lm-btn mt-4 disabled:opacity-60">
            {pending ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
            Add dish
          </button>
        </div>
      )}
    </>
  );
}

/* --------------------------- Add a new category --------------------------- */

function AddCategoryPanel() {
  const [open, setOpen] = useState(false);
  const [nameEn, setNameEn] = useState("");
  const [nameFr, setNameFr] = useState("");
  const [pending, start] = useTransition();
  const router = useRouter();

  function submit() {
    if (!nameEn.trim()) return toast.error("Please give the category a name.");
    start(async () => {
      try {
        await addCategoryAction({ nameEn: nameEn.trim(), nameFr: nameFr.trim() || undefined });
        toast.success(`Category “${nameEn.trim()}” added`);
        setNameEn(""); setNameFr("");
        setOpen(false);
        router.refresh();
      } catch {
        toast.error("Could not add the category. Please try again.");
      }
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] border border-[color:var(--lm-line)] px-4 py-2.5 text-sm font-semibold hover:bg-[color:var(--lm-cream)]"
      >
        <Tag className="size-4" />
        {open ? "Close" : "Add a category"}
      </button>

      {open && (
        <div className="flex w-full flex-wrap items-end gap-3 rounded-[var(--radius-md)] border border-[color:var(--lm-line)] bg-[color:var(--lm-ivory)] p-4">
          <label className="block min-w-52 flex-1">
            <span className="text-xs font-medium uppercase tracking-wide text-[color:var(--muted-foreground)]">Category name (English) *</span>
            <input value={nameEn} onChange={(e) => setNameEn(e.target.value)} placeholder="e.g. Chef's Specials" className={cn(inputCls, "mt-1")} />
          </label>
          <label className="block min-w-52 flex-1">
            <span className="text-xs font-medium uppercase tracking-wide text-[color:var(--muted-foreground)]">Name (French)</span>
            <input value={nameFr} onChange={(e) => setNameFr(e.target.value)} placeholder="Optional" className={cn(inputCls, "mt-1")} />
          </label>
          <button type="button" onClick={submit} disabled={pending} className="lm-btn disabled:opacity-60">
            {pending ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
            Add
          </button>
        </div>
      )}
    </>
  );
}

/* ------------------------------- Dish rows ------------------------------- */

function DishRow({ dish, last }: { dish: DishRowData; last: boolean }) {
  const [price, setPrice] = useState((dish.basePriceCents / 100).toFixed(2));
  const [popular, setPopular] = useState(dish.isPopular);
  const [soldOut, setSoldOut] = useState(dish.isSoldOut);
  const [image, setImage] = useState(dish.image);
  const [pending, startTransition] = useTransition();
  const [deleting, startDelete] = useTransition();
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const dirty =
    price !== (dish.basePriceCents / 100).toFixed(2) ||
    popular !== dish.isPopular ||
    soldOut !== dish.isSoldOut ||
    image !== dish.image;

  function save(extra?: { image?: string }) {
    const cents = Math.round(parseFloat(price) * 100);
    if (Number.isNaN(cents) || cents < 0) {
      toast.error("Please enter a valid price.");
      return;
    }
    startTransition(async () => {
      try {
        await saveDishAction(dish.slug, {
          basePriceCents: cents,
          isPopular: popular,
          isSoldOut: soldOut,
          image: extra?.image ?? image ?? undefined,
        });
        toast.success(`${dish.name} saved`);
      } catch {
        toast.error("Could not save. Please try again.");
      }
    });
  }

  function remove() {
    const note = dish.isCustom
      ? "This deletes the dish permanently."
      : "You can restore it later from the “Removed dishes” tray at the bottom.";
    if (!confirm(`Remove “${dish.name}” from the menu?\n${note}`)) return;
    startDelete(async () => {
      try {
        await deleteDishAction(dish.slug);
        toast.success(`${dish.name} removed`);
        router.refresh();
      } catch {
        toast.error("Could not remove. Please try again.");
      }
    });
  }

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("slug", dish.slug);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setImage(data.url);
      save({ image: data.url });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-3 p-3 sm:flex-nowrap",
        !last && "border-b border-[color:var(--lm-line)]",
        soldOut && "opacity-70",
      )}
    >
      {/* Thumbnail + upload */}
      <div className="relative size-14 shrink-0 overflow-hidden rounded-[var(--radius-sm)] bg-[color:var(--lm-cream)]">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="grid h-full place-items-center text-[color:var(--muted-foreground)]">
            <Upload className="size-4" />
          </div>
        )}
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          aria-label={`Replace photo for ${dish.name}`}
          className="absolute inset-0 grid place-items-center bg-black/45 text-white opacity-0 transition-opacity hover:opacity-100"
        >
          {uploading ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/avif"
          className="hidden"
          onChange={onFile}
        />
      </div>

      {/* Name */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate font-medium">{dish.name}</span>
          {dish.isCustom && (
            <span className="rounded-full bg-[color:var(--lm-saffron)]/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[color:var(--lm-clay)]">
              Yours
            </span>
          )}
        </div>
        <div className="text-xs text-[color:var(--muted-foreground)]">{dish.slug}</div>
      </div>

      {/* Price */}
      <label className="flex items-center gap-1.5">
        <span className="text-sm text-[color:var(--muted-foreground)]">$</span>
        <input
          type="number"
          step="0.01"
          min="0"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="tnum w-24 rounded-[var(--radius-sm)] border border-[color:var(--lm-line)] bg-white px-2.5 py-1.5 text-right outline-none focus:border-[color:var(--lm-saffron)]"
        />
      </label>

      {/* Toggles */}
      <button
        type="button"
        onClick={() => setPopular((v) => !v)}
        aria-pressed={popular}
        title="Mark as popular"
        className={cn(
          "grid size-9 place-items-center rounded-[var(--radius-sm)] border transition-colors",
          popular
            ? "border-[color:var(--lm-saffron)] bg-[color:var(--lm-saffron)]/15 text-[color:var(--lm-clay)]"
            : "border-[color:var(--lm-line)] text-[color:var(--muted-foreground)]",
        )}
      >
        <Star className="size-4" fill={popular ? "currentColor" : "none"} />
      </button>
      <button
        type="button"
        onClick={() => setSoldOut((v) => !v)}
        aria-pressed={soldOut}
        title="Mark as sold out"
        className={cn(
          "grid size-9 place-items-center rounded-[var(--radius-sm)] border transition-colors",
          soldOut
            ? "border-red-300 bg-red-50 text-red-700"
            : "border-[color:var(--lm-line)] text-[color:var(--muted-foreground)]",
        )}
      >
        <Ban className="size-4" />
      </button>

      {/* Delete */}
      <button
        type="button"
        onClick={remove}
        disabled={deleting}
        title="Remove from menu"
        aria-label={`Remove ${dish.name} from the menu`}
        className="grid size-9 place-items-center rounded-[var(--radius-sm)] border border-[color:var(--lm-line)] text-[color:var(--muted-foreground)] transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-700"
      >
        {deleting ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
      </button>

      {/* Save */}
      <button
        type="button"
        onClick={() => save()}
        disabled={!dirty || pending}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] px-3.5 py-2 text-sm font-semibold transition-colors",
          dirty
            ? "bg-[color:var(--lm-burgundy)] text-ivory"
            : "bg-[color:var(--lm-cream)] text-[color:var(--muted-foreground)]",
        )}
      >
        {pending ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
        Save
      </button>
    </div>
  );
}

/* ---------------------------- Removed dishes ---------------------------- */

function RemovedTray({ removed }: { removed: RemovedDish[] }) {
  const [pendingSlug, setPendingSlug] = useState<string | null>(null);
  const [, start] = useTransition();
  const router = useRouter();

  function restore(slug: string, name: string) {
    setPendingSlug(slug);
    start(async () => {
      try {
        await restoreDishAction(slug);
        toast.success(`${name} is back on the menu`);
        router.refresh();
      } catch {
        toast.error("Could not restore. Please try again.");
      } finally {
        setPendingSlug(null);
      }
    });
  }

  return (
    <section className="mt-10">
      <h2 className="mb-1 font-serif text-xl">Removed dishes</h2>
      <p className="mb-3 text-sm text-[color:var(--muted-foreground)]">
        These are hidden from your website. Restore one to bring it back exactly as it was.
      </p>
      <div className="overflow-hidden rounded-[var(--radius-md)] border border-dashed border-[color:var(--lm-line)] bg-[color:var(--lm-cream)]/50">
        {removed.map((d, i) => (
          <div
            key={d.slug}
            className={cn(
              "flex items-center gap-3 p-3",
              i !== removed.length - 1 && "border-b border-[color:var(--lm-line)]",
            )}
          >
            <div className="size-10 shrink-0 overflow-hidden rounded-[var(--radius-sm)] bg-[color:var(--lm-cream)] opacity-60">
              {d.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={d.image} alt="" className="h-full w-full object-cover" />
              )}
            </div>
            <span className="min-w-0 flex-1 truncate text-sm text-[color:var(--muted-foreground)]">{d.name}</span>
            <button
              type="button"
              onClick={() => restore(d.slug, d.name)}
              disabled={pendingSlug === d.slug}
              className="inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] border border-[color:var(--lm-line)] px-3 py-1.5 text-sm font-medium hover:bg-white"
            >
              {pendingSlug === d.slug ? <Loader2 className="size-4 animate-spin" /> : <RotateCcw className="size-4" />}
              Restore
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
