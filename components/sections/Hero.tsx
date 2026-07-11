"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import TextReveal from "@/components/ui/TextReveal";
import MagneticButton from "@/components/ui/MagneticButton";
import type { Photo } from "@/lib/content/photos";
import { useLenis } from "@/components/providers/SmoothScrollProvider";
import { whatsappLink } from "@/lib/siteConfig";

export default function Hero({ slides }: { slides: Photo[] }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [slide, setSlide] = useState(0);
  const lenis = useLenis();

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    if (slides.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const interval = setInterval(() => setSlide((s) => (s + 1) % slides.length), 6000);
    return () => clearInterval(interval);
  }, [slides.length]);

  function scrollToWorks(e: React.MouseEvent) {
    e.preventDefault();
    const el = document.querySelector("#selected-works");
    if (el && lenis) lenis.scrollTo(el as HTMLElement, { offset: -20 });
    else el?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section id="hero" ref={sectionRef} className="relative h-[100svh] w-full overflow-hidden bg-charcoal">
      <motion.div className="absolute inset-0" style={{ y }}>
        {slides.map((photo, i) => (
          <motion.div
            key={photo.src}
            className="absolute inset-0"
            initial={false}
            animate={{ opacity: i === slide ? 1 : 0 }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <Image src={photo.src} alt={photo.alt} fill priority={i === 0} sizes="100vw" className="object-cover" />
          </motion.div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-charcoal/40" />
      </motion.div>

      <motion.div
        style={{ opacity }}
        className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center"
      >
        <p className="mb-6 text-[11px] uppercase tracking-[0.5em] text-gold">Kerala, India</p>
        <TextReveal
          as="h1"
          lines={["Stories in Light.", "Memories for Life."]}
          className="font-serif text-5xl leading-[1.05] text-ivory sm:text-6xl md:text-7xl lg:text-8xl"
          delay={0.3}
        />
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 max-w-xl text-sm text-ivory/70 md:text-base"
        >
          Wedding, fashion and portrait photography shaped by emotion, light and honest human moments.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
        >
          <a href="#selected-works" onClick={scrollToWorks}>
            <MagneticButton variant="light">Explore the Portfolio</MagneticButton>
          </a>
          <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
            <MagneticButton variant="invertedSolid">Book a Session</MagneticButton>
          </a>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-[10px] uppercase tracking-[0.4em] text-ivory/50"
      >
        Scroll
      </motion.div>
    </section>
  );
}
