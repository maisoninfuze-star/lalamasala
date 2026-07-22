"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Loader2, Check } from "lucide-react";
import { saveContentAction, saveBrandCopyAction } from "../../actions";

interface Pkg {
  name: string;
  price: string;
  note: string;
}

interface Content {
  promoBanner: string;
  mottoHeadlineEn: string;
  mottoLeadEn: string;
  mottoBodyEn: string;
  chefIntroEn: string;
  cateringIntroEn: string;
  eventCapacity: string;
  eventPackages: Pkg[];
}

export function ContentEditor({ initial }: { initial: Content }) {
  const [c, setC] = useState(initial);
  const [pending, start] = useTransition();
  const set = <K extends keyof Content>(k: K, v: Content[K]) => setC((s) => ({ ...s, [k]: v }));

  const setPkg = (i: number, patch: Partial<Pkg>) =>
    setC((s) => ({
      ...s,
      eventPackages: s.eventPackages.map((p, idx) => (idx === i ? { ...p, ...patch } : p)),
    }));

  function save() {
    start(async () => {
      try {
        await Promise.all([
          saveContentAction({ promoBanner: c.promoBanner }),
          saveBrandCopyAction({
            mottoHeadlineEn: c.mottoHeadlineEn,
            mottoLeadEn: c.mottoLeadEn,
            mottoBodyEn: c.mottoBodyEn,
            chefIntroEn: c.chefIntroEn,
            cateringIntroEn: c.cateringIntroEn,
            eventCapacity: c.eventCapacity,
            eventPackages: c.eventPackages,
          }),
        ]);
        toast.success("Site text saved");
      } catch {
        toast.error("Could not save. Please try again.");
      }
    });
  }

  return (
    <div className="max-w-2xl space-y-8">
      {/* Announcement */}
      <Card title="Announcement" hint="A dismissible banner shown on every page. Leave empty to hide.">
        <Group label="Promo banner">
          <input
            value={c.promoBanner}
            onChange={(e) => set("promoBanner", e.target.value)}
            placeholder="e.g. 10% off your first pickup order"
            className="input"
          />
        </Group>
      </Card>

      {/* About storybook */}
      <Card title="About Us — the storybook" hint="These lines appear inside the family-story book on your About page.">
        <Group label="Motto headline" hint="The quote on the “We cook & serve with love” page.">
          <input value={c.mottoHeadlineEn} onChange={(e) => set("mottoHeadlineEn", e.target.value)} className="input" />
        </Group>
        <Group label="Motto lead" hint="The line under “Motto & Vision”.">
          <textarea value={c.mottoLeadEn} onChange={(e) => set("mottoLeadEn", e.target.value)} rows={2} className="input" />
        </Group>
        <Group label="Motto text" hint="Separate paragraphs with a blank line.">
          <textarea value={c.mottoBodyEn} onChange={(e) => set("mottoBodyEn", e.target.value)} rows={5} className="input" />
        </Group>
        <Group label="Chef Raghbir — short bio" hint="Keep it to a sentence or two so it fits the page.">
          <textarea value={c.chefIntroEn} onChange={(e) => set("chefIntroEn", e.target.value)} rows={3} className="input" />
        </Group>
      </Card>

      {/* Catering */}
      <Card title="Catering">
        <Group label="Intro line" hint="Shown under the Catering page title.">
          <textarea value={c.cateringIntroEn} onChange={(e) => set("cateringIntroEn", e.target.value)} rows={3} className="input" />
        </Group>
      </Card>

      {/* Event hall */}
      <Card title="Event Hall — Kingston">
        <Group label="Capacity line" hint="e.g. “Up to 70 guests standing · 64 seated”.">
          <input value={c.eventCapacity} onChange={(e) => set("eventCapacity", e.target.value)} className="input" />
        </Group>
        <div className="space-y-4">
          {c.eventPackages.map((p, i) => (
            <fieldset key={i} className="rounded-[var(--radius-sm)] border border-[color:var(--lm-line)] p-4">
              <legend className="px-1 text-xs font-semibold uppercase tracking-wide text-[color:var(--muted-foreground)]">
                Package {i + 1}
              </legend>
              <div className="grid gap-3 sm:grid-cols-2">
                <Group label="Name">
                  <input value={p.name} onChange={(e) => setPkg(i, { name: e.target.value })} className="input" />
                </Group>
                <Group label="Price" hint="Free text — e.g. “$40 / person”.">
                  <input value={p.price} onChange={(e) => setPkg(i, { price: e.target.value })} className="input" />
                </Group>
              </div>
              <Group label="Details">
                <textarea value={p.note} onChange={(e) => setPkg(i, { note: e.target.value })} rows={2} className="input" />
              </Group>
            </fieldset>
          ))}
        </div>
      </Card>

      <button type="button" onClick={save} disabled={pending} className="lm-btn disabled:opacity-60">
        {pending ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
        Save changes
      </button>

      <style>{`
        .input {
          width: 100%;
          border-radius: var(--radius-sm);
          border: 1px solid var(--lm-line);
          background: #fff;
          padding: 0.6rem 0.75rem;
          outline: none;
          font: inherit;
        }
        .input:focus { border-color: var(--lm-saffron); }
      `}</style>
    </div>
  );
}

function Card({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[var(--radius-md)] border border-[color:var(--lm-line)] bg-[color:var(--lm-ivory)] p-5">
      <h2 className="font-serif text-xl">{title}</h2>
      {hint && <p className="mt-0.5 text-xs text-[color:var(--muted-foreground)]">{hint}</p>}
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

function Group({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium">{label}</span>
      {hint && <span className="ml-2 text-xs text-[color:var(--muted-foreground)]">{hint}</span>}
      <div className="mt-1.5">{children}</div>
    </label>
  );
}
