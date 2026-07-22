"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

/*
  Opening splash: the Lala Masala emblem fades in over the near-black wine
  backdrop, a marigold rule sweeps beneath it, then the whole overlay dissolves
  into the site. Plays once per browser session; skipped entirely for
  reduced-motion users.
*/
export function Intro() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    try {
      if (sessionStorage.getItem("lala-intro") === "1") return;
      sessionStorage.setItem("lala-intro", "1");
    } catch {
      /* private mode — just play it */
    }
    setShow(true);
    const t = setTimeout(() => setShow(false), 2300);
    return () => clearTimeout(t);
  }, []);

  if (!show) return null;

  return (
    <div className="lm-intro" aria-hidden>
      <div className="lm-intro-inner">
        <Image
          src="/img/brand/logo.webp"
          alt=""
          width={260}
          height={66}
          priority
          className="h-12 w-auto sm:h-16"
        />
        <span className="lm-intro-rule" />
        <span className="hud">Montreal · Kingston · Belleville</span>
      </div>
    </div>
  );
}
