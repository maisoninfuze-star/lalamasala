import { PageHeader } from "./page-header";
import { Reveal } from "./hud";

export interface LegalSection {
  h: string;
  body: string[];
}

/** Shared cinematic layout for policy pages (privacy, terms, refunds, a11y). */
export function LegalPage({
  index,
  label,
  title,
  updated,
  intro,
  sections,
}: {
  index: string;
  label: string;
  title: string;
  updated: string;
  intro?: string;
  sections: LegalSection[];
}) {
  return (
    <>
      <PageHeader index={index} label={label} right={`Updated ${updated}`} title={title} subtitle={intro} />
      <section className="lm-container max-w-3xl pb-28">
        {sections.map((s, i) => (
          <Reveal key={s.h}>
            <div className="border-t border-[color:var(--border)] py-8">
              <span className="hud">0{i + 1}</span>
              <h2 className="mt-2 text-xl font-medium tracking-tight">{s.h}</h2>
              <div className="mt-3 space-y-3 text-sm leading-relaxed text-[color:var(--muted-foreground)]">
                {s.body.map((p) => (
                  <p key={p.slice(0, 24)}>{p}</p>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
        <div className="border-t border-[color:var(--border)]" />
      </section>
    </>
  );
}
