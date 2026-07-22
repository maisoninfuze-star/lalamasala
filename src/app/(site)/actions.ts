"use server";

import { z } from "zod";
import { saveInquiry, type InquiryKind } from "@/lib/inquiries";

const schema = z.object({
  kind: z.enum(["catering", "event", "contact"]),
  name: z.string().trim().min(1, "Please enter your name").max(120),
  email: z.string().trim().email("Please enter a valid email").max(160),
  phone: z.string().trim().max(40).optional(),
  location: z.string().trim().max(40).optional(),
  eventDate: z.string().trim().max(20).optional(),
  guestCount: z.coerce.number().int().min(0).max(100000).optional(),
  message: z.string().trim().max(2000).optional(),
});

export async function submitInquiry(_prev: unknown, formData: FormData) {
  const parsed = schema.safeParse({
    kind: formData.get("kind"),
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone") || undefined,
    location: formData.get("location") || undefined,
    eventDate: formData.get("eventDate") || undefined,
    guestCount: formData.get("guestCount") || undefined,
    message: formData.get("message") || undefined,
  });

  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0]?.message ?? "Please check the form." };
  }

  try {
    await saveInquiry({
      ...parsed.data,
      kind: parsed.data.kind as InquiryKind,
      createdAt: new Date().toISOString(),
    });
    // Production: also insert to Supabase + send a Resend notification email.
    return { ok: true as const };
  } catch {
    return { ok: false as const, error: "Something went wrong. Please try again or call us." };
  }
}
