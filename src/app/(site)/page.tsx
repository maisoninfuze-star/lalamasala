import type { Metadata } from "next";
import { CineHero } from "@/components/cine/cine-hero";
import { SignatureWork } from "@/components/cine/signature-work";
import { MarqueeBand } from "@/components/cine/marquee-band";
import { PhoneReel } from "@/components/cine/phone-reel";
import { OrderSection } from "@/components/cine/order-section";
import { ReviewsSection } from "@/components/cine/reviews-section";
import { getReviews } from "@/lib/menu-data";
import { LOCATIONS } from "@/data/locations";

export const metadata: Metadata = {
  title: "Vegetarian Indian Kitchen — Montreal, Kingston & Belleville",
  description:
    "Lala Masala serves vegetarian Indian street food, curries and family thalis across Montreal, Kingston and Belleville. Order for pickup online.",
  alternates: { canonical: "/" },
};

function StructuredData() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: "Lala Masala",
    servesCuisine: ["Indian", "Vegetarian", "Street Food"],
    priceRange: "$$",
    hasMenu: "/menu",
    department: LOCATIONS.map((l) => ({
      "@type": "Restaurant",
      name: `Lala Masala ${l.name}`,
      telephone: l.phone,
      address: {
        "@type": "PostalAddress",
        streetAddress: [l.addressLine1, l.addressLine2].filter(Boolean).join(", "),
        addressLocality: l.city,
        addressRegion: l.province,
        postalCode: l.postalCode,
        addressCountry: "CA",
      },
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default async function HomePage() {
  const reviews = await getReviews();
  return (
    <>
      <StructuredData />
      <CineHero />
      <SignatureWork />
      <MarqueeBand />
      <PhoneReel />
      <ReviewsSection reviews={reviews} />
      <OrderSection />
    </>
  );
}
