"use client";

import { useRef, ButtonHTMLAttributes, ReactNode } from "react";
import { gsap } from "@/lib/gsap";
import clsx from "@/lib/clsx";

interface MagneticButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "solid" | "outline" | "light" | "invertedSolid";
  strength?: number;
}

export default function MagneticButton({
  children,
  className,
  variant = "solid",
  strength = 0.25,
  ...props
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  function onMouseMove(e: React.MouseEvent<HTMLButtonElement>) {
    const el = ref.current;
    if (!el || window.matchMedia("(hover: none)").matches) return;
    const rect = el.getBoundingClientRect();
    const relX = e.clientX - rect.left - rect.width / 2;
    const relY = e.clientY - rect.top - rect.height / 2;
    gsap.to(el, { x: relX * strength, y: relY * strength, duration: 0.5, ease: "power3.out" });
    gsap.to(textRef.current, { x: relX * strength * 0.5, y: relY * strength * 0.5, duration: 0.5, ease: "power3.out" });
  }

  function onMouseLeave() {
    gsap.to(ref.current, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.4)" });
    gsap.to(textRef.current, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.4)" });
  }

  return (
    <button
      ref={ref}
      data-cursor="link"
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={clsx(
        "relative isolate inline-flex items-center justify-center px-8 py-3.5 text-xs uppercase tracking-[0.25em] transition-colors duration-300",
        variant === "solid" && "bg-charcoal text-ivory hover:bg-brown",
        variant === "outline" && "border border-ink/25 text-ink hover:border-ink",
        variant === "light" && "border border-ivory/40 text-ivory hover:border-ivory",
        variant === "invertedSolid" && "bg-ivory text-charcoal hover:bg-gold",
        className
      )}
      {...props}
    >
      <span ref={textRef} className="relative inline-block">
        {children}
      </span>
    </button>
  );
}
