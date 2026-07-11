/**
 * CMS-ready photography manifest. Every image below is a placeholder plate
 * (see /scripts/generate-placeholders.mjs) standing in for Ajo Abraham's
 * original photography. To go live, replace the `src` (and, if needed,
 * `width`/`height`/orientation) of each entry with the real exported photo —
 * the rest of the site (grids, lightbox, srcset, blur-up) reads from this
 * file and needs no other changes.
 */

export interface Photo {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export type PortfolioCategorySlug = "weddings" | "fashion" | "portraits" | "baby-family";

export interface PortfolioCategory {
  slug: PortfolioCategorySlug;
  title: string;
  shortLabel: string;
  description: string;
  coverIndex: number;
  photos: Photo[];
}

export const heroSlides: Photo[] = [
  {
    src: "/photos/hero/hero-01.png",
    alt: "Bride and groom sharing a quiet moment at golden hour, Kerala wedding photography by Ajo Abraham",
    width: 1920,
    height: 1080,
  },
  {
    src: "/photos/hero/hero-02.png",
    alt: "Candid portrait session with soft natural light, photographed by Ajo Abraham",
    width: 1920,
    height: 1080,
  },
  {
    src: "/photos/hero/hero-03.png",
    alt: "Editorial fashion photograph with dramatic warm lighting, Ajo Abraham photography",
    width: 1920,
    height: 1080,
  },
];

export const portfolioCategories: PortfolioCategory[] = [
  {
    slug: "weddings",
    title: "Weddings",
    shortLabel: "Weddings",
    description:
      "Full wedding stories from Kerala and beyond — the quiet preparations, the ceremony, and the celebrations that follow, documented as they naturally unfold.",
    coverIndex: 0,
    photos: [
      { src: "/photos/weddings/wedding-01.png", alt: "Kerala wedding ceremony captured in natural light by photographer Ajo Abraham", width: 1600, height: 1067 },
      { src: "/photos/weddings/wedding-02.png", alt: "Bride getting ready before her wedding, candid portrait by Ajo Abraham", width: 1100, height: 1467 },
      { src: "/photos/weddings/wedding-03.png", alt: "Groom and family sharing a joyful moment before the wedding ceremony", width: 1100, height: 1467 },
      { src: "/photos/weddings/wedding-04.png", alt: "Wide shot of a traditional Kerala wedding celebration", width: 1600, height: 1067 },
      { src: "/photos/weddings/wedding-05.png", alt: "Close-up portrait of the bride in her wedding attire", width: 1100, height: 1467 },
      { src: "/photos/weddings/wedding-06.png", alt: "Emotional moment between bride and father during the wedding ceremony", width: 1100, height: 1467 },
      { src: "/photos/weddings/wedding-07.png", alt: "Wedding reception celebration with guests dancing", width: 1600, height: 1067 },
      { src: "/photos/weddings/wedding-08.png", alt: "Bride and groom portrait session after the ceremony", width: 1100, height: 1467 },
      { src: "/photos/weddings/wedding-09.png", alt: "Detail shot of wedding rings and floral arrangements", width: 1100, height: 1467 },
      { src: "/photos/weddings/wedding-10.png", alt: "Couple walking together during golden hour at their wedding", width: 1600, height: 1067 },
    ],
  },
  {
    slug: "fashion",
    title: "Fashion",
    shortLabel: "Fashion",
    description:
      "Editorial and fashion collaborations built around mood, light and character — created with stylists, designers and models across Kerala.",
    coverIndex: 0,
    photos: [
      { src: "/photos/fashion/fashion-01.png", alt: "Editorial fashion portrait with dramatic studio lighting", width: 1000, height: 1414 },
      { src: "/photos/fashion/fashion-02.png", alt: "Fashion model portrait shot for an editorial collaboration", width: 1000, height: 1414 },
      { src: "/photos/fashion/fashion-03.png", alt: "High-contrast fashion photography with warm tones", width: 1000, height: 1414 },
      { src: "/photos/fashion/fashion-04.png", alt: "Wide fashion editorial composition with negative space", width: 1600, height: 1067 },
      { src: "/photos/fashion/fashion-05.png", alt: "Fashion portfolio image with directional lighting", width: 1000, height: 1414 },
      { src: "/photos/fashion/fashion-06.png", alt: "Creative fashion collaboration portrait", width: 1000, height: 1414 },
      { src: "/photos/fashion/fashion-07.png", alt: "Model portfolio shoot with cinematic tones", width: 1000, height: 1414 },
      { src: "/photos/fashion/fashion-08.png", alt: "Fashion editorial wide shot with moody atmosphere", width: 1600, height: 1067 },
    ],
  },
  {
    slug: "portraits",
    title: "Portraits",
    shortLabel: "Portraits",
    description:
      "Personal and model portfolios shaped around real personality — honest expressions, natural light and a calm, observational approach.",
    coverIndex: 0,
    photos: [
      { src: "/photos/portraits/portrait-01.png", alt: "Natural light portrait session by Ajo Abraham", width: 1100, height: 1467 },
      { src: "/photos/portraits/portrait-02.png", alt: "Personal portfolio portrait with soft warm tones", width: 1100, height: 1467 },
      { src: "/photos/portraits/portrait-03.png", alt: "Close-up portrait with honest, natural expression", width: 1100, height: 1467 },
      { src: "/photos/portraits/portrait-04.png", alt: "Model portfolio portrait shot outdoors", width: 1100, height: 1467 },
      { src: "/photos/portraits/portrait-05.png", alt: "Environmental portrait with wide composition", width: 1600, height: 1067 },
      { src: "/photos/portraits/portrait-06.png", alt: "Studio portrait session with directional light", width: 1100, height: 1467 },
      { src: "/photos/portraits/portrait-07.png", alt: "Candid personal portrait captured in natural settings", width: 1100, height: 1467 },
      { src: "/photos/portraits/portrait-08.png", alt: "Portfolio portrait with cinematic warm grading", width: 1100, height: 1467 },
    ],
  },
  {
    slug: "baby-family",
    title: "Baby & Family",
    shortLabel: "Baby & Family",
    description:
      "Gentle, unposed family and baby photography that captures real warmth — the small everyday moments that families return to for years.",
    coverIndex: 0,
    photos: [
      { src: "/photos/baby-family/baby-family-01.png", alt: "Candid family portrait with soft natural light", width: 1100, height: 1467 },
      { src: "/photos/baby-family/baby-family-02.png", alt: "Baby portrait session captured gently and naturally", width: 1100, height: 1467 },
      { src: "/photos/baby-family/baby-family-03.png", alt: "Family gathered together for a lifestyle photography session", width: 1600, height: 1067 },
      { src: "/photos/baby-family/baby-family-04.png", alt: "Parent and child sharing a tender moment", width: 1100, height: 1467 },
      { src: "/photos/baby-family/baby-family-05.png", alt: "Newborn baby portrait with warm, soft tones", width: 1100, height: 1467 },
      { src: "/photos/baby-family/baby-family-06.png", alt: "Family celebration captured candidly at home", width: 1600, height: 1067 },
      { src: "/photos/baby-family/baby-family-07.png", alt: "Sibling portrait session with natural expressions", width: 1100, height: 1467 },
      { src: "/photos/baby-family/baby-family-08.png", alt: "Family portrait session in warm afternoon light", width: 1100, height: 1467 },
    ],
  },
];

export function getCategory(slug: string): PortfolioCategory | undefined {
  return portfolioCategories.find((c) => c.slug === slug);
}

export const signatureStory: {
  heading: string;
  intro: string;
  photos: Photo[];
} = {
  heading: "Every Celebration Has Its Own Rhythm.",
  intro:
    "The quiet moments before the ceremony. The familiar faces. The nervous smiles. The celebrations that follow. Ajo's approach is to observe these moments naturally and transform them into a visual story that feels personal, timeless and real.",
  photos: [
    { src: "/photos/story/story-01.png", alt: "Bride's hands being adorned before the wedding ceremony", width: 1100, height: 1467 },
    { src: "/photos/story/story-02.png", alt: "Family members gathering before the ceremony begins", width: 1600, height: 1067 },
    { src: "/photos/story/story-03.png", alt: "A nervous, genuine smile shared moments before the vows", width: 1100, height: 1467 },
    { src: "/photos/story/story-04.png", alt: "The ceremony itself, captured from a respectful distance", width: 1600, height: 1067 },
    { src: "/photos/story/story-05.png", alt: "A quiet embrace between the newlyweds", width: 1100, height: 1467 },
    { src: "/photos/story/story-06.png", alt: "The celebration following the ceremony, full of movement and joy", width: 1600, height: 1067 },
  ],
};

export const aboutPortrait: Photo = {
  src: "/photos/about/ajo-portrait.png",
  alt: "Black and white portrait of Kerala photographer Ajo Abraham",
  width: 1000,
  height: 1414,
};

export const testimonialBackgrounds: Photo[] = [
  { src: "/photos/testimonials/testimonial-bg-01.png", alt: "Soft cinematic wedding background photograph", width: 1920, height: 1080 },
  { src: "/photos/testimonials/testimonial-bg-02.png", alt: "Warm-toned photography background from a Kerala celebration", width: 1920, height: 1080 },
  { src: "/photos/testimonials/testimonial-bg-03.png", alt: "Moody cinematic background photograph", width: 1920, height: 1080 },
];

export const recentStories: Photo[] = Array.from({ length: 9 }, (_, i) => ({
  src: `/photos/recent/recent-${String(i + 1).padStart(2, "0")}.png`,
  alt: `Recent photography story ${i + 1} by Ajo Abraham, shared on Instagram`,
  width: 1200,
  height: 1200,
}));
