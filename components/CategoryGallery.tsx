"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Reveal from "@/components/ui/Reveal";
import EditorialGrid from "@/components/ui/EditorialGrid";
import Lightbox from "@/components/ui/Lightbox";
import { ALL_CATEGORIES, type PortfolioCategory } from "@/lib/content/photos";

export default function CategoryGallery({ category }: { category: PortfolioCategory }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const cover = category.photos[0];
  const others = ALL_CATEGORIES.filter((c) => c.slug !== category.slug);

  return (
    <>
    <Header />
    <main className="bg-bg">
      <section className="relative h-[70vh] w-full overflow-hidden bg-charcoal">
        {cover && <Image src={cover.src} alt={cover.alt} fill priority sizes="100vw" className="object-cover" />}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/85 via-charcoal/20 to-charcoal/40" />
        <div className="relative z-10 flex h-full flex-col items-center justify-end px-6 pb-16 text-center text-ivory">
          <p className="mb-4 text-[11px] uppercase tracking-[0.5em] text-gold">Portfolio</p>
          <h1 className="font-serif text-5xl md:text-7xl">{category.title}</h1>
          <p className="mt-6 max-w-xl text-sm text-ivory/70 md:text-base">{category.description}</p>
        </div>
      </section>

      <section className="px-3 py-10 md:px-6 md:py-16">
        {category.photos.length > 0 ? (
          <EditorialGrid photos={category.photos} onOpen={setOpenIndex} />
        ) : (
          <p className="py-16 text-center text-sm text-ink-faint">New photographs coming soon.</p>
        )}
      </section>

      <section className="border-t border-ink/10 bg-bg-alt px-6 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <Reveal>
            <p className="section-label mb-6 justify-center">Explore More</p>
          </Reveal>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/"
              data-cursor="link"
              className="bg-charcoal px-6 py-3 text-xs uppercase tracking-[0.2em] text-ivory transition-colors hover:bg-brown"
            >
              ← Back to Home
            </Link>
            {others.map((c) => (
              <Link
                key={c.slug}
                href={`/portfolio/${c.slug}`}
                data-cursor="link"
                className="border border-ink/20 px-6 py-3 text-xs uppercase tracking-[0.2em] text-ink transition-colors hover:border-ink"
              >
                {c.title}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Lightbox
        photos={category.photos}
        index={openIndex}
        onClose={() => setOpenIndex(null)}
        onNavigate={setOpenIndex}
      />
    </main>
    <Footer />
    </>
  );
}
