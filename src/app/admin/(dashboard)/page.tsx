import Link from "next/link";
import { UtensilsCrossed, MapPin, FileText, ImageIcon, Inbox } from "lucide-react";
import { getMenu, getLocations } from "@/lib/menu-data";
import { readStore } from "@/lib/content-store";
import { readInquiries } from "@/lib/inquiries";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const [{ dishes, categories }, locations, store, inquiries] = await Promise.all([
    getMenu(),
    getLocations(),
    readStore(),
    readInquiries(),
  ]);

  const soldOut = dishes.filter((d) => d.isSoldOut).length;
  const edits = Object.keys(store.dishes).length;

  const stats = [
    { label: "Dishes on the menu", value: dishes.length },
    { label: "Categories", value: categories.length },
    { label: "Locations", value: locations.length },
    { label: "New messages", value: inquiries.length },
  ];

  const actions = [
    ...(inquiries.length
      ? [{ href: "/admin/inbox", title: `Read ${inquiries.length} message${inquiries.length === 1 ? "" : "s"}`, body: "Catering, event and contact requests from your site.", icon: Inbox }]
      : []),
    { href: "/admin/menu", title: "Edit menu & prices", body: "Change a price, mark a dish sold out, or swap a photo.", icon: UtensilsCrossed },
    { href: "/admin/menu", title: "Replace a food photo", body: "Upload a new picture for any dish in seconds.", icon: ImageIcon },
    { href: "/admin/locations", title: "Update a location", body: "Edit phone, address, prep time or pause ordering.", icon: MapPin },
    { href: "/admin/content", title: "Edit site text", body: "Promo banner, About story, catering intro & event packages.", icon: FileText },
  ];

  return (
    <div>
      <header className="mb-8">
        <p className="text-sm text-[color:var(--muted-foreground)]">Welcome back</p>
        <h1 className="font-serif text-3xl">Here’s your restaurant at a glance</h1>
        {store.updatedAt && (
          <p className="mt-1 text-sm text-[color:var(--muted-foreground)]">
            Last change saved {new Date(store.updatedAt).toLocaleString("en-CA")}
            {edits > 0 ? ` · ${edits} dish${edits === 1 ? "" : "es"} customised` : ""}
          </p>
        )}
      </header>

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-[var(--radius-md)] border border-[color:var(--lm-line)] bg-[color:var(--lm-ivory)] p-5"
          >
            <div className="tnum font-serif text-4xl">{s.value}</div>
            <div className="mt-1 text-sm text-[color:var(--muted-foreground)]">{s.label}</div>
          </div>
        ))}
      </section>

      <h2 className="mt-10 mb-4 font-serif text-xl">Quick actions</h2>
      <section className="grid gap-4 sm:grid-cols-2">
        {actions.map((a) => {
          const Icon = a.icon;
          return (
            <Link
              key={a.title}
              href={a.href}
              className="group flex items-start gap-4 rounded-[var(--radius-md)] border border-[color:var(--lm-line)] bg-[color:var(--lm-ivory)] p-5 transition-colors hover:border-[color:var(--lm-saffron)]"
            >
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-[color:var(--lm-cream)] text-[color:var(--lm-burgundy)]">
                <Icon className="size-5" aria-hidden />
              </span>
              <span>
                <span className="block font-medium">{a.title}</span>
                <span className="mt-0.5 block text-sm text-[color:var(--muted-foreground)]">
                  {a.body}
                </span>
              </span>
            </Link>
          );
        })}
      </section>
    </div>
  );
}
