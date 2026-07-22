import { SectionMarker, Reveal } from "./hud";
import { cn } from "@/lib/utils";

/** Cinematic interior-page header: HUD marker + optional marigold eyebrow +
 *  big editorial serif title + subtitle. Shared across all brand pages so they
 *  read as one family. */
export function PageHeader({
  index,
  label,
  right,
  eyebrow,
  title,
  subtitle,
}: {
  index: string;
  label: string;
  right?: string;
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: string;
}) {
  return (
    <header className="lm-container pb-10 pt-36 sm:pt-44">
      <SectionMarker index={index} label={label} right={right} />
      <Reveal className="mt-12">
        {eyebrow && <span className="hud accent-marigold">{eyebrow}</span>}
        <h1 className={cn("display-serif text-[clamp(2.5rem,7vw,5.5rem)]", eyebrow && "mt-5")}>
          {title}
        </h1>
      </Reveal>
      {subtitle && (
        <Reveal className="mt-6">
          <p className="max-w-xl text-[15px] leading-relaxed text-[color:var(--muted-foreground)]">
            {subtitle}
          </p>
        </Reveal>
      )}
    </header>
  );
}
