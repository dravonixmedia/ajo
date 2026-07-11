"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import Logo from "./Logo";
import { useAppStore } from "@/store/useAppStore";
import { useLenis } from "./providers/SmoothScrollProvider";
import { whatsappLink } from "@/lib/siteConfig";
import clsx from "@/lib/clsx";

const NAV = [
  { label: "Portfolio", href: "/#selected-works" },
  { label: "About", href: "/#about" },
  { label: "Journal", href: "/#recent-stories" },
  { label: "Contact", href: "/#contact" },
];

export default function Header() {
  const hasEntered = useAppStore((s) => s.hasEnteredHero);
  const lenis = useLenis();
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrollY, setScrollY] = useState(() => (typeof window !== "undefined" ? window.scrollY : 0));
  const [menuOpen, setMenuOpen] = useState(false);
  const scrolled = !isHome || scrollY > 60;

  useEffect(() => {
    if (!isHome) return;
    function onScroll() {
      setScrollY(window.scrollY);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  function handleNav(e: React.MouseEvent, href: string) {
    setMenuOpen(false);
    if (!isHome) return; // let Next.js perform the route change to "/" then hash-scroll
    e.preventDefault();
    const el = document.querySelector(href.slice(1));
    if (el && lenis) lenis.scrollTo(el as HTMLElement, { offset: -40 });
    else if (el) el.scrollIntoView({ behavior: "smooth" });
  }

  if (!hasEntered) return null;

  const dark = !scrolled && isHome;

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.8 }}
      className={clsx(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-500",
        scrolled ? "bg-ivory/90 backdrop-blur-sm" : "bg-transparent"
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-10">
        <Link href="/#hero" data-cursor="link" onClick={(e) => handleNav(e, "/#hero")}>
          <Logo tone={dark ? "light" : "dark"} />
        </Link>

        <nav className="hidden items-center gap-9 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              data-cursor="link"
              onClick={(e) => handleNav(e, item.href)}
              className={clsx(
                "text-xs uppercase tracking-[0.2em] transition-colors",
                dark ? "text-ivory/75 hover:text-ivory" : "text-ink-soft hover:text-ink"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <a
          href={whatsappLink()}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor="link"
          className={clsx(
            "hidden border px-5 py-2 text-xs uppercase tracking-[0.2em] transition-colors md:inline-block",
            dark ? "border-ivory/40 text-ivory hover:border-ivory" : "border-ink/25 text-ink hover:border-ink"
          )}
        >
          Book a Session
        </a>

        <button
          aria-label="Toggle menu"
          data-cursor="link"
          onClick={() => setMenuOpen((v) => !v)}
          className="flex flex-col gap-1.5 md:hidden"
        >
          <span className={clsx("h-px w-6 transition-colors", dark ? "bg-ivory" : "bg-ink")} />
          <span className={clsx("h-px w-6 transition-colors", dark ? "bg-ivory" : "bg-ink")} />
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 top-0 flex h-screen flex-col items-center justify-center gap-8 bg-charcoal md:hidden"
          >
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={(e) => handleNav(e, item.href)}
                className="font-serif text-3xl text-ivory"
              >
                {item.label}
              </Link>
            ))}
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
              className="mt-4 border border-ivory/40 px-6 py-3 text-xs uppercase tracking-[0.2em] text-ivory"
            >
              Book a Session
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
