"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Locale } from "@/lib/types";

/**
 * Lightweight client store for the visitor's selected location and language.
 * Persisted to localStorage so the choice survives navigation and reloads
 * (the brief requires remembering the location selection).
 */
interface PrefState {
  locationSlug: string | null;
  locale: Locale;
  setLocation: (slug: string) => void;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
}

export const usePrefs = create<PrefState>()(
  persist(
    (set) => ({
      locationSlug: null,
      locale: "en",
      setLocation: (slug) => set({ locationSlug: slug }),
      setLocale: (locale) => set({ locale }),
      toggleLocale: () =>
        set((s) => ({ locale: s.locale === "en" ? "fr" : "en" })),
    }),
    { name: "lala-prefs" },
  ),
);
