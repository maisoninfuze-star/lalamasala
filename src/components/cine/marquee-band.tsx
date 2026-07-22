import { Marquee } from "./marquee";

const ITEMS = [
  "Pure Vegetarian",
  "Street Food",
  "Curries",
  "Kathi Rolls",
  "Soya Chaap",
  "Build Your Thali",
  "Montreal",
  "Kingston",
  "Belleville",
];

/** A scrolling brand ticker used as a transition band on the homepage. */
export function MarqueeBand() {
  return (
    <section className="border-y border-[color:var(--border)] py-9">
      <Marquee items={ITEMS} durationSec={38} />
    </section>
  );
}
