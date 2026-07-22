import type { Metadata } from "next";
import { Phone, Navigation } from "lucide-react";
import { PageHeader } from "@/components/cine/page-header";
import { Reveal, SectionMarker } from "@/components/cine/hud";
import { InquiryForm } from "@/components/cine/inquiry-form";
import { InstagramIcon } from "@/components/ui/social-icons";
import { LOCATIONS } from "@/data/locations";
import { BRAND } from "@/data/brand";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Lala Masala in Montreal, Kingston or Belleville — addresses, phone numbers, hours and a contact form.",
  alternates: { canonical: "/contact" },
};

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function ContactPage() {
  return (
    <>
      <PageHeader
        index="00"
        label="Contact"
        right="We'd love to hear from you"
        eyebrow="Get in touch"
        title={
          <>
            Say <span className="lead">hello.</span>
          </>
        }
        subtitle="Questions, feedback or a large order? Reach your nearest kitchen, or send us a note below."
      />

      <section className="lm-container pb-16">
        <SectionMarker index="01" label="Our Kitchens" right="Montreal · Kingston · Belleville" />
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {LOCATIONS.map((loc, i) => (
            <Reveal key={loc.slug}>
              <div className="flex h-full flex-col rounded-[var(--radius-lg)] border border-[color:var(--border)] bg-[color:var(--surface-2)]/40 p-6 transition-colors hover:border-[color:var(--lm-marigold)]/40">
                <span className="hud accent-marigold">
                  0{i + 1} — {loc.province}
                </span>
                <h2 className="display-serif mt-3 text-2xl">{loc.name}</h2>
                <p className="mt-2 text-sm text-[color:var(--muted-foreground)]">
                  {loc.addressLine1}
                  {loc.addressLine2 ? `, ${loc.addressLine2}` : ""}
                  <br />
                  {loc.city}, {loc.province} {loc.postalCode}
                </p>
                <a href={`tel:${loc.phone}`} className="mt-3 inline-flex items-center gap-2 text-sm hover:text-[color:var(--accent)]">
                  <Phone className="size-4 text-[color:var(--lm-marigold)]" /> {loc.phone}
                </a>

                <dl className="mt-4 space-y-1 border-t border-[color:var(--border)] pt-4 text-xs text-[color:var(--muted-foreground)]">
                  {loc.hours.map((h) => (
                    <div key={h.day} className="flex justify-between">
                      <dt>{DAYS[h.day]}</dt>
                      <dd className="tnum">{h.closed || !h.open ? "Closed" : `${h.open}–${h.close}`}</dd>
                    </div>
                  ))}
                </dl>

                {loc.mapsUrl && (
                  <a
                    href={loc.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex items-center gap-2 text-sm font-medium hover:text-[color:var(--accent)]"
                  >
                    <Navigation className="size-4 text-[color:var(--lm-marigold)]" /> Directions
                  </a>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="lm-container grid gap-x-16 gap-y-12 pb-28 lg:grid-cols-[0.85fr_1.15fr]">
        <Reveal>
          <SectionMarker index="02" label="Follow Along" />
          <h2 className="display-serif mt-8 text-[clamp(1.75rem,3vw,2.5rem)]">
            Come say hello <span className="lead">in the kitchen.</span>
          </h2>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-[color:var(--muted-foreground)]">
            Catch fresh dishes, events and behind-the-scenes from the Chawla family kitchen on Instagram.
          </p>
          <a
            href={BRAND.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-[var(--radius-pill)] border border-[color:var(--border)] px-5 py-[0.7rem] text-sm font-medium transition-colors hover:border-[color:var(--lm-marigold)]/50 hover:text-[color:var(--accent)]"
          >
            <InstagramIcon className="size-4 text-[color:var(--lm-marigold)]" /> {BRAND.social.instagramHandle}
          </a>
        </Reveal>

        <div>
          <SectionMarker index="03" label="Send a Message" right="We'll reply soon" />
          <Reveal className="mt-8">
            <InquiryForm kind="contact" />
          </Reveal>
        </div>
      </section>
    </>
  );
}
