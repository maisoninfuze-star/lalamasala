"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, UtensilsCrossed, MapPin, FileText, Inbox, Star } from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/admin/inbox", label: "Inbox", icon: Inbox },
  { href: "/admin/menu", label: "Menu & Prices", icon: UtensilsCrossed },
  { href: "/admin/reviews", label: "Reviews", icon: Star },
  { href: "/admin/locations", label: "Locations", icon: MapPin },
  { href: "/admin/content", label: "Site Text", icon: FileText },
];

export function AdminNav({ inboxCount = 0 }: { inboxCount?: number }) {
  const pathname = usePathname();
  return (
    <nav className="px-3 pb-4" aria-label="Admin">
      <ul className="space-y-1">
        {ITEMS.map((item) => {
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-[var(--radius-sm)] px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-[color:var(--lm-burgundy)] text-ivory"
                    : "text-[color:var(--lm-charcoal)] hover:bg-[color:var(--lm-cream)]",
                )}
              >
                <Icon className="size-5" aria-hidden />
                {item.label}
                {item.href === "/admin/inbox" && inboxCount > 0 && (
                  <span className="ml-auto grid min-w-[1.35rem] place-items-center rounded-full bg-[color:var(--lm-saffron)] px-1.5 text-[11px] font-semibold text-[color:var(--lm-wine)]">
                    {inboxCount}
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
