import Image from "next/image";
import Link from "next/link";
import { InstagramIcon, FacebookIcon } from "@/components/ui/social-icons";
import { Reveal } from "./hud";
import { Parallax } from "./parallax";
import { BRAND, NAV } from "@/data/brand";
import { LOCATIONS } from "@/data/locations";

const LEGAL = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/refund-policy", label: "Refund Policy" },
  { href: "/accessibility", label: "Accessibility" },
];

export function CineFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative overflow-hidden border-t border-[color:var(--border)] pt-16">
      {/* Big reveal wordmark — the closing motion moment of the page. */}
      <div className="lm-container overflow-hidden pb-12">
        <Reveal>
          <Parallax
            axis="x"
            speed={0.03}
            as="p"
            className="whitespace-nowrap font-medium leading-none tracking-tighter text-[clamp(3rem,13vw,11rem)]"
          >
            Lala Masala<span className="text-[color:var(--accent)]">.</span>
          </Parallax>
        </Reveal>
      </div>

      <div className="lm-container grid gap-12 pb-16 md:grid-cols-3">
        {/* Studio statement */}
        <Reveal as="div">
          <p className="hud">(00) — Studio</p>
          <p className="mt-5 max-w-xs text-lg leading-snug text-[color:var(--muted-foreground)]">
            <span className="text-[color:var(--foreground)]">A family kitchen</span> serving
            vegetarian street food, curries and thalis across{" "}
            <span className="text-[color:var(--foreground)]">
              Montreal, Kingston &amp; Belleville.
            </span>
          </p>
          <Image
            src="/img/brand/logo.webp"
            alt="Lala Masala"
            width={140}
            height={36}
            className="mt-8 h-8 w-auto object-contain opacity-90"
          />
        </Reveal>

        {/* Navigation */}
        <Reveal as="div">
          <p className="hud">(01) — Navigation</p>
          <nav aria-label="Footer">
            <ul className="mt-5 space-y-2.5">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-[color:var(--muted-foreground)] underline-offset-4 transition-colors hover:text-[color:var(--foreground)] hover:underline"
                  >
                    {item.label.en}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </Reveal>

        {/* Visit us */}
        <Reveal as="div">
          <p className="hud">(02) — Visit Us</p>
          <ul className="mt-5 space-y-4">
            {LOCATIONS.map((loc) => (
              <li key={loc.slug}>
                <p className="font-medium">
                  {loc.name} — {loc.province}
                </p>
                <p className="text-sm text-[color:var(--muted-foreground)]">
                  {loc.addressLine1}, {loc.city} · {loc.phone}
                </p>
              </li>
            ))}
          </ul>
          <div className="mt-5 flex gap-2">
            <a
              href={BRAND.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="grid size-9 place-items-center rounded-full border border-[color:var(--border)] transition-colors hover:bg-white/5"
            >
              <InstagramIcon className="size-4" />
            </a>
            <a
              href={BRAND.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="grid size-9 place-items-center rounded-full border border-[color:var(--border)] transition-colors hover:bg-white/5"
            >
              <FacebookIcon className="size-4" />
            </a>
          </div>
        </Reveal>
      </div>

      <div className="hud-ticks lm-container" aria-hidden />

      <div className="lm-container flex flex-col items-start justify-between gap-4 py-6 sm:flex-row sm:items-center">
        <p className="hud">
          © {year} {BRAND.name} — Vegetarian Indian Kitchen
        </p>
        <ul className="flex flex-wrap gap-5">
          {LEGAL.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="hud hover:text-[color:var(--foreground)]">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
