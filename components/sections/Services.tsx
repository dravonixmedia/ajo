import Reveal from "@/components/ui/Reveal";
import SectionLabel from "@/components/ui/SectionLabel";
import MagneticButton from "@/components/ui/MagneticButton";
import { services } from "@/lib/content/services";
import { whatsappLink } from "@/lib/siteConfig";

export default function Services() {
  return (
    <section id="services" className="relative bg-bg py-28 md:py-36">
      <div className="mx-auto max-w-4xl px-6">
        <Reveal>
          <SectionLabel index="08" title="Services" />
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="font-serif max-w-xl text-4xl leading-[1.1] text-ink md:text-6xl">
            Photography, Tailored to the Occasion
          </h2>
        </Reveal>

        <ul className="mt-16 flex flex-col divide-y divide-ink/10 border-t border-ink/10">
          {services.map((service, i) => (
            <Reveal key={service.title} delay={0.04 * i}>
              <li className="group flex flex-col gap-2 py-7 md:flex-row md:items-baseline md:justify-between md:gap-8 md:py-8">
                <h3 className="font-serif text-2xl text-ink transition-colors group-hover:text-brown md:text-3xl">
                  {service.title}
                </h3>
                <p className="max-w-md text-sm text-ink-soft md:text-right">{service.description}</p>
              </li>
            </Reveal>
          ))}
        </ul>

        <Reveal delay={0.2}>
          <div className="mt-16 flex justify-center">
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
              <MagneticButton variant="outline">Request Availability &amp; Packages</MagneticButton>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
