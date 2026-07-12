"use client";

import Image from "next/image";
import Reveal from "@/components/ui/Reveal";
import type { Photo } from "@/lib/content/photos";

interface EditorialGridProps {
  photos: Photo[];
  onOpen: (index: number) => void;
}

/**
 * Uniform gallery grid: every tile is cropped to a fixed 1:1 or 4:5 frame
 * (alternating), regardless of the source photo's native orientation, so
 * more photographs are visible on a single screen instead of one large
 * full-bleed image per row.
 */
export default function EditorialGrid({ photos, onOpen }: EditorialGridProps) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:gap-3 lg:grid-cols-4">
      {photos.map((photo, i) => (
        <Reveal key={photo.src} delay={0.03 * (i % 8)}>
          <Frame photo={photo} index={i} onOpen={onOpen} ratio={i % 2 === 0 ? "4 / 5" : "1 / 1"} />
        </Reveal>
      ))}
    </div>
  );
}

function Frame({
  photo,
  index,
  onOpen,
  ratio,
}: {
  photo: Photo;
  index: number;
  onOpen: (index: number) => void;
  ratio: string;
}) {
  return (
    <button
      type="button"
      data-cursor="image"
      aria-label={`Open photograph: ${photo.alt}`}
      onClick={() => onOpen(index)}
      className="group relative block w-full overflow-hidden bg-paper"
      style={{ aspectRatio: ratio }}
    >
      <Image
        src={photo.src}
        alt={photo.alt}
        fill
        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
        className="scale-[1.08] object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-100"
      />
    </button>
  );
}
