"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Reveal from "@/components/ui/Reveal";
import SectionLabel from "@/components/ui/SectionLabel";
import type { Photo } from "@/lib/content/photos";

interface SignatureStoryData {
  heading: string;
  intro: string;
  photos: Photo[];
}

export default function SignatureStory({ story }: { story: SignatureStoryData }) {
  const ref = useRef<HTMLDivElement>(null);

  if (story.photos.length === 0) return null;

  return (
    <section id="signature-story" className="relative bg-charcoal py-28 text-ivory md:py-36">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <Reveal>
          <SectionLabel index="05" title="Signature Story" tone="light" />
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="font-serif text-4xl leading-[1.1] md:text-6xl">{story.heading}</h2>
        </Reveal>
        <Reveal delay={0.18}>
          <p className="mx-auto mt-8 max-w-xl text-sm leading-relaxed text-ivory/65 md:text-base">{story.intro}</p>
        </Reveal>
      </div>

      <div ref={ref} className="mx-auto mt-20 flex max-w-5xl flex-col gap-24 px-6 md:gap-32">
        {story.photos.map((photo, i) => (
          <StoryFrame key={photo.src} photo={photo} index={i} align={i % 2 === 0 ? "left" : "right"} />
        ))}
      </div>
    </section>
  );
}

function StoryFrame({ photo, index, align }: { photo: Photo; index: number; align: "left" | "right" }) {
  const frameRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: frameRef, offset: ["start 85%", "start 35%"] });
  const y = useTransform(scrollYProgress, [0, 1], [60, 0]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.06, 1]);

  return (
    <motion.div
      ref={frameRef}
      style={{ opacity, y }}
      className={`flex flex-col items-center gap-6 md:flex-row md:gap-12 ${
        align === "right" ? "md:flex-row-reverse" : ""
      }`}
    >
      <motion.div style={{ scale }} className="relative w-full overflow-hidden md:w-3/5">
        <div className="relative w-full" style={{ aspectRatio: `${photo.width} / ${photo.height}` }}>
          <Image src={photo.src} alt={photo.alt} fill sizes="(min-width: 768px) 60vw, 100vw" className="object-cover" />
        </div>
      </motion.div>
      <div className="flex w-full flex-col items-center gap-2 text-center md:w-2/5 md:items-start md:text-left">
        <span className="font-serif text-5xl text-gold/70">{String(index + 1).padStart(2, "0")}</span>
        <p className="max-w-xs text-sm text-ivory/60">{photo.alt}</p>
      </div>
    </motion.div>
  );
}
