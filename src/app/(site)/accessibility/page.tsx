import type { Metadata } from "next";
import { LegalPage } from "@/components/cine/legal-page";

export const metadata: Metadata = {
  title: "Accessibility",
  description: "Lala Masala's commitment to an accessible website and experience for everyone.",
  alternates: { canonical: "/accessibility" },
};

export default function AccessibilityPage() {
  return (
    <LegalPage
      index="00"
      label="Accessibility"
      title="Accessibility"
      updated="July 2026"
      intro="We want everyone to be able to explore our menu and place an order with ease."
      sections={[
        { h: "Our commitment", body: ["We aim to meet WCAG 2.2 AA standards across this website — including keyboard navigation, visible focus states, sufficient colour contrast, descriptive alt text and screen-reader-friendly structure."] },
        { h: "Reduced motion", body: ["This site includes cinematic motion. If your device requests reduced motion, animations are minimised automatically and a static experience is shown instead."] },
        { h: "In our restaurants", body: ["If you need assistance ordering, have accessibility needs for pickup, or would like help planning an event, please let your location know — our team is happy to help."] },
        { h: "Tell us how we can improve", body: ["Accessibility is ongoing. If you encounter a barrier on this site or in our restaurants, please reach out through the Contact page so we can fix it."] },
      ]}
    />
  );
}
