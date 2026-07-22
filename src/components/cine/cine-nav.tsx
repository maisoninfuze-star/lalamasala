"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, ShoppingBag, X, MapPin, Check, Menu as MenuIcon } from "lucide-react";
import { NAV } from "@/data/brand";
import { LOCATIONS, isOpenNow } from "@/data/locations";
import { usePrefs } from "@/lib/store";
import { useCart } from "@/lib/cart";
import { cn } from "@/lib/utils";

/*
  Persistent top navigation bar: always fixed to the top and clickable. Inline
  links show from tablet up; the bar is transparent over the hero and gains a
  solid blurred backdrop once you scroll, so it's readable over any section. A
  mobile menu button opens the full-screen overlay (all links + location + lang).
*/
const SECONDARY = new Set<string>(["/catering", "/event-hall"]);

export function CineNav() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { locale, toggleLocale, locationSlug, setLocation } = usePrefs();
  const cartCount = useCart((s) => s.items.reduce((n, i) => n + i.qty, 0));
  const pathname = usePathname();

  useEffect(() => setMounted(true), []);
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* Persistent top bar */}
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300",
          scrolled
            ? "border-[color:var(--border)] bg-[color:var(--background)]/85 backdrop-blur-md"
            : "border-transparent",
        )}
      >
        <div className="lm-container flex items-center justify-between gap-4 py-4">
          <Link href="/" aria-label="Lala Masala home" className="relative z-50 shrink-0">
            <Image
              src="/img/brand/logo.webp"
              alt="Lala Masala"
              width={132}
              height={34}
              className="h-8 w-auto object-contain"
              priority
            />
          </Link>

          {/* Inline nav (tablet up; Catering/Event Hall appear on large screens) */}
          <nav className="hidden items-center gap-5 md:flex lg:gap-7" aria-label="Primary">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium tracking-tight text-[color:var(--foreground)]/85 transition-colors hover:text-[color:var(--accent)]",
                  SECONDARY.has(item.href) && "hidden lg:inline-flex",
                )}
              >
                {item.label[locale]}
              </Link>
            ))}
          </nav>

          {/* Right cluster */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={toggleLocale}
              className="hud hidden transition-colors hover:text-[color:var(--foreground)] sm:inline"
              aria-label="Switch language"
            >
              {locale === "en" ? "EN / FR" : "FR / EN"}
            </button>

            <Link
              href="/cart"
              aria-label={`Cart${mounted && cartCount ? ` (${cartCount})` : ""}`}
              className="relative grid size-9 place-items-center rounded-full border border-[color:var(--border)] transition-colors hover:bg-white/5"
            >
              <ShoppingBag className="size-4" aria-hidden />
              {mounted && cartCount > 0 && (
                <span className="tnum absolute -right-1.5 -top-1.5 grid min-w-[1.15rem] place-items-center rounded-full bg-[color:var(--accent)] px-1 text-[11px] font-semibold text-[color:var(--lm-wine)]">
                  {cartCount}
                </span>
              )}
            </Link>

            <Link href="/menu" className="pill hidden sm:inline-flex">
              <span className="size-1.5 rounded-full bg-[color:var(--lm-wine)]" aria-hidden />
              Order Pickup
            </Link>

            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className="grid size-9 place-items-center rounded-full border border-[color:var(--border)] md:hidden"
            >
              {open ? <X className="size-5" /> : <MenuIcon className="size-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Full-screen nav overlay (mobile) */}
      {open && (
        <div className="fixed inset-0 z-40 overflow-y-auto bg-[color:var(--background)]/97 backdrop-blur-sm">
          <div className="lm-container flex min-h-full flex-col justify-center py-20">
            <p className="hud mb-8">(00) — Navigation</p>
            <nav className="flex flex-col" aria-label="Mobile">
              {NAV.map((item, i) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex items-baseline gap-4 border-b border-[color:var(--border)] py-4 text-[color:var(--foreground)]"
                >
                  <span className="hud w-8">0{i + 1}</span>
                  <span className="text-4xl font-medium tracking-tight transition-colors group-hover:text-[color:var(--accent)] sm:text-5xl">
                    {item.label[locale]}
                  </span>
                  <ArrowUpRight className="ml-auto size-6 self-center opacity-0 transition-opacity group-hover:opacity-100" />
                </Link>
              ))}
            </nav>

            <div className="mt-10">
              <p className="hud mb-3">Choose your kitchen</p>
              <div className="flex flex-wrap gap-2">
                {LOCATIONS.map((loc) => (
                  <button
                    key={loc.slug}
                    type="button"
                    onClick={() => setLocation(loc.slug)}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors",
                      loc.slug === locationSlug
                        ? "border-[color:var(--accent)] text-[color:var(--foreground)]"
                        : "border-[color:var(--border)] text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)]",
                    )}
                  >
                    {loc.slug === locationSlug ? (
                      <Check className="size-3.5 text-[color:var(--accent)]" />
                    ) : (
                      <MapPin className="size-3.5" />
                    )}
                    {loc.name}
                    <span className="hud !text-[10px]">{isOpenNow(loc) ? "Open" : "Closed"}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={toggleLocale}
              className="hud mt-8 self-start rounded-full border border-[color:var(--border)] px-4 py-2 sm:hidden"
            >
              {locale === "en" ? "Switch to Français" : "Switch to English"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
