import type { Metadata, Viewport } from "next";
import "./globals.css";
import SiteChrome from "@/components/SiteChrome";
import { CONTACT_EMAIL, INSTAGRAM_URL, WHATSAPP_NUMBER } from "@/lib/siteConfig";

const title = "Ajo Abraham | Wedding, Fashion & Portrait Photographer in Kerala";
const description =
  "Ajo Abraham is a Kerala-based professional photographer specialising in wedding, engagement, fashion, portrait and baby & family photography — honest, cinematic storytelling for life's most meaningful moments.";
const siteUrl = "https://ajo.dravonix.dev";

export const metadata: Metadata = {
  title: {
    default: title,
    template: "%s | Ajo Abraham Photography",
  },
  description,
  metadataBase: new URL(siteUrl),
  keywords: [
    "Kerala wedding photographer",
    "Kerala photography",
    "wedding photographer Kochi",
    "fashion photographer Kerala",
    "portrait photographer Kerala",
    "baby and family photography Kerala",
    "pre-wedding photography Kerala",
    "Ajo Abraham photographer",
  ],
  authors: [{ name: "Ajo Abraham" }],
  openGraph: {
    title,
    description,
    siteName: "Ajo Abraham Photography",
    type: "website",
    locale: "en_IN",
    images: [{ url: "/photos/hero/hero-01.png", width: 1920, height: 1080 }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/photos/hero/hero-01.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#171614",
  width: "device-width",
  initialScale: 1,
};

const professionalServiceJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${siteUrl}/#business`,
  name: "Ajo Abraham Photography",
  description,
  url: siteUrl,
  email: CONTACT_EMAIL,
  telephone: `+${WHATSAPP_NUMBER}`,
  image: `${siteUrl}/photos/about/ajo-portrait.png`,
  sameAs: [INSTAGRAM_URL],
  areaServed: "Kerala, India",
  address: {
    "@type": "PostalAddress",
    addressRegion: "Kerala",
    addressCountry: "IN",
  },
  founder: {
    "@type": "Person",
    name: "Ajo Abraham",
    jobTitle: "Photographer",
  },
  serviceType: [
    "Wedding Photography",
    "Engagement and Pre-Wedding Photography",
    "Fashion Photography",
    "Personal and Model Portfolios",
    "Baby and Family Photography",
    "Editorial and Creative Collaborations",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full bg-bg text-ink antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(professionalServiceJsonLd) }}
        />
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
