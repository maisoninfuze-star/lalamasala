import { readInquiries } from "@/lib/inquiries";
import { InboxList } from "./inbox-list";

export const dynamic = "force-dynamic";

export default async function AdminInboxPage() {
  const inquiries = await readInquiries();

  return (
    <div>
      <header className="mb-6">
        <h1 className="font-serif text-3xl">Inbox</h1>
        <p className="mt-1 text-sm text-[color:var(--muted-foreground)]">
          Catering, event and contact requests sent from your website — newest first.
        </p>
      </header>
      <InboxList inquiries={inquiries} />
    </div>
  );
}
