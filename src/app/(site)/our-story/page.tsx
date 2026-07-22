import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal, SectionMarker } from "@/components/cine/hud";
import { Storybook, type StoryPage } from "@/components/cine/storybook";
import { CHEF } from "@/data/brand";
import { getBrandCopy } from "@/lib/menu-data";

type BrandCopyValues = Awaited<ReturnType<typeof getBrandCopy>>;

export const metadata: Metadata = {
  title: "About Us",
  description:
    "The Chawla family story — inspired by patriarch Kundan Laal Chawla and carried forward by Chef Raghbir Singh Chawla. Nearly fifty years of vegetarian North Indian cooking, told as an interactive storybook.",
  alternates: { canonical: "/our-story" },
};

const VALUES = [
  { t: "Pure Vegetarian", d: "Every dish is one hundred per cent vegetarian — no compromise, ever." },
  { t: "Made from Scratch", d: "Freshly ground masalas, daals simmered overnight, breads from the tandoor." },
  { t: "Family Recipes", d: "Handed down from Kundan Laal Chawla and cooked the way family food should be." },
];

/* The story, told as turnable pages. All real text + your own photos, so every
   page stays selectable, translatable and crawlable. Copy comes from the admin
   (Site Text) with the brand seed as fallback. */
const buildPages = (copy: BrandCopyValues): StoryPage[] => [
  // 0 — front cover
  {
    tone: "cover",
    content: (
      <div className="relative flex h-full flex-col items-center justify-center gap-4 text-center">
        <span className="sb-cover-frame" aria-hidden />
        <Image src="/img/brand/logo.webp" alt="Lala Masala emblem" width={140} height={140} className="h-16 w-auto object-contain" />
        <span className="sb-eyebrow" style={{ color: "#efa82e" }}>Est. 1970s</span>
        <h2 className="sb-h text-[clamp(1.5rem,2.6vw,2.3rem)]" style={{ color: "#f0e7d3" }}>
          The Chawla
          <br />
          Family Story
        </h2>
        <span className="block h-px w-14" style={{ background: "rgba(239,168,46,0.6)" }} />
        <p className="text-[0.72rem] tracking-wide" style={{ color: "rgba(240,231,211,0.72)" }}>Pure-Vegetarian Indian Kitchen</p>
        <span className="sb-eyebrow mt-3" style={{ color: "rgba(240,231,211,0.5)" }}>Press › to open</span>
      </div>
    ),
  },
  // 1 — dedication
  {
    tone: "paper",
    folio: "i",
    content: (
      <div className="flex h-full flex-col justify-center gap-5 px-2 text-center">
        <span className="sb-eyebrow">Dedication</span>
        <p className="sb-quote text-[clamp(1.1rem,1.7vw,1.5rem)]">
          “For our beloved patriarch, Kundan&nbsp;Laal&nbsp;Chawla — whose kitchen was always open, and whose table always had room for one more.”
        </p>
        <span className="sb-rule mx-auto h-px w-12" />
      </div>
    ),
  },
  // 2 — motto & vision + heritage collage
  {
    tone: "paper",
    folio: "01",
    content: (
      <>
        <span className="sb-eyebrow">Chapter One</span>
        <h2 className="sb-h mt-2 text-[clamp(1.4rem,2.2vw,2rem)]">Motto &amp; Vision</h2>
        <div className="sb-figure mt-4 aspect-[3/2]">
          <Image
            src="/img/about/motto-vision.png"
            alt="Kundan Laal Chawla and the family sweet shop in India"
            fill
            sizes="(max-width:768px) 90vw, 420px"
            className="object-cover"
          />
        </div>
        <p className="sb-text mt-4">{copy.mottoLead}</p>
      </>
    ),
  },
  // 3 — the motto text
  {
    tone: "paper",
    folio: "02",
    content: (
      <>
        <span className="sb-eyebrow">We cook &amp; serve with love</span>
        <div className="mt-3 border-l-2 pl-4" style={{ borderColor: "rgba(189,125,27,0.6)" }}>
          <p className="sb-quote text-[clamp(1rem,1.5vw,1.25rem)]">“{copy.mottoHeadline}”</p>
        </div>
        <div className="mt-4 space-y-3">
          {copy.mottoBody.map((p) => (
            <p key={p.slice(0, 24)} className="sb-text">{p}</p>
          ))}
        </div>
        <p className="mt-4 flex items-center gap-2 text-[0.72rem]" style={{ color: "#8a7358" }}>
          <span className="h-px w-6" style={{ background: "#b23124" }} /> In memory of Kundan Laal Chawla
        </p>
      </>
    ),
  },
  // 4 — flavour / cholle bhature
  {
    tone: "paper",
    folio: "03",
    content: (
      <>
        <span className="sb-eyebrow">From the streets of India</span>
        <h2 className="sb-h mt-2 text-[clamp(1.3rem,2vw,1.75rem)]">
          Cholle bhature
          <br />&amp; warm naan
        </h2>
        <div className="sb-figure mt-4 aspect-[4/3]">
          <Image
            src="/img/dishes/cholle-bhature.png"
            alt="Cholle bhature — spiced chickpeas with fried bhatura"
            fill
            sizes="(max-width:768px) 90vw, 420px"
            className="object-cover"
          />
        </div>
        <p className="sb-text mt-4">
          From rich curries to comforting street food, every dish is crafted to transport you to the vibrant streets of India.
        </p>
      </>
    ),
  },
  // 5 — chef portrait
  {
    tone: "paper",
    folio: "04",
    content: (
      <>
        <span className="sb-eyebrow">Chapter Two</span>
        <h2 className="sb-h mt-2 text-[clamp(1.3rem,2vw,1.75rem)]">The Head Chef</h2>
        <div className="sb-figure mt-4 min-h-0 grow">
          <Image
            src="/img/about/chef-raghbir.jpg"
            alt="Chef Raghbir Singh Chawla in the Lala Masala kitchen"
            fill
            sizes="(max-width:768px) 90vw, 420px"
            className="object-cover"
          />
        </div>
      </>
    ),
  },
  // 6 — chef bio
  {
    tone: "paper",
    folio: "05",
    content: (
      <>
        <span className="sb-eyebrow">{CHEF.role.en}</span>
        <h2 className="sb-h mt-2 text-[clamp(1.2rem,1.9vw,1.65rem)]">{CHEF.name}</h2>
        {/* line-clamp is a safety net: owner-edited text can never overflow the leaf */}
        <p className="sb-text mt-3 line-clamp-[9]">{copy.chefIntro}</p>
        <div className="mt-4 flex items-end gap-3">
          <span className="sb-h" style={{ fontSize: "2.4rem", lineHeight: 1, color: "#bd7d1b" }}>50</span>
          <span className="sb-text" style={{ paddingBottom: "0.3rem" }}>years of authentic flavour &amp; heritage.</span>
        </div>
      </>
    ),
  },
  // 7 — what we stand for
  {
    tone: "paper",
    folio: "06",
    content: (
      <>
        <span className="sb-eyebrow">What we stand for</span>
        <h2 className="sb-h mt-2 text-[clamp(1.3rem,2vw,1.75rem)]">Three promises</h2>
        <ul className="mt-4 space-y-4">
          {VALUES.map((v, i) => (
            <li key={v.t} className="border-t pt-3" style={{ borderColor: "rgba(120,80,40,0.2)" }}>
              <div className="flex items-baseline gap-2">
                <span className="sb-eyebrow">0{i + 1}</span>
                <span className="sb-h text-[1.05rem]">{v.t}</span>
              </div>
              <p className="sb-text mt-1">{v.d}</p>
            </li>
          ))}
        </ul>
      </>
    ),
  },
  // 8 — closing + CTA
  {
    tone: "paper",
    folio: "07",
    content: (
      <>
        <span className="sb-eyebrow">Come taste the story</span>
        <h2 className="sb-h mt-2 text-[clamp(1.4rem,2.1vw,1.9rem)]">
          Cooked with love, served from the heart.
        </h2>
        <p className="sb-text mt-3">
          Three kitchens across Montreal, Kingston &amp; Belleville — every plate made from scratch, the way family food should be.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/menu" className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium" style={{ background: "#6e2a5e", color: "#f6ecd8" }}>
            Explore the Menu <ArrowUpRight className="size-4" />
          </Link>
          <Link href="/locations" className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm" style={{ borderColor: "rgba(120,80,40,0.35)", color: "#4a3625" }}>
            Find your kitchen
          </Link>
        </div>
      </>
    ),
  },
  // 9 — back cover
  {
    tone: "cover",
    content: (
      <div className="relative flex h-full flex-col items-center justify-center gap-4 text-center">
        <span className="sb-cover-frame" aria-hidden />
        <Image src="/img/brand/logo.webp" alt="Lala Masala emblem" width={110} height={110} className="h-12 w-auto object-contain" />
        <span className="sb-eyebrow" style={{ color: "rgba(240,231,211,0.6)" }}>@lalamasala43</span>
        <p className="text-[0.72rem]" style={{ color: "rgba(240,231,211,0.6)" }}>Montreal · Kingston · Belleville</p>
      </div>
    ),
  },
];

