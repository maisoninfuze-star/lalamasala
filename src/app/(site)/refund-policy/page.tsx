import type { Metadata } from "next";
import { LegalPage } from "@/components/cine/legal-page";

export const metadata: Metadata = {
  title: "Refund Policy",
  description: "How refunds, cancellations and order issues are handled at Lala Masala.",
  alternates: { canonical: "/refund-policy" },
};

export default function RefundPolicyPage() {
  return (
    <LegalPage
      index="00"
      label="Refund Policy"
      title="Refund Policy"
      updated="July 2026"
      intro="We want every order to be right. If something isn't, please tell us — we'll make it fair."
      sections={[
        { h: "Something wrong with your order?", body: ["If your order is incorrect, incomplete or not up to standard, contact the location as soon as possible on the same day. We'll offer a remake or a refund of the affected items."] },
        { h: "Cancellations", body: ["Because food is prepared fresh to order, we can only cancel or change an order before preparation begins. Contact your location right away if you need to make a change."] },
        { h: "How refunds are issued", body: ["Approved refunds are returned to your original payment method. Card refunds typically appear within a few business days, depending on your bank.", "We do not store your card details — refunds are processed through our secure payment provider."] },
        { h: "Catering & events", body: ["Catering and event-hall bookings may have their own deposit and cancellation terms, which we'll confirm with you when you book."] },
      ]}
    />
  );
}
