"use client";

import Image from "next/image";
import Reveal from "@/components/ui/Reveal";
import type { Photo } from "@/lib/content/photos";
import clsx from "@/lib/clsx";

interface EditorialGridProps {
  photos: Photo[];
  onOpen: (index: number) => void;
}

/**
 * Cycles a small set of editorial layout "blocks" (full-bleed landscape,
 * two-image composition, large vertical portrait, overlapping pair) across
 * the given photos so a category gallery reads like a photography book
 * rather than a uniform grid.
 */
export default function EditorialGrid({ photos, onOpen }: EditorialGridProps) {
  const blocks: React.ReactNode[] = [];
  let i = 0;
  let patternIndex = 0;

  while (i < photos.length) {
    const pattern = patternIndex % 4;
    if (pattern === 0) {
      blocks.push(<FullBlock key={i} photo={photos[i]} index={i} onOpen={onOpen} />);
      i += 1;
    } else if (pattern === 1 && i + 1 < photos.length) {
      blocks.push(<TwoUpBlock key={i} photos={[photos[i], photos[i + 1]]} startIndex={i} onOpen={onOpen} />);
      i += 2;
    } else if (pattern === 2) {
      blocks.push(<PortraitBlock key={i} photo={photos[i]} index={i} onOpen={onOpen} />);
      i += 1;
    } else if (pattern === 3 && i + 1 < photos.length) {
      blocks.push(<OverlapBlock key={i} photos={[photos[i], photos[i + 1]]} startIndex={i} onOpen={onOpen} />);
      i += 2;
    } else {
      blocks.push(<FullBlock key={i} photo={photos[i]} index={i} onOpen={onOpen} />);
      i += 1;
    }
    patternIndex += 1;
  }

  return <div className="flex flex-col gap-2 md:gap-3">{blocks}</div>;
}

function Frame({
  photo,
  index,
  onOpen,
  className,
  sizes,
}: {
  photo: Photo;
  index: number;
  onOpen: (index: number) => void;
  className?: string;
  sizes: string;
}) {
  return (
    <button
      type="button"
      data-cursor="link"
      aria-label={`Open photograph: ${photo.alt}`}
      onClick={() => onOpen(index)}
      className={clsx("group relative block w-full overflow-hidden bg-paper", className)}
      style={{ aspectRatio: `${photo.width} / ${photo.height}` }}
    >
      <Image
        src={photo.src}
        alt={photo.alt}
        fill
        sizes={sizes}
        className="scale-[1.08] object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-100"
      />
    </button>
  );
}

function FullBlock({ photo, index, onOpen }: { photo: Photo; index: number; onOpen: (i: number) => void }) {
  return (
    <Reveal>
      <Frame photo={photo} index={index} onOpen={onOpen} sizes="100vw" />
    </Reveal>
  );
}

function PortraitBlock({ photo, index, onOpen }: { photo: Photo; index: number; onOpen: (i: number) => void }) {
  return (
    <Reveal className="mx-auto w-full md:w-2/3 lg:w-1/2">
      <Frame photo={photo} index={index} onOpen={onOpen} sizes="(min-width: 768px) 50vw, 100vw" />
    </Reveal>
  );
}

function TwoUpBlock({
  photos,
  startIndex,
  onOpen,
}: {
  photos: [Photo, Photo];
  startIndex: number;
  onOpen: (i: number) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-3">
      <Reveal>
        <Frame photo={photos[0]} index={startIndex} onOpen={onOpen} sizes="(min-width: 768px) 50vw, 100vw" />
      </Reveal>
      <Reveal delay={0.08}>
        <Frame photo={photos[1]} index={startIndex + 1} onOpen={onOpen} sizes="(min-width: 768px) 50vw, 100vw" className="md:mt-10" />
      </Reveal>
    </div>
  );
}

function OverlapBlock({
  photos,
  startIndex,
  onOpen,
}: {
  photos: [Photo, Photo];
  startIndex: number;
  onOpen: (i: number) => void;
}) {
  return (
    <Reveal className="relative mx-auto w-full max-w-4xl py-6 md:py-10">
      <Frame
        photo={photos[0]}
        index={startIndex}
        onOpen={onOpen}
        sizes="(min-width: 768px) 55vw, 90vw"
        className="w-4/5"
      />
      <div className="absolute -bottom-6 right-0 w-1/2 md:-bottom-10 md:w-2/5">
        <Frame photo={photos[1]} index={startIndex + 1} onOpen={onOpen} sizes="(min-width: 768px) 30vw, 60vw" />
      </div>
    </Reveal>
  );
}
