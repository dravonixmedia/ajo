import Image from "next/image";
import Reveal from "@/components/ui/Reveal";
import SectionLabel from "@/components/ui/SectionLabel";
import { getAboutPortrait } from "@/lib/content/photoScanner";

export default function About() {
  const aboutPortrait = getAboutPortrait();

  return (
    <section id="about" className="relative bg-bg-alt py-24 md:py-32">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-14 px-6 md:flex-row md:gap-20">
        {aboutPortrait && (
          <Reveal className="w-full max-w-sm md:w-2/5">
            <div
              className="relative w-full grayscale"
              style={{ aspectRatio: `${aboutPortrait.width} / ${aboutPortrait.height}` }}
            >
              <Image
                src={aboutPortrait.src}
                alt={aboutPortrait.alt}
                fill
                sizes="(min-width: 768px) 40vw, 90vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        )}

        <div className="w-full md:w-3/5">
          <Reveal>
            <SectionLabel index="07" title="About Ajo" />
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="font-serif text-4xl leading-[1.1] text-ink md:text-6xl">
              The Person Behind the Camera
            </h2>
          </Reveal>
          <Reveal delay={0.18}>
            <div className="mt-8 flex flex-col gap-5 text-sm leading-relaxed text-ink-soft md:text-base">
              <p>
                Ajo Abraham is a professional photographer from Kerala with a passion for
                capturing real emotions, distinctive personalities and meaningful celebrations.
              </p>
              <p>
                His work moves between wedding storytelling, fashion, portraits, baby photography
                and creative collaborations. Rather than forcing moments, his approach is built
                around observation—allowing people, emotions and light to come together naturally.
              </p>
              <p>
                Every photograph is created to be more than visually beautiful. It should preserve
                a feeling that can be revisited for years to come.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
