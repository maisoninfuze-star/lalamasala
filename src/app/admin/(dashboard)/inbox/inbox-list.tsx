"use client";

import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import { Mail, Phone, Calendar, Users, MapPin, Trash2, Loader2, Inbox } from "lucide-react";
import { deleteInquiryAction } from "../../actions";
import type { Inquiry, InquiryKind } from "@/lib/inquiries";

const KIND_LABEL: Record<InquiryKind, string> = {
  catering: "Catering",
  event: "Event Hall",
  contact: "Contact",
};

const KIND_STYLE: Record<InquiryKind, string> = {
  catering: "bg-[color:var(--lm-burgundy)] text-ivory",
  event: "bg-[color:var(--lm-saffron)] text-[color:var(--lm-wine)]",
  contact: "bg-[color:var(--lm-cream)] text-[color:var(--lm-charcoal)] border border-[color:var(--lm-line)]",
};

const FILTERS: { key: "all" | InquiryKind; label: string }[] = [
  { key: "all", label: "All" },
  { key: "catering", label: "Catering" },
  { key: "event", label: "Event Hall" },
  { key: "contact", label: "Contact" },
];

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("en-CA", { dateStyle: "medium", timeStyle: "short" });
}

function InquiryCard({ inquiry, onDeleted }: { inquiry: Inquiry; onDeleted: (id: string) => void }) {
  const [pending, start] = useTransition();

  function remove() {
    if (!confirm(`Delete this ${KIND_LABEL[inquiry.kind]} message from ${inquiry.name}?`)) return;
    start(async () => {
      try {
        await deleteInquiryAction(inquiry.createdAt);
        onDeleted(inquiry.createdAt);
        toast.success("Message deleted");
      } catch {
        toast.error("Could not delete. Please try again.");
      }
    });
  }

  return (
    <article className="rounded-[var(--radius-md)] border border-[color:var(--lm-line)] bg-[color:var(--lm-ivory)] p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${KIND_STYLE[inquiry.kind]}`}>
            {KIND_LABEL[inquiry.kind]}
          </span>
          <h2 className="mt-2 font-serif text-xl">{inquiry.name}</h2>
        </div>
        <div className="flex items-center gap-3">
          <time className="text-xs text-[color:var(--muted-foreground)]">{formatDate(inquiry.createdAt)}</time>
          <button
            type="button"
            onClick={remove}
            disabled={pending}
            aria-label="Delete message"
            className="grid size-8 place-items-center rounded-full text-[color:var(--muted-foreground)] transition-colors hover:bg-[color:var(--lm-cream)] hover:text-[color:var(--lm-crimson)] disabled:opacity-50"
          >
            {pending ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
          </button>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-sm">
        <a href={`mailto:${inquiry.email}`} className="inline-flex items-center gap-1.5 hover:text-[color:var(--lm-burgundy)]">
          <Mail className="size-4 text-[color:var(--lm-saffron)]" /> {inquiry.email}
        </a>
        {inquiry.phone && (
          <a href={`tel:${inquiry.phone}`} className="inline-flex items-center gap-1.5 hover:text-[color:var(--lm-burgundy)]">
            <Phone className="size-4 text-[color:var(--lm-saffron)]" /> {inquiry.phone}
          </a>
        )}
        {inquiry.location && (
          <span className="inline-flex items-center gap-1.5 text-[color:var(--muted-foreground)]">
            <MapPin className="size-4 text-[color:var(--lm-saffron)]" /> {inquiry.location}
          </span>
        )}
        {inquiry.eventDate && (
          <span className="inline-flex items-center gap-1.5 text-[color:var(--muted-foreground)]">
            <Calendar className="size-4 text-[color:var(--lm-saffron)]" /> {inquiry.eventDate}
          </span>
        )}
        {inquiry.guestCount ? (
          <span className="inline-flex items-center gap-1.5 text-[color:var(--muted-foreground)]">
            <Users className="size-4 text-[color:var(--lm-saffron)]" /> {inquiry.guestCount} guests
          </span>
        ) : null}
      </div>

      {inquiry.message && (
        <p className="mt-3 whitespace-pre-wrap border-t border-[color:var(--lm-line)] pt-3 text-sm leading-relaxed text-[color:var(--lm-charcoal)]/90">
          {inquiry.message}
        </p>
      )}
    </article>
  );
}

export function InboxList({ inquiries }: { inquiries: Inquiry[] }) {
  const [items, setItems] = useState(inquiries);
  const [filter, setFilter] = useState<"all" | InquiryKind>("all");

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: items.length, catering: 0, event: 0, contact: 0 };
    for (const i of items) c[i.kind] = (c[i.kind] ?? 0) + 1;
    return c;
  }, [items]);

  const visible = filter === "all" ? items : items.filter((i) => i.kind === filter);

  if (items.length === 0) {
    return (
      <div className="rounded-[var(--radius-lg)] border border-dashed border-[color:var(--lm-line)] p-12 text-center">
        <Inbox className="mx-auto size-8 text-[color:var(--lm-saffron)]" />
        <p className="mt-4 font-medium">No messages yet.</p>
        <p className="mt-1 text-sm text-[color:var(--muted-foreground)]">
          Catering, event and contact requests from your website will appear here.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setFilter(f.key)}
            className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
              filter === f.key
                ? "bg-[color:var(--lm-burgundy)] text-ivory"
                : "border border-[color:var(--lm-line)] hover:bg-[color:var(--lm-cream)]"
            }`}
          >
            {f.label}
            <span className="ml-1.5 opacity-70">{counts[f.key] ?? 0}</span>
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {visible.map((i) => (
          <InquiryCard
            key={i.createdAt}
            inquiry={i}
            onDeleted={(id) => setItems((list) => list.filter((x) => x.createdAt !== id))}
          />
        ))}
      </div>
    </div>
  );
}
