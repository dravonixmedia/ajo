import Link from "next/link";
import Logo from "./Logo";
import { CONTACT_EMAIL, INSTAGRAM_URL, whatsappLink } from "@/lib/siteConfig";

const PORTFOLIO_LINKS = [
  { label: "Weddings", href: "/portfolio/weddings" },
  { label: "Fashion", href: "/portfolio/fashion" },
  { label: "Portraits", href: "/portfolio/portraits" },
  { label: "Baby & Family", href: "/portfolio/baby-family" },
];

const SITE_LINKS = [
  { label: "About", href: "/#about" },
  { label: "Services", href: "/#services" },
  { label: "Journal", href: "/#recent-stories" },
  { label: "Contact", href: "/#contact" },
];

const CONNECT_LINKS = [
  { label: "Instagram", href: INSTAGRAM_URL, external: true },
  { label: "WhatsApp", href: whatsappLink(), external: true },
  { label: "Email", href: `mailto:${CONTACT_EMAIL}`, external: true },
];

export default function Footer() {
  return (
    <footer className="relative bg-charcoal px-6 pb-10 pt-24 text-ivory md:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center text-center">
          <Logo tone="light" withSubtitle />
          <p className="italic-statement mt-6 max-w-xl text-2xl text-ivory/85 md:text-3xl">
            &ldquo;Stories in Light. Memories for Life.&rdquo;
          </p>
        </div>

        <div className="mt-20 grid gap-10 border-t border-ivory/10 pt-12 sm:grid-cols-3">
          <FooterColumn heading="Portfolio" links={PORTFOLIO_LINKS} />
          <FooterColumn heading="Site" links={SITE_LINKS} />
          <FooterColumn heading="Connect" links={CONNECT_LINKS} />
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-ivory/10 pt-8 text-xs text-ivory/40 sm:flex-row">
          <span>Wedding &middot; Fashion &middot; Portrait &middot; Baby Photography</span>
          <span>&copy; {new Date().getFullYear()} Ajo Abraham. All rights reserved.</span>
        </div>
        <div className="mt-4 text-center text-[11px] tracking-[0.15em] text-ivory/30 sm:text-right">
          Website crafted by Dravonix Media
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  heading,
  links,
}: {
  heading: string;
  links: { label: string; href: string; external?: boolean }[];
}) {
  return (
    <div>
      <h4 className="section-label mb-4 text-gold">{heading}</h4>
      <ul className="flex flex-col gap-2">
        {links.map((item) =>
          item.external ? (
            <li key={item.label}>
              <a
                data-cursor="link"
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-ivory/55 transition-colors hover:text-ivory"
              >
                {item.label}
              </a>
            </li>
          ) : (
            <li key={item.label}>
              <Link data-cursor="link" href={item.href} className="text-sm text-ivory/55 transition-colors hover:text-ivory">
                {item.label}
              </Link>
            </li>
          )
        )}
      </ul>
    </div>
  );
}
