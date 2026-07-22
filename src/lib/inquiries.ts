import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";

/*
  Local persistence for catering / event / contact inquiries. Mirrors the
  content-store pattern: works in dev / self-hosted; in production point this at
  the catering_inquiries / event_inquiries tables + Resend for notifications.
*/

export type InquiryKind = "catering" | "event" | "contact";

export interface Inquiry {
  kind: InquiryKind;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  eventDate?: string;
  guestCount?: number;
  message?: string;
  createdAt: string;
}

const FILE = path.join(process.cwd(), "inquiries.json");

export async function saveInquiry(entry: Inquiry): Promise<void> {
  let list: Inquiry[] = [];
  try {
    list = JSON.parse(await fs.readFile(FILE, "utf8"));
  } catch {
    /* first write */
  }
  list.push(entry);
  await fs.writeFile(FILE, JSON.stringify(list, null, 2), "utf8");
}

/** All inquiries, newest first (for the admin Inbox). */
export async function readInquiries(): Promise<Inquiry[]> {
  try {
    const list = JSON.parse(await fs.readFile(FILE, "utf8")) as Inquiry[];
    return [...list].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  } catch {
    return [];
  }
}

/** Remove one inquiry by its createdAt timestamp (used as its id). */
export async function deleteInquiry(createdAt: string): Promise<void> {
  let list: Inquiry[] = [];
  try {
    list = JSON.parse(await fs.readFile(FILE, "utf8"));
  } catch {
    return;
  }
  const idx = list.findIndex((i) => i.createdAt === createdAt);
  if (idx >= 0) {
    list.splice(idx, 1);
    await fs.writeFile(FILE, JSON.stringify(list, null, 2), "utf8");
  }
}
