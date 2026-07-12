import Image from "next/image";
import Reveal from "@/components/ui/Reveal";
import SectionLabel from "@/components/ui/SectionLabel";
import MagneticButton from "@/components/ui/MagneticButton";
import { getRecentStories } from "@/lib/content/photoScanner";
import { INSTAGRAM_HANDLE, INSTAGRAM_URL } from "@/lib/siteConfig";

export default function RecentStories() {
  const recentStories = getRecentStories();

  return (
    <section id="recent-stories" className="relative bg-bg py-28 md:py-36">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <Reveal>
              <SectionLabel index="11" title="Journal" />
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="font-serif max-w-lg text-4xl leading-[1.1] text-ink md:text-6xl">
                Recent Stories
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.15}>
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
              <MagneticButton variant="outline">Follow @{INSTAGRAM_HANDLE}</MagneticButton>
            </a>
          </Reveal>
        </div>

        {recentStories.length === 0 && (
          <p className="mt-14 text-sm text-ink-faint">New stories coming soon.</p>
        )}

        <div className="mt-14 grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-3">
          {recentStories.map((photo, i) => (
            <Reveal key={photo.src} delay={0.03 * i}>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="image"
                className="group relative block aspect-square overflow-hidden bg-paper"
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(min-width: 768px) 33vw, 50vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-charcoal/0 opacity-0 transition-all duration-300 group-hover:bg-charcoal/30 group-hover:opacity-100">
                  <span className="text-xs uppercase tracking-[0.25em] text-ivory">View on Instagram</span>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
