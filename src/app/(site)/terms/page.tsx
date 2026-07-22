import type { Metadata } from "next";
import { LegalPage } from "@/components/cine/legal-page";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms that apply when you use the Lala Masala website and order online.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <LegalPage
      index="00"
      label="Terms of Service"
      title="Terms of Service"
      updated="July 2026"
      intro="By using this website and ordering from Lala Masala, you agree to the following terms."
      sections={[
        { h: "Orders & pickup", body: ["Orders are prepared for pickup at the location you select. Estimated pickup times are approximate and may change during busy periods.", "Please check your order details before confirming — including location, items and pickup time."] },
        { h: "Pricing & availability", body: ["Prices are shown in Canadian dollars and may vary by location. Menu items may become unavailable without notice.", "The price charged is the price confirmed at checkout for your selected location."] },
        { h: "Payment", body: ["Online payments are processed securely by Stripe. Where offered, pay-at-pickup may be available at participating locations."] },
        { h: "Allergens", body: ["All food is prepared in a shared kitchen. We cannot guarantee any dish is free from a specific allergen. Order at your own discretion and tell us about allergies."] },
        { h: "Acceptable use", body: ["Please use the site lawfully and don't attempt to disrupt or misuse it. We may update these terms from time to time; the current version always applies."] },
      ]}
    />
  );
}
