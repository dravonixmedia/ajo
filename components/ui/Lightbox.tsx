"use client";

import { useCallback, useEffect } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import type { Photo } from "@/lib/content/photos";

interface LightboxProps {
  photos: Photo[];
  index: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export default function Lightbox({ photos, index, onClose, onNavigate }: LightboxProps) {
  const open = index !== null;
  const current = open ? photos[index as number] : null;

  const goNext = useCallback(() => {
    if (index === null) return;
    onNavigate((index + 1) % photos.length);
  }, [index, photos.length, onNavigate]);

  const goPrev = useCallback(() => {
    if (index === null) return;
    onNavigate((index - 1 + photos.length) % photos.length);
  }, [index, photos.length, onNavigate]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose, goNext, goPrev]);

  return (
    <AnimatePresence>
      {open && current && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Photo gallery viewer"
          className="fixed inset-0 z-[90] flex flex-col bg-charcoal/97"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
        >
          <div className="flex items-center justify-between px-6 py-5 text-ivory/70 md:px-10">
            <span className="text-xs uppercase tracking-[0.25em]">
              {(index as number) + 1} / {photos.length}
            </span>
            <button
              aria-label="Close gallery"
              data-cursor="link"
              onClick={onClose}
              className="text-xs uppercase tracking-[0.25em] hover:text-ivory"
            >
              Close ✕
            </button>
          </div>

          <div className="relative flex flex-1 items-center justify-center px-4 pb-6 md:px-16">
            <button
              aria-label="Previous photograph"
              data-cursor="link"
              onClick={goPrev}
              className="absolute left-2 top-1/2 z-10 -translate-y-1/2 px-3 py-6 text-2xl text-ivory/50 hover:text-ivory md:left-6"
            >
              ‹
            </button>

            <motion.div
              key={current.src}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative h-full max-h-[80vh] w-full max-w-5xl"
            >
              <Image
                src={current.src}
                alt={current.alt}
                fill
                sizes="90vw"
                className="object-contain"
                priority
              />
            </motion.div>

            <button
              aria-label="Next photograph"
              data-cursor="link"
              onClick={goNext}
              className="absolute right-2 top-1/2 z-10 -translate-y-1/2 px-3 py-6 text-2xl text-ivory/50 hover:text-ivory md:right-6"
            >
              ›
            </button>
          </div>

          <p className="px-6 pb-6 text-center text-xs text-ivory/40 md:px-10">{current.alt}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
