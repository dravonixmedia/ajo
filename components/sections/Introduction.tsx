import Reveal from "@/components/ui/Reveal";

export default function Introduction() {
  return (
    <section className="relative bg-bg px-6 py-28 md:py-36">
      <div className="mx-auto max-w-3xl text-center">
        <Reveal>
          <p className="italic-statement text-3xl leading-snug text-ink sm:text-4xl md:text-5xl">
            &ldquo;Photography is not simply about preserving how a moment looked. It is about
            remembering how that moment felt.&rdquo;
          </p>
        </Reveal>
        <Reveal delay={0.15}>
          <p className="mx-auto mt-10 max-w-xl text-sm leading-relaxed text-ink-soft md:text-base">
            Ajo Abraham is a Kerala-based professional photographer capturing weddings,
            celebrations, fashion, portraits and life&apos;s most meaningful stories through an
            honest and cinematic visual approach.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
