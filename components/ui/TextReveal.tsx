"use client";

import { useRef, ElementType } from "react";
import { motion, useInView } from "framer-motion";
import clsx from "@/lib/clsx";

interface TextRevealProps {
  lines: string[];
  className?: string;
  lineClassName?: string;
  as?: ElementType;
  delay?: number;
  once?: boolean;
}

/** Reveals an array of text lines one at a time, masked by an overflow-hidden wrapper. */
export default function TextReveal({
  lines,
  className,
  lineClassName,
  as: As = "div",
  delay = 0,
  once = true,
}: TextRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: "-10% 0px -10% 0px" });

  return (
    <As ref={ref} className={className}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden">
          <motion.span
            className={clsx("block", lineClassName)}
            initial={{ y: "110%" }}
            animate={isInView ? { y: 0 } : { y: "110%" }}
            transition={{ duration: 0.9, delay: delay + i * 0.09, ease: [0.16, 1, 0.3, 1] }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </As>
  );
}
