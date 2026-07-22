import Link from "next/link";
import { redirect } from "next/navigation";
import { Toaster } from "sonner";
import { isAuthenticated } from "@/lib/admin-auth";
import { readInquiries } from "@/lib/inquiries";
import { logoutAction } from "../actions";
import { AdminNav } from "./admin-nav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await isAuthenticated())) {
    redirect("/admin/login");
  }

  const inboxCount = (await readInquiries()).length;

  return (
    <div className="min-h-screen bg-[color:var(--lm-cream)] text-[color:var(--lm-charcoal)]">
      <div className="mx-auto flex max-w-[1400px] flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="md:sticky md:top-0 md:h-screen md:w-64 shrink-0 border-b md:border-b-0 md:border-r border-[color:var(--lm-line)] bg-[color:var(--lm-ivory)]">
          <div className="flex items-center gap-2 p-5">
            <span className="grid size-8 place-items-center rounded-full bg-[color:var(--lm-burgundy)] font-serif text-ivory">
              L
            </span>
            <div className="leading-tight">
              <div className="font-serif text-lg">Lala Masala</div>
              <div className="text-[11px] uppercase tracking-widest text-[color:var(--muted-foreground)]">
                Owner Dashboard
              </div>
            </div>
          </div>
          <AdminNav inboxCount={inboxCount} />
          <div className="p-4">
            <form action={logoutAction}>
              <button
                type="submit"
                className="w-full rounded-[var(--radius-sm)] border border-[color:var(--lm-line)] px-3 py-2 text-sm font-medium hover:bg-[color:var(--lm-cream)]"
              >
                Sign out
              </button>
            </form>
            <Link
              href="/"
              target="_blank"
              className="mt-2 block text-center text-xs text-[color:var(--muted-foreground)] hover:underline"
            >
              View live site ↗
            </Link>
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 p-5 sm:p-8">{children}</main>
      </div>
      <Toaster position="bottom-right" richColors />
    </div>
  );
}
