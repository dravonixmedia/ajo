"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import clsx from "@/lib/clsx";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(hover: none)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const dotX = gsap.quickTo(dot, "x", { duration: 0.1, ease: "power3.out" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.1, ease: "power3.out" });
    const ringX = gsap.quickTo(ring, "x", { duration: 0.35, ease: "power3.out" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.35, ease: "power3.out" });

    function onMove(e: MouseEvent) {
      setActive((prev) => prev || true);
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);
    }

    function onEnterInteractive() {
      gsap.to(ring, { scale: 2.4, opacity: 0.5, duration: 0.3 });
      gsap.to(dot, { scale: 0, duration: 0.2 });
    }
    function onLeaveInteractive() {
      gsap.to(ring, { scale: 1, opacity: 1, duration: 0.3 });
      gsap.to(dot, { scale: 1, duration: 0.2 });
    }

    function bindTargets() {
      const els = document.querySelectorAll<HTMLElement>("[data-cursor='link']");
      els.forEach((el) => {
        el.addEventListener("mouseenter", onEnterInteractive);
        el.addEventListener("mouseleave", onLeaveInteractive);
      });
      return els;
    }

    window.addEventListener("mousemove", onMove);
    let els = bindTargets();

    const observer = new MutationObserver(() => {
      els.forEach((el) => {
        el.removeEventListener("mouseenter", onEnterInteractive);
        el.removeEventListener("mouseleave", onLeaveInteractive);
      });
      els = bindTargets();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", onMove);
      els.forEach((el) => {
        el.removeEventListener("mouseenter", onEnterInteractive);
        el.removeEventListener("mouseleave", onLeaveInteractive);
      });
      observer.disconnect();
    };
  }, []);

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
        className="absolute left-0 top-0 h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background: "conic-gradient(from 180deg, #a855f7, #ec4899, #a855f7)",
          WebkitMask: "radial-gradient(circle, transparent 62%, black 63%)",
          mask: "radial-gradient(circle, transparent 62%, black 63%)",
          filter: "drop-shadow(0 0 6px rgba(236, 72, 153, 0.45))",
        }}
      />
      <div
        ref={dotRef}
        className="absolute left-0 top-0 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: "linear-gradient(135deg, #a855f7, #ec4899)" }}
      />
    </div>
  );
}
