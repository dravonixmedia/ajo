import "server-only";
import fs from "node:fs";
import path from "node:path";
import { imageSize } from "image-size";
import {
  CATEGORY_META,
  SIGNATURE_STORY_COPY,
  type Photo,
  type PortfolioCategory,
  type PortfolioCategorySlug,
} from "./photos";

/**
 * Reads photo listings directly from /public/photos/** at build time, so
 * publishing a new photograph is just "add the file to the right folder and
 * redeploy" — no code change required.
 *
 * Folder → section map:
 *   public/photos/hero/            home hero (cycles through all files)
 *   public/photos/weddings/        Weddings gallery
 *   public/photos/fashion/         Fashion gallery
 *   public/photos/portraits/       Portraits gallery
 *   public/photos/baby-family/     Baby & Family gallery
 *   public/photos/story/           Signature Story sequence
 *   public/photos/about/           About section portrait (first file wins)
 *   public/photos/testimonials/    Testimonials background photos
 *   public/photos/recent/          Recent Stories / Journal grid (max 9 shown)
 *
 * Ordering: files sort naturally (wedding-2.jpg before wedding-10.jpg,
 * unlike plain alphabetical sort). A file named "cover" (any extension,
 * case-insensitive) is always moved to the front — use that to pick which
 * photo leads a category without renaming everything else.
 *
 * Alt text: derived from the filename. "bride-getting-ready.jpg" becomes
 * "Bride getting ready — wedding photography by Ajo Abraham, Kerala". Purely
 * numeric/generic filenames fall back to a generic category description.
 * For real control over alt text, rename the file to something descriptive.
 */

const PHOTOS_ROOT = path.join(process.cwd(), "public", "photos");
const SUPPORTED_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);

function naturalCompare(a: string, b: string): number {
  const chunk = (s: string) => s.match(/(\d+|\D+)/g) ?? [];
  const aParts = chunk(a);
  const bParts = chunk(b);
  const len = Math.max(aParts.length, bParts.length);
  for (let i = 0; i < len; i++) {
    const ap = aParts[i] ?? "";
    const bp = bParts[i] ?? "";
    const aNum = /^\d+$/.test(ap);
    const bNum = /^\d+$/.test(bp);
    if (aNum && bNum) {
      const diff = Number(ap) - Number(bp);
      if (diff !== 0) return diff;
    } else if (ap !== bp) {
      return ap < bp ? -1 : 1;
    }
  }
  return 0;
}

function listImageFiles(folder: string): string[] {
  const dir = path.join(PHOTOS_ROOT, folder);
  let entries: string[];
  try {
    entries = fs.readdirSync(dir);
  } catch {
    return [];
  }
  const files = entries.filter((f) => SUPPORTED_EXTENSIONS.has(path.extname(f).toLowerCase()));
  files.sort(naturalCompare);

  // A file literally named "cover.*" always leads, so Ajo can pick a cover
  // photo without renaming the rest of the folder.
  const coverIndex = files.findIndex((f) => path.parse(f).name.toLowerCase() === "cover");
  if (coverIndex > 0) {
    const [cover] = files.splice(coverIndex, 1);
    files.unshift(cover);
  }
  return files;
}

function humanizeFilename(filename: string): string | null {
  const base = path.parse(filename).name;
  // Strip a leading category/number prefix like "wedding-01" or "img_2043".
  const words = base
    .replace(/^[a-z]*[-_]?\d+$/i, "")
    .replace(/[-_]+/g, " ")
    .trim();
  if (!words || /^\d+$/.test(words) || words.length < 3) return null;
  return words.charAt(0).toUpperCase() + words.slice(1).toLowerCase();
}

function buildAlt(filename: string, fallback: string): string {
  const humanized = humanizeFilename(filename);
  return humanized ? `${humanized} — ${fallback}` : fallback;
}

function readDimensions(absPath: string): { width: number; height: number } {
  try {
    const buffer = fs.readFileSync(absPath);
    const { width, height } = imageSize(buffer);
    if (width && height) return { width, height };
  } catch {
    // fall through to a safe default below
  }
  return { width: 1600, height: 1067 };
}

function loadPhoto(folder: string, filename: string, altFallback: string): Photo {
  const absPath = path.join(PHOTOS_ROOT, folder, filename);
  const { width, height } = readDimensions(absPath);
  return {
    src: `/photos/${folder}/${filename}`,
    alt: buildAlt(filename, altFallback),
    width,
    height,
  };
}

export function getCategory(slug: string): PortfolioCategory | undefined {
  const meta = CATEGORY_META[slug as PortfolioCategorySlug];
  if (!meta) return undefined;
  const files = listImageFiles(slug);
  const fallbackAlt = `${meta.title} photography by Ajo Abraham, Kerala`;
  return {
    slug: slug as PortfolioCategorySlug,
    ...meta,
    photos: files.map((f) => loadPhoto(slug, f, fallbackAlt)),
  };
}

export function getPortfolioCategories(): PortfolioCategory[] {
  return (Object.keys(CATEGORY_META) as PortfolioCategorySlug[]).map(
    (slug) => getCategory(slug) as PortfolioCategory
  );
}

export function getHeroSlides(): Photo[] {
  const files = listImageFiles("hero");
  return files.map((f) => loadPhoto("hero", f, "Photography by Ajo Abraham, Kerala"));
}

export function getSignatureStory(): { heading: string; intro: string; photos: Photo[] } {
  const files = listImageFiles("story");
  return {
    ...SIGNATURE_STORY_COPY,
    photos: files.map((f) => loadPhoto("story", f, "Wedding story photography by Ajo Abraham")),
  };
}

export function getAboutPortrait(): Photo | null {
  const [first] = listImageFiles("about");
  if (!first) return null;
  return loadPhoto("about", first, "Portrait of Kerala photographer Ajo Abraham");
}

export function getTestimonialBackgrounds(): Photo[] {
  const files = listImageFiles("testimonials");
  return files.map((f) => loadPhoto("testimonials", f, "Photography by Ajo Abraham, Kerala"));
}

const RECENT_STORIES_MAX = 9;

export function getRecentStories(): Photo[] {
  const files = listImageFiles("recent").slice(0, RECENT_STORIES_MAX);
  return files.map((f) => loadPhoto("recent", f, "Recent photography story by Ajo Abraham"));
}
