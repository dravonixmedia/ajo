"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import SectionLabel from "@/components/ui/SectionLabel";
import { testimonials } from "@/lib/content/testimonials";
import type { Photo } from "@/lib/content/photos";

export default function Testimonials({ backgrounds }: { backgrounds: Photo[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const interval = setInterval(() => setIndex((i) => (i + 1) % testimonials.length), 7000);
    return () => clearInterval(interval);
  }, []);

  const bg = backgrounds.length > 0 ? backgrounds[index % backgrounds.length] : null;
  const testimonial = testimonials[index];

  return (
    <section className="relative flex min-h-[85vh] items-center justify-center overflow-hidden bg-charcoal py-28">
      {bg && (
        <motion.div
          key={bg.src}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <Image src={bg.src} alt={bg.alt} fill sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-charcoal/70" />
        </motion.div>
      )}

      <div className="relative z-10 mx-auto max-w-3xl px-6 text-center text-ivory">
        <SectionLabel index="10" title="Testimonials" tone="light" />
        <span aria-hidden className="font-serif block text-8xl leading-none text-gold/70 md:text-9xl">
          &ldquo;
        </span>

        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="-mt-6"
          >
            <p className="font-serif text-2xl leading-snug text-ivory md:text-3xl">{testimonial.quote}</p>
            <p className="mt-8 text-xs uppercase tracking-[0.25em] text-ivory/60">
              {testimonial.name} &middot; {testimonial.context}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
