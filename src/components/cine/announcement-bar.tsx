"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

/*
  Site-wide announcement / promo strip. The text is owner-editable from the
  admin dashboard (Homepage Text → "Promo banner"). Fixed to the bottom so it
  never fights the transparent top nav or the hero. Dismissible — and because
  the dismissal is keyed to the message text, editing the promo re-shows it.
*/
export function AnnouncementBar({ text }: { text: string }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!text.trim()) return;
    try {
      if (localStorage.getItem("lala-promo") === text) return;
    } catch {
      /* ignore private-mode storage errors */
    }
    setShow(true);
  }, [text]);

  if (!text.trim() || !show) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 flex justify-center px-3 pb-3 sm:pb-4">
      <div className="pointer-events-auto flex max-w-[94vw] items-center gap-3 rounded-full bg-[color:var(--lm-marigold)] px-4 py-2.5 text-sm font-medium text-[color:var(--lm-wine)] shadow-[0_18px_40px_-16px_rgba(0,0,0,0.6)]">
        <span className="min-w-0">{text}</span>
        <button
          type="button"
          onClick={() => {
            try {
              localStorage.setItem("lala-promo", text);
            } catch {
              /* ignore */
            }
            setShow(false);
          }}
          aria-label="Dismiss announcement"
          className="grid size-7 shrink-0 place-items-center rounded-full transition-colors hover:bg-black/10"
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  );
}
