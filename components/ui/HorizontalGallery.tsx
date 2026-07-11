"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import type { Photo } from "@/lib/content/photos";

interface HorizontalGalleryProps {
  photos: Photo[];
}

/** A horizontal filmstrip that tracks vertical scroll while pinned in view. */
export default function HorizontalGallery({ photos }: HorizontalGalleryProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

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
          start: "top top",
          end: () => `+=${distance}`,
          scrub: 0.6,
          pin: true,
          invalidateOnRefresh: true,
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

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
