"use client";

import { useState } from "react";
import Reveal from "@/components/ui/Reveal";
import SectionLabel from "@/components/ui/SectionLabel";
import MagneticButton from "@/components/ui/MagneticButton";
import { CONTACT_EMAIL, whatsappLink } from "@/lib/siteConfig";

const REQUIREMENTS = [
  "Wedding Photography",
  "Engagement / Pre-Wedding",
  "Fashion Photography",
  "Personal / Model Portfolio",
  "Baby & Family Photography",
  "Editorial / Creative Collaboration",
];

export default function Contact() {
  const [fields, setFields] = useState({
    name: "",
    phone: "",
    email: "",
    requirement: REQUIREMENTS[0],
    eventDate: "",
    location: "",
    message: "",
  });

  function update<K extends keyof typeof fields>(key: K, value: string) {
    setFields((f) => ({ ...f, [key]: value }));
  }

  function buildMailto() {
    const subject = `Photography Enquiry — ${fields.requirement}`;
    const body = [
      `Name: ${fields.name}`,
      `Phone: ${fields.phone}`,
      `Email: ${fields.email}`,
      `Photography Requirement: ${fields.requirement}`,
      `Event Date: ${fields.eventDate || "—"}`,
      `Location: ${fields.location || "—"}`,
      "",
      fields.message,
    ].join("\n");
    return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    window.location.href = buildMailto();
  }

  return (
    <section id="contact" className="relative bg-bg-alt px-6 py-28 md:py-36">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <SectionLabel index="12" title="Contact" />
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="font-serif max-w-xl text-4xl leading-[1.1] text-ink md:text-6xl">
            Let&rsquo;s Create Something Timeless.
          </h2>
        </Reveal>
        <Reveal delay={0.15}>
          <p className="mt-5 max-w-xl text-sm text-ink-soft md:text-base">
            Tell us about your wedding, celebration, portrait session or creative project.
          </p>
        </Reveal>

        <Reveal delay={0.2}>
          <form onSubmit={onSubmit} className="mt-12 flex flex-col gap-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <Field label="Name" value={fields.name} onChange={(v) => update("name", v)} type="text" required />
              <Field label="Phone Number" value={fields.phone} onChange={(v) => update("phone", v)} type="tel" required />
            </div>
            <Field label="Email Address" value={fields.email} onChange={(v) => update("email", v)} type="email" required />

            <div>
              <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-ink-faint">
                Photography Requirement
              </label>
              <select
                value={fields.requirement}
                onChange={(e) => update("requirement", e.target.value)}
                className="w-full border-b border-ink/20 bg-transparent py-3 text-sm text-ink outline-none transition-colors focus:border-ink"
              >
                {REQUIREMENTS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <Field label="Event Date" value={fields.eventDate} onChange={(v) => update("eventDate", v)} type="date" />
              <Field label="Location" value={fields.location} onChange={(v) => update("location", v)} type="text" />
            </div>

            <div>
              <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-ink-faint">Message</label>
              <textarea
                value={fields.message}
                onChange={(e) => update("message", e.target.value)}
                rows={4}
                placeholder="Tell us about the occasion..."
                className="w-full border-b border-ink/20 bg-transparent py-3 text-sm text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-ink"
              />
            </div>

            <div className="mt-4 flex flex-col gap-4 sm:flex-row">
              <MagneticButton type="submit" variant="solid">
                Send an Enquiry
              </MagneticButton>
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
                <MagneticButton type="button" variant="outline" className="w-full sm:w-auto">
                  Connect on WhatsApp
                </MagneticButton>
              </a>
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  type,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-ink-faint">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        type={type}
        required={required}
        className="w-full border-b border-ink/20 bg-transparent py-3 text-sm text-ink outline-none transition-colors focus:border-ink"
      />
    </div>
  );
}
