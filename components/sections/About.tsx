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
              My Story Behind the Lens
            </h2>
          </Reveal>
          <Reveal delay={0.18}>
            <div className="mt-8 flex flex-col gap-5 text-sm leading-relaxed text-ink-soft md:text-base">
              <p>
                I&rsquo;m Ajo Abraham, a photographer from Kerala with over 7 years of experience
                capturing stories, emotions and moments that deserve to be remembered.
              </p>
              <p>
                For me, photography has never been about simply freezing what happened. It is
                about preserving how it felt — a quiet glance, an unspoken connection, a smile
                that lasted only a second, a touch, a pause, a moment that may never happen the
                same way again.
              </p>
              <p>
                I don&rsquo;t believe the best photographs are created by forcing moments. I
                prefer to observe, wait and let people be themselves. That is where the most
                honest frames come from — the ones that feel natural, personal and real.
              </p>
              <p>
                From weddings and couple stories to portraits and intimate sessions, every story
                brings something different. My role is to hold on to those emotions and turn them
                into photographs that become more valuable with time.
              </p>
              <p>
                Years from now, I want you to look at these photographs and not just remember the
                moment — I want you to feel it again.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
