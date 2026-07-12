import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import SectionLabel from "@/components/ui/SectionLabel";
import HorizontalGallery from "@/components/ui/HorizontalGallery";
import { getPortfolioCategories } from "@/lib/content/photoScanner";
import type { PortfolioCategory } from "@/lib/content/photos";

export default function SelectedWorks() {
  const portfolioCategories = getPortfolioCategories();
  const filmstrip = portfolioCategories.flatMap((c) => c.photos.slice(0, 3));

  return (
    <section id="selected-works" className="relative bg-bg py-28 md:py-36">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <SectionLabel index="04" title="Selected Works" />
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="font-serif max-w-2xl text-4xl leading-[1.1] text-ink md:text-6xl">
            An Immersive Portfolio
          </h2>
        </Reveal>
      </div>

      <div className="mt-16 flex flex-col">
        {portfolioCategories.map((category, i) => (
          <CategoryTile key={category.slug} category={category} reverse={i % 2 === 1} />
        ))}
      </div>

      {filmstrip.length > 0 && (
        <div className="mt-24">
          <div className="mx-auto mb-8 max-w-6xl px-6">
            <p className="section-label">Scroll to explore</p>
          </div>
          <HorizontalGallery photos={filmstrip} />
        </div>
      )}
    </section>
  );
}

function CategoryTile({ category, reverse }: { category: PortfolioCategory; reverse: boolean }) {
  const cover = category.photos[0];
  return (
    <Reveal className="border-t border-ink/10">
      <Link
        href={`/portfolio/${category.slug}`}
        data-cursor="image"
        className={`group flex flex-col gap-0 md:flex-row md:items-center ${reverse ? "md:flex-row-reverse" : ""}`}
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-paper md:w-3/5">
          {cover && (
            <Image
              src={cover.src}
              alt={cover.alt}
              fill
              sizes="(min-width: 768px) 60vw, 100vw"
              className="scale-[1.08] object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-100"
            />
          )}
        </div>
        <div className="flex w-full flex-col justify-center px-6 py-10 md:w-2/5 md:px-12">
          <span className="section-label mb-4">{category.title}</span>
          <p className="max-w-sm text-sm leading-relaxed text-ink-soft">{category.description}</p>
          <span className="mt-6 inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-ink">
            View Gallery
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </span>
        </div>
      </Link>
    </Reveal>
  );
}
