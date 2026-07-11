"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Reveal from "@/components/ui/Reveal";
import SectionLabel from "@/components/ui/SectionLabel";
import { processSteps } from "@/lib/content/process";

export default function ClientExperience() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 60%"] });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section id="process" className="relative bg-bg-alt py-28 md:py-36">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <SectionLabel index="09" title="Client Experience" />
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="font-serif max-w-xl text-4xl leading-[1.1] text-ink md:text-6xl">
            A Calm, Considered Process
          </h2>
        </Reveal>

        <div ref={ref} className="relative mt-20">
          <div className="absolute left-0 right-0 top-2 hidden h-px bg-ink/10 md:block" />
          <motion.div
            className="absolute left-0 top-2 hidden h-px origin-left bg-gold md:block"
            style={{ scaleX: lineScale, right: 0 }}
          />

          <div className="grid grid-cols-1 gap-12 md:grid-cols-5 md:gap-6">
            {processSteps.map((step, i) => (
              <Reveal key={step.n} delay={0.08 * i} className="relative">
                <span className="absolute -top-[3px] hidden h-2 w-2 -translate-x-1/2 rounded-full bg-gold md:block" />
                <div className="flex flex-col gap-3 md:pt-8">
                  <span className="font-serif text-lg text-ink-faint">{step.n}</span>
                  <h3 className="font-serif text-2xl text-ink">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-ink-soft">{step.copy}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
