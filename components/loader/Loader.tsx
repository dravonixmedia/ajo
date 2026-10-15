"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { gsap } from "@/lib/gsap";
import { useAppStore } from "@/store/useAppStore";
import { usePrefersReducedMotion } from "@/lib/motionPrefs";

// The loader is a client-only overlay shown on every page (not just the
// home hero), so it intentionally uses one fixed background image rather
// than the dynamic, auto-scanned hero rotation.
const LOADER_BACKGROUND_SRC = "/photos/hero/hero.jpg";

// Bounded readiness window: the loader never disappears before
// MIN_VISIBLE_MS (so the brand moment always reads as intentional, even
// on an instant cached load) and never waits past MAX_WAIT_MS for real
// page-load to be detected (so a slow connection never stacks several
// seconds of actual loading underneath an equally long artificial
// animation). Exit begins as soon as both conditions are satisfied.
const MIN_VISIBLE_MS = 700;
const MAX_WAIT_MS = 1600;

export default function Loader() {
  const progress = useAppStore((s) => s.progress);
  const setProgress = useAppStore((s) => s.setProgress);
  const finishLoading = useAppStore((s) => s.finishLoading);
  const [exiting, setExiting] = useState(false);
  const [visible, setVisible] = useState(true);
  const tweenValue = useRef({ v: 0 });
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const tweenTarget = tweenValue.current;

    let cancelled = false;
    let minElapsed = false;
    let pageReady = false;
    let finished = false;

    // Fills toward ~85% during the minimum visible window — this is a
    // branding pace, not a measurement of real asset/network progress.
    const fillTween = gsap.to(tweenTarget, {
      v: 85,
      duration: reduced ? 0.3 : 0.65,
      ease: "power2.out",
      onUpdate: () => setProgress(Math.round(tweenTarget.v)),
    });

    function finish() {
      if (finished || cancelled) return;
      finished = true;
      gsap.to(tweenTarget, {
        v: 100,
        duration: reduced ? 0.1 : 0.2,
        ease: "power1.out",
        onUpdate: () => setProgress(Math.round(tweenTarget.v)),
        onComplete: () => {
          if (!cancelled) setExiting(true);
        },
      });
    }

    function tryFinish() {
      if (!cancelled && minElapsed && pageReady) finish();
    }

    const minTimer = setTimeout(() => {
      minElapsed = true;
      tryFinish();
    }, MIN_VISIBLE_MS);

    // Ceiling: force the exit even if the load event never arrives (or
    // arrives very late on a slow connection) — the site should never
    // wait indefinitely, and native lazy-loading for below-the-fold
    // images continues normally after this point regardless.
    const maxTimer = setTimeout(finish, MAX_WAIT_MS);

    function onWindowLoad() {
      pageReady = true;
      tryFinish();
    }

    // The loader is dynamically imported (ssr:false) and can mount after
    // `window.load` has already fired, so check readyState first —
    // otherwise a page that finished loading before this effect even ran
    // would wait on an event that will never come again.
    if (document.readyState === "complete") {
      pageReady = true;
    } else {
      window.addEventListener("load", onWindowLoad, { once: true });
    }
    tryFinish();

    return () => {
      cancelled = true;
      clearTimeout(minTimer);
      clearTimeout(maxTimer);
      fillTween.kill();
      gsap.killTweensOf(tweenTarget);
      window.removeEventListener("load", onWindowLoad);
      if (!finished) {
        // Unmounted mid-cycle for some reason — never leave the page
        // scroll-locked.
        document.body.style.overflow = "";
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!exiting) return;
    // Wait for exactly the curtain animation's own duration (plus a tiny
    // safety margin), not an arbitrary extra delay on top of it.
    const exitAnimMs = reducedMotion ? 300 : 900;
    const timeout = setTimeout(() => {
      document.body.style.overflow = "";
      finishLoading();
      setVisible(false);
    }, exitAnimMs + 50);
    return () => clearTimeout(timeout);
  }, [exiting, finishLoading, reducedMotion]);

  if (!visible) return null;

  const curtainTransition = reducedMotion
    ? { duration: 0.3, ease: "easeOut" as const }
    : { duration: 0.9, ease: [0.76, 0, 0.24, 1] as const };
  // Reduced motion: no full-screen sliding panels, just a clean fade.
  const topPanelAnimate = exiting
    ? reducedMotion
      ? { opacity: 0 }
      : { y: "-100%" }
    : reducedMotion
      ? { opacity: 1 }
      : { y: 0 };
  const bottomPanelAnimate = exiting
    ? reducedMotion
      ? { opacity: 0 }
      : { y: "100%" }
    : reducedMotion
      ? { opacity: 1 }
      : { y: 0 };

  return (
    <div className="fixed inset-0 z-[100]">
      <div className="absolute inset-0 overflow-hidden bg-charcoal">
        <Image
          src={LOADER_BACKGROUND_SRC}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-charcoal/60" />
      </div>

      {/* Curtain-mask exit: two panels part vertically to reveal the page
          (or simply fade, under reduced motion). Rendered before the
          branded content below so the (opaque) panels sit behind it —
          otherwise they'd paint over and hide the logo/progress bar for
          the entire non-exiting phase. */}
      <motion.div
        className="absolute inset-x-0 top-0 h-1/2 bg-charcoal"
        initial={false}
        animate={topPanelAnimate}
        transition={curtainTransition}
      />
      <motion.div
        className="absolute inset-x-0 bottom-0 h-1/2 bg-charcoal"
        initial={false}
        animate={bottomPanelAnimate}
        transition={curtainTransition}
      />

      <AnimatePresence>
        {!exiting && (
          <motion.div
            className="pointer-events-none absolute inset-0 flex flex-col items-center justify-between p-8 md:p-14"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex w-full items-center justify-between text-[10px] tracking-[0.35em] text-ivory/40">
              <span>KERALA, INDIA</span>
              <span>PHOTOGRAPHY</span>
            </div>

            <div className="flex flex-col items-center gap-5 text-center">
              <h1 className="font-serif text-4xl tracking-[0.08em] text-ivory md:text-6xl">AJO ABRAHAM</h1>
              <p className="text-[11px] uppercase tracking-[0.5em] text-gold">Photographer</p>
              <div className="mt-4 h-px w-40 overflow-hidden bg-ivory/15 md:w-56">
                <motion.div className="h-full bg-gold" style={{ width: `${progress}%` }} />
              </div>
            </div>

            <div className="text-[10px] tracking-[0.35em] text-ivory/30">
              STORIES IN LIGHT. MEMORIES FOR LIFE.
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
