import type { Metadata } from "next";
import { PageHeader } from "@/components/cine/page-header";
import { Reveal } from "@/components/cine/hud";
import { FaqAccordion, type Faq } from "@/components/cine/faq-accordion";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers to common questions about Lala Masala — ordering, vegetarian menu, allergens, catering and locations.",
  alternates: { canonical: "/faq" },
};

const FAQS: Faq[] = [
  { q: "Is everything really vegetarian?", a: "Yes — the entire Lala Masala menu is 100% vegetarian, with plenty of great vegan options. Look for the VEGAN and VEGAN OPT. badges on the menu." },
  { q: "How do I order for pickup?", a: "Choose your nearest location, browse its menu and order online, or call the restaurant directly. Your order is prepared fresh for pickup." },
  { q: "Can dishes be made vegan or gluten-friendly?", a: "Many can. Dishes we can adapt are marked with a badge, and our team is always happy to help — just ask when you order." },
  { q: "Are any dishes allergen-free?", a: "We prepare everything in a shared kitchen, so we can't guarantee any dish is free of a given allergen. Please tell us about allergies and we'll do our best to guide you." },
  { q: "Do you offer catering?", a: "Yes — we cater vegetarian menus at any scale, from office lunches to weddings and community events. Visit our Catering page to send a request." },
  { q: "Do you have an event space?", a: "Yes, the Lala Event Hall in Kingston is a cozy private venue for birthdays, engagements, small weddings and community gatherings, with in-house catering." },
  { q: "Where are you located?", a: "In Montreal (Dollard-des-Ormeaux), Kingston and Belleville. See the Locations page for addresses, hours and directions." },
];

function FaqSchema() {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export default function FaqPage() {
  return (
    <>
      <FaqSchema />
      <PageHeader
        index="00"
        label="FAQ"
        right="Good to know"
        title={
          <>
            Questions, <span className="lead">answered.</span>
          </>
        }
      />
      <section className="lm-container max-w-3xl pb-28">
        <Reveal>
          <FaqAccordion items={FAQS} />
        </Reveal>
      </section>
    </>
  );
}
