"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useAppStore } from "@/store/useAppStore";

const LenisContext = createContext<Lenis | null>(null);
export const useLenis = () => useContext(LenisContext);

export default function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const rafId = useRef<number | null>(null);
  const setScrollProgress = useAppStore((s) => s.setScrollProgress);
  const pathname = usePathname();

  useEffect(() => {
    const instance = new Lenis({
      duration: 1.15,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
      touchMultiplier: 1.4,
      wheelMultiplier: 1,
    });

    setLenis(instance);

    instance.on("scroll", (e: { progress: number }) => {
      setScrollProgress(e.progress);
      ScrollTrigger.update();
    });

    function raf(time: number) {
      instance.raf(time);
      rafId.current = requestAnimationFrame(raf);
    }
    rafId.current = requestAnimationFrame(raf);

    ScrollTrigger.scrollerProxy(document.body, {
      scrollTop(value) {
        if (typeof value === "number") {
          instance.scrollTo(value, { immediate: true });
        }
        return instance.scroll;
      },
      getBoundingClientRect() {
        return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
      },
    });

    const onRefresh = () => instance.resize();
    ScrollTrigger.addEventListener("refresh", onRefresh);
    ScrollTrigger.refresh();

    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
      ScrollTrigger.removeEventListener("refresh", onRefresh);
      instance.destroy();
    };
  }, [setScrollProgress]);

  useEffect(() => {
    gsap.ticker.lagSmoothing(0);
  }, []);

  // Lenis keeps its own virtual scroll offset independent of the browser's
  // native scroll position, so Next.js's default "scroll to top on
  // navigation" doesn't reach it — without this, clicking a link to another
  // page (e.g. a portfolio category) lands wherever Lenis happened to be
  // scrolled to on the previous page instead of at the top of the new one.
  //
  // If the new URL carries a hash (e.g. "/#selected-works", used by the
  // category pages' "Back to Home" link), land on that section instead of
  // the very top.
  useEffect(() => {
    if (!lenis) return;
    // Wait a frame so the new page's layout (and ScrollTrigger's own
    // recalculation of pinned/animated sections) has settled before
    // measuring where the hash target actually is.
    const raf = requestAnimationFrame(() => {
      ScrollTrigger.refresh();
      const hash = window.location.hash;
      const target = hash ? document.querySelector(hash) : null;
      if (target) {
        lenis.scrollTo(target as HTMLElement, { immediate: true, offset: -40 });
      } else {
        lenis.scrollTo(0, { immediate: true });
      }
    });
    return () => cancelAnimationFrame(raf);
  }, [pathname, lenis]);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
