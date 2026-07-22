import type { Metadata } from "next";
import { LegalPage } from "@/components/cine/legal-page";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Lala Masala collects, uses and protects your personal information.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <LegalPage
      index="00"
      label="Privacy Policy"
      title="Privacy Policy"
      updated="July 2026"
      intro="We keep this simple: we only collect what we need to take your order and improve your experience."
      sections={[
        { h: "What we collect", body: ["When you place an order or send an inquiry, we collect your name, contact details, order information and any notes you provide.", "We do not store credit-card numbers. All payments are processed securely by our payment provider (Stripe)."] },
        { h: "How we use it", body: ["To prepare and fulfil your pickup orders, respond to catering and event inquiries, and — only with your consent — to send occasional updates.", "We never sell your personal information."] },
        { h: "Cookies & analytics", body: ["We use essential cookies to remember your location and language, and privacy-conscious analytics to understand how the site is used."] },
        { h: "Your choices", body: ["You may request access to, correction of, or deletion of your personal information at any time by contacting us.", "You can opt out of marketing messages whenever you like."] },
        { h: "Contact", body: ["Questions about your privacy? Reach us through the Contact page and we'll be glad to help."] },
      ]}
    />
  );
}
