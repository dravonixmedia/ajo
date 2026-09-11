"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useAppStore } from "@/store/useAppStore";
import type { Photo } from "@/lib/content/photos";

interface HorizontalGalleryProps {
  photos: Photo[];
}

/**
 * Height of the fixed site header, read live from the DOM. The header's
 * height isn't a fixed design token (it's padding + content, see
 * Header.tsx), so it's measured rather than hardcoded.
 */
function getHeaderOffset() {
  const header = document.querySelector<HTMLElement>("[data-site-header]");
  return header?.offsetHeight ?? 0;
}

/** A horizontal filmstrip that tracks vertical scroll while pinned in view. */
export default function HorizontalGallery({ photos }: HorizontalGalleryProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const hasEnteredHero = useAppStore((s) => s.hasEnteredHero);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      const distance = track.scrollWidth - section.clientWidth;
      if (distance <= 0) return;

      gsap.to(track, {
        x: -distance,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          // Pin where the gallery naturally rests below the fixed header,
          // not at the literal viewport top. "top top" pinned the frame
          // flush against y=0 — underneath the header — which is what
          // caused the upward jump and the cropped top edge.
          start: () => `top top+=${getHeaderOffset()}`,
          end: () => `+=${distance}`,
          scrub: 0.6,
          pin: true,
          // Removes the one-frame jump GSAP can introduce when a scrubbed
          // pin engages.
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  // The header only mounts once the loader finishes (Header.tsx returns
  // null until then), so the very first ScrollTrigger calculation can read
  // a header height of 0. Re-measure as soon as it's actually on screen.
  useEffect(() => {
    if (!hasEnteredHero) return;
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [hasEnteredHero]);

  return (
    <div ref={sectionRef} className="relative overflow-hidden">
      <div ref={trackRef} className="flex w-max gap-3 px-6 md:gap-5 md:px-10">
        {photos.map((photo, i) => (
          <div
            key={photo.src + i}
            className="relative h-[62vh] shrink-0 md:h-[74vh]"
            style={{ aspectRatio: `${photo.width} / ${photo.height}` }}
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="70vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
