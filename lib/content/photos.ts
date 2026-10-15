/**
 * Types + static (non-image) content for the photography site.
 *
 * Actual photo listings are NOT hardcoded here — they're read at build time
 * by lib/content/photoScanner.ts, which scans the folders under
 * /public/photos/**. To publish new photographs, drop files into the
 * matching folder (see the map below) and redeploy; no code change needed.
 * This file only holds category copy (title/description) and other static
 * text that isn't a filesystem listing.
 */

export interface Photo {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export type PortfolioCategorySlug = "weddings" | "couple" | "portraits" | "intimate";

export interface PortfolioCategory {
  slug: PortfolioCategorySlug;
  title: string;
  shortLabel: string;
  description: string;
  photos: Photo[];
}

/** Static copy per category, keyed by the /public/photos/<slug>/ folder name. */
export const CATEGORY_META: Record<
  PortfolioCategorySlug,
  { title: string; shortLabel: string; description: string }
> = {
  weddings: {
    title: "Weddings",
    shortLabel: "Weddings",
    description:
      "Full wedding stories from Kerala and beyond — the quiet preparations, the ceremony, and the celebrations that follow, documented as they naturally unfold.",
  },
  couple: {
    title: "Couple",
    shortLabel: "Couple",
    description: "Honest connection, quiet chemistry, and portraits that feel naturally yours.",
  },
  portraits: {
    title: "Portraits",
    shortLabel: "Portraits",
    description:
      "Personal and model portfolios shaped around real personality — honest expressions, natural light and a calm, observational approach.",
  },
  intimate: {
    title: "Intimate",
    shortLabel: "Intimate",
    description: "Close, personal stories shaped by emotion, stillness, and genuine connection.",
  },
};

export const ALL_CATEGORY_SLUGS = Object.keys(CATEGORY_META) as PortfolioCategorySlug[];

/** Lightweight, image-free category list — safe to import from client components. */
export const ALL_CATEGORIES: { slug: PortfolioCategorySlug; title: string }[] = ALL_CATEGORY_SLUGS.map(
  (slug) => ({ slug, title: CATEGORY_META[slug].title })
);

export const SIGNATURE_STORY_COPY = {
  heading: "Every Celebration Has Its Own Rhythm.",
  intro:
    "The quiet moments before the ceremony. The familiar faces. The nervous smiles. The celebrations that follow. Ajo's approach is to observe these moments naturally and transform them into a visual story that feels personal, timeless and real.",
};
