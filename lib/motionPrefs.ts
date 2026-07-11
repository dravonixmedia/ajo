"use client";

import { useEffect, useState } from "react";

function mediaMatches(query: string): boolean {
  return typeof window !== "undefined" && window.matchMedia(query).matches;
}

/** True when the user has requested reduced motion at the OS level. */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() => mediaMatches("(prefers-reduced-motion: reduce)"));

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

/** Cheap viewport-width heuristic used to scale animation intensity down on mobile. */
export function useIsMobileViewport(): boolean {
  const [isMobile, setIsMobile] = useState(() => mediaMatches("(max-width: 767px)"));

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return isMobile;
}
