"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { gsap } from "@/lib/gsap";
import { useAppStore } from "@/store/useAppStore";

// The loader is a client-only overlay shown on every page (not just the
// home hero), so it intentionally uses one fixed background image rather
// than the dynamic, auto-scanned hero rotation.
const LOADER_BACKGROUND_SRC = "/photos/hero/hero.jpg";

export default function Loader() {
  const progress = useAppStore((s) => s.progress);
  const setProgress = useAppStore((s) => s.setProgress);
  const finishLoading = useAppStore((s) => s.finishLoading);
  const [exiting, setExiting] = useState(false);
  const [visible, setVisible] = useState(true);
  const tweenValue = useRef({ v: 0 });

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const tween = gsap.to(tweenValue.current, {
      v: 100,
      duration: reduced ? 0.6 : 2,
      ease: "power2.inOut",
      onUpdate: () => setProgress(Math.round(tweenValue.current.v)),
      onComplete: () => {
        setTimeout(() => setExiting(true), 200);
      },
    });

    return () => {
      tween.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!exiting) return;
    const timeout = setTimeout(() => {
      document.body.style.overflow = "";
      finishLoading();
      setVisible(false);
    }, 950);
    return () => clearTimeout(timeout);
  }, [exiting, finishLoading]);

  if (!visible) return null;

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

      {/* Curtain-mask exit: two panels part vertically to reveal the page */}
      <motion.div
        className="absolute inset-x-0 top-0 h-1/2 bg-charcoal"
        initial={{ y: 0 }}
        animate={exiting ? { y: "-100%" } : { y: 0 }}
        transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
      />
      <motion.div
        className="absolute inset-x-0 bottom-0 h-1/2 bg-charcoal"
        initial={{ y: 0 }}
        animate={exiting ? { y: "100%" } : { y: 0 }}
        transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
      />
    </div>
  );
}
