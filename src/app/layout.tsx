import type { Metadata } from "next";
import { Geist, Geist_Mono, Cormorant_Garamond, Fraunces } from "next/font/google";
import "./globals.css";

// Grotesk display + UI (matches the cinematic reference aesthetic).
const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
});

// Monospace for the HUD: section tags, timecodes, technical labels.
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

// Serif kept for a few editorial accents only.
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

// Warm, characterful old-style display serif — used for editorial headings
// (About story, section titles) to give the brand pages a heritage warmth.
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://lalamasala.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Lala Masala — Vegetarian Indian Kitchen | Montreal · Kingston · Belleville",
    template: "%s · Lala Masala",
  },
  description:
    "Vegetarian Indian street food, curries and family recipes shaped by nearly five decades of tradition. Order for pickup in Montreal, Kingston and Belleville.",
  keywords: [
    "vegetarian Indian restaurant",
    "Indian street food",
    "Montreal",
    "Kingston",
    "Belleville",
    "Indian catering",
    "thali",
    "kathi rolls",
    "soya chaap",
  ],
  openGraph: {
    type: "website",
    siteName: "Lala Masala",
    title: "Lala Masala — Indian food, served from the heart",
    description:
      "Vegetarian Indian street food, curries and family recipes across Montreal, Kingston and Belleville.",
    url: SITE_URL,
  },
  twitter: { card: "summary_large_image" },
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${geistMono.variable} ${cormorant.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
