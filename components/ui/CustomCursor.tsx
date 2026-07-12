"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import clsx from "@/lib/clsx";

type HoverKind = "none" | "link" | "image";

const LINK_GRADIENT = "conic-gradient(from 180deg, #a855f7, #ec4899, #a855f7)";
const LINK_GLOW = "drop-shadow(0 0 6px rgba(236, 72, 153, 0.45))";
const IMAGE_GRADIENT = "conic-gradient(from 180deg, #b49a6c, #f4f0e8, #b49a6c)";
const IMAGE_GLOW = "drop-shadow(0 0 10px rgba(180, 154, 108, 0.55))";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [hoverKind, setHoverKind] = useState<HoverKind>("none");

  useEffect(() => {
    if (window.matchMedia("(hover: none)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!dot || !ring || !label) return;

    const dotX = gsap.quickTo(dot, "x", { duration: 0.1, ease: "power3.out" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.1, ease: "power3.out" });
    const ringX = gsap.quickTo(ring, "x", { duration: 0.35, ease: "power3.out" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.35, ease: "power3.out" });
    const labelX = gsap.quickTo(label, "x", { duration: 0.35, ease: "power3.out" });
    const labelY = gsap.quickTo(label, "y", { duration: 0.35, ease: "power3.out" });

    function onMouseMove(e: MouseEvent) {
      setActive((prev) => prev || true);
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);
      labelX(e.clientX);
      labelY(e.clientY);
    }

    // Delegated on the document, so newly rendered elements (route changes,
    // lazy content) are covered automatically with no rebinding needed.
    function onMouseOver(e: MouseEvent) {
      const target = (e.target as HTMLElement)?.closest?.("[data-cursor]") as HTMLElement | null;
      const kind = (target?.dataset.cursor as HoverKind) ?? "none";
      setHoverKind((prev) => (prev === kind ? prev : kind));
    }

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseover", onMouseOver);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseover", onMouseOver);
    };
  }, []);

  useEffect(() => {
    const ring = ringRef.current;
    const dot = dotRef.current;
    const label = labelRef.current;
    if (!ring || !dot || !label) return;

    if (hoverKind === "image") {
      gsap.to(ring, { scale: 4.2, opacity: 0.9, duration: 0.35, ease: "power3.out" });
      gsap.to(dot, { scale: 0, duration: 0.2 });
      gsap.to(label, { opacity: 1, scale: 1, duration: 0.3, ease: "power3.out" });
    } else if (hoverKind === "link") {
      gsap.to(ring, { scale: 2.4, opacity: 0.55, duration: 0.3, ease: "power3.out" });
      gsap.to(dot, { scale: 0, duration: 0.2 });
      gsap.to(label, { opacity: 0, scale: 0.6, duration: 0.2 });
    } else {
      gsap.to(ring, { scale: 1, opacity: 1, duration: 0.3, ease: "power3.out" });
      gsap.to(dot, { scale: 1, duration: 0.2 });
      gsap.to(label, { opacity: 0, scale: 0.6, duration: 0.2 });
    }
  }, [hoverKind]);

  return (
    <div
      className={clsx(
        "pointer-events-none fixed inset-0 z-[70] hidden transition-opacity duration-300 md:block",
        active ? "opacity-100" : "opacity-0"
      )}
      aria-hidden
    >
      <div
        ref={ringRef}
        className="absolute left-0 top-0 h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full transition-[background] duration-200"
        style={{
          background: hoverKind === "image" ? IMAGE_GRADIENT : LINK_GRADIENT,
          WebkitMask: "radial-gradient(circle, transparent 62%, black 63%)",
          mask: "radial-gradient(circle, transparent 62%, black 63%)",
          filter: hoverKind === "image" ? IMAGE_GLOW : LINK_GLOW,
        }}
      />
      <div
        ref={dotRef}
        className="absolute left-0 top-0 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: "linear-gradient(135deg, #a855f7, #ec4899)" }}
      />
      <div
        ref={labelRef}
        className="absolute left-0 top-0 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center text-[9px] font-medium uppercase tracking-[0.25em] text-charcoal opacity-0"
      >
        View
      </div>
    </div>
  );
}
