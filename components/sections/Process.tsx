"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import SectionLabel from "@/components/ui/SectionLabel";
import Reveal from "@/components/ui/Reveal";

const STEPS = [
  { n: "01", title: "Discover", copy: "Understand your business, audience, services, and goal." },
  { n: "02", title: "Plan", copy: "Create the website structure, content flow, and conversion strategy." },
  { n: "03", title: "Design", copy: "Build a premium visual direction that matches your brand." },
  { n: "04", title: "Develop", copy: "Create a responsive, fast, SEO-ready website." },
  { n: "05", title: "Launch", copy: "Connect domain, forms, WhatsApp, Google Search Console, and analytics." },
  { n: "06", title: "Improve", copy: "Review performance and improve based on real user behavior." },
];

export default function Process() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start center", "end center"] });
  const beamScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section id="process" ref={ref} className="relative px-6 py-28 md:py-32">
      <div className="mx-auto max-w-4xl">
        <Reveal>
          <SectionLabel index="06" title="Process" />
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="font-display max-w-xl text-3xl font-medium leading-tight md:text-5xl">
            From Idea to Launch — A Clear Website Process
          </h2>
        </Reveal>

        <div className="relative mt-20 pl-10">
          <div className="absolute left-[7px] top-2 bottom-2 w-px bg-white/10" />
          <motion.div
            className="absolute left-[7px] top-2 w-px origin-top bg-gradient-to-b from-accent via-accent to-accent-2"
            style={{ scaleY: beamScale, height: "calc(100% - 1rem)" }}
          />

          <div className="flex flex-col gap-16">
            {STEPS.map((step, i) => (
              <StepRow key={step.n} step={step} index={i} total={STEPS.length} progress={scrollYProgress} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function StepRow({
  step,
  index,
  total,
  progress,
}: {
  step: (typeof STEPS)[number];
  index: number;
  total: number;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const threshold = index / total;
  const dotScale = useTransform(progress, [threshold - 0.05, threshold + 0.05], [0.4, 1]);
  const dotGlow = useTransform(progress, [threshold - 0.05, threshold + 0.05], [0, 1]);
  const opacity = useTransform(progress, [threshold - 0.1, threshold + 0.05], [0.35, 1]);

  return (
    <motion.div style={{ opacity }} className="relative flex gap-8">
      <motion.span
        style={{ scale: dotScale, boxShadow: useTransform(dotGlow, (g) => `0 0 ${g * 22}px ${g * 4}px rgba(0,229,255,${g * 0.7})`) }}
        className="absolute -left-10 top-1.5 h-3.5 w-3.5 rounded-full bg-accent"
      />
      <span className="font-display text-sm text-highlight/30">{step.n}</span>
      <div>
        <h3 className="font-display text-2xl md:text-3xl">{step.title}</h3>
        <p className="mt-2 max-w-md text-sm text-highlight/55">{step.copy}</p>
      </div>
    </motion.div>
  );
}