export default async function AboutPage() {
  const copy = await getBrandCopy();
  const pages = buildPages(copy);
  return (
    <>
      {/* Intro */}
      <header className="lm-container pb-10 pt-36 sm:pt-44">
        <SectionMarker index="00" label="About Us" right="A Family Kitchen" />
        <Reveal className="mt-12">
          <span className="hud accent-marigold">Est. — Chawla Family Recipes</span>
          <h1 className="display-serif mt-5 max-w-5xl text-[clamp(2.4rem,6.5vw,5.25rem)]">
            Cooked with love, <span className="lead">served from the heart.</span>
          </h1>
        </Reveal>
        <Reveal className="mt-7">
          <p className="max-w-xl text-[15px] leading-relaxed text-[color:var(--muted-foreground)]">
            Nearly fifty years of vegetarian North Indian cooking, told the way it began —
            as a family book. Turn the pages to read our story.
          </p>
        </Reveal>
      </header>

      {/* The interactive storybook */}
      <section className="lm-container relative pb-16">
        <SectionMarker index="01" label="Our Story" right="Flip to read →" />
        <div className="relative mt-14">
          <div className="cine-glow left-1/2 top-1/4 h-72 w-72 -translate-x-1/2" aria-hidden />
          <Storybook pages={pages} />
        </div>
      </section>

      {/* Compact CTA for readers who don't flip to the end */}
      <section className="lm-container pb-28">
        <Reveal className="flex flex-wrap items-center gap-4 border-t border-[color:var(--border)] pt-10">
          <Link href="/menu" className="pill">
            Explore the Menu <ArrowUpRight className="size-4" />
          </Link>
          <Link
            href="/chef-raghbir"
            className="inline-flex items-center gap-2 rounded-[var(--radius-pill)] border border-[color:var(--border)] px-5 py-[0.7rem] text-sm font-medium text-[color:var(--foreground)] transition-colors hover:bg-white/5"
          >
            Meet Chef Raghbir
          </Link>
          <span className="hud ml-1">Montreal · Kingston · Belleville</span>
        </Reveal>
      </section>
    </>
  );
}
