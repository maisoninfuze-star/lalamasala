import { SectionMarker, Reveal } from "./hud";
import { CountUp } from "./parallax";

const STATS = [
  { value: 3, suffix: "", label: "Locations" },
  { value: 50, suffix: "", label: "Years of recipes" },
  { value: 100, suffix: "%", label: "Vegetarian" },
  { value: 20, suffix: " min", label: "Avg pickup" },
];

export function ManifestoStats() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="lm-container">
        <SectionMarker index="01" label="The Kitchen" right="Clients — Since 2020" />

        <Reveal className="mt-16 max-w-5xl">
          <h2 className="display text-[clamp(2rem,5.2vw,4.5rem)]">
            <span className="lead">A family legacy</span> of vegetarian recipes,{" "}
            <span className="lead">vibrant street food</span> and unforgettable{" "}
            <span className="lead">masala.</span>
          </h2>
        </Reveal>

        <div className="mt-20 hud-ticks" aria-hidden />

        <dl className="mt-10 grid grid-cols-2 gap-x-8 gap-y-12 md:grid-cols-4">
          {STATS.map((s, i) => (
            <Reveal key={s.label}>
              <span className="hud">0{i + 1}</span>
              <dd className="mt-3 text-[clamp(2.75rem,5vw,4.5rem)] font-medium leading-none tracking-tight">
                <CountUp value={s.value} suffix={s.suffix} />
              </dd>
              <dt className="mt-3 hud !normal-case !tracking-normal text-[color:var(--muted-foreground)]">
                {s.label}
              </dt>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
