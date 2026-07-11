#!/usr/bin/env node
/**
 * Scans /public/photos/** and writes a static JSON manifest that the app
 * reads at build time — see lib/content/photoScanner.ts.
 *
 * This runs as a plain Node script *before* `next build` (see the
 * "prebuild"/"predev" scripts in package.json), deliberately outside of
 * Next.js/Turbopack's own build pipeline. An earlier version did this
 * scanning directly inside a Next.js Server Component using fs at build
 * time, which worked locally but silently produced empty photo listings
 * on at least one real deployment (Turbopack's dependency tracer flagged
 * "the whole project was traced unintentionally" around the dynamic fs
 * calls, and the exact cause was never fully confirmed without direct
 * access to that build's logs). Doing the scan here, as a plain script
 * with an unambiguous working directory, removes that entire class of
 * uncertainty rather than patching around it.
 *
 * Folder → section map, ordering, "cover.*", and alt-text rules are the
 * same as documented in lib/content/photoScanner.ts.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { imageSize } from "image-size";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const PHOTOS_ROOT = path.join(ROOT, "public", "photos");
const OUTPUT_PATH = path.join(ROOT, "lib", "content", "photoManifest.generated.json");
const SUPPORTED_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);

// Keep in sync with CATEGORY_META in lib/content/photos.ts (only the
// title matters here, for the alt-text fallback).
const CATEGORY_TITLES = {
  weddings: "Weddings",
  fashion: "Fashion",
  portraits: "Portraits",
  "baby-family": "Baby & Family",
};
const CATEGORY_SLUGS = Object.keys(CATEGORY_TITLES);

function naturalCompare(a, b) {
  const chunk = (s) => s.match(/(\d+|\D+)/g) ?? [];
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

function listImageFiles(folder) {
  const dir = path.join(PHOTOS_ROOT, folder);
  let entries;
  try {
    entries = fs.readdirSync(dir);
  } catch {
    console.warn(`[generate-photo-manifest] No such folder: ${dir}`);
    return [];
  }
  const files = entries.filter((f) => SUPPORTED_EXTENSIONS.has(path.extname(f).toLowerCase()));
  if (files.length === 0) {
    console.warn(`[generate-photo-manifest] No supported image files in ${dir}`);
  }
  files.sort(naturalCompare);

  const coverIndex = files.findIndex((f) => path.parse(f).name.toLowerCase() === "cover");
  if (coverIndex > 0) {
    const [cover] = files.splice(coverIndex, 1);
    files.unshift(cover);
  }
  return files;
}

function humanizeFilename(filename) {
  const base = path.parse(filename).name;
  const words = base
    .replace(/^[a-z]*[-_]?\d+$/i, "")
    .replace(/[-_]+/g, " ")
    .trim();
  if (!words || /^\d+$/.test(words) || words.length < 3) return null;
  return words.charAt(0).toUpperCase() + words.slice(1).toLowerCase();
}

function buildAlt(filename, fallback) {
  const humanized = humanizeFilename(filename);
  return humanized ? `${humanized} — ${fallback}` : fallback;
}

function readDimensions(absPath) {
  try {
    const buffer = fs.readFileSync(absPath);
    const { width, height } = imageSize(buffer);
    if (width && height) return { width, height };
  } catch {
    // fall through to a safe default below
  }
  return { width: 1600, height: 1067 };
}

function loadPhoto(folder, filename, altFallback) {
  const absPath = path.join(PHOTOS_ROOT, folder, filename);
  const { width, height } = readDimensions(absPath);
  return {
    src: `/photos/${folder}/${filename}`,
    alt: buildAlt(filename, altFallback),
    width,
    height,
  };
}

function loadFolder(folder, altFallback) {
  return listImageFiles(folder).map((f) => loadPhoto(folder, f, altFallback));
}

console.log(`[generate-photo-manifest] Scanning ${PHOTOS_ROOT} ...`);

const manifest = {
  hero: loadFolder("hero", "Photography by Ajo Abraham, Kerala"),
  categories: Object.fromEntries(
    CATEGORY_SLUGS.map((slug) => [
      slug,
      loadFolder(slug, `${CATEGORY_TITLES[slug]} photography by Ajo Abraham, Kerala`),
    ])
  ),
  story: loadFolder("story", "Wedding story photography by Ajo Abraham"),
  about: loadFolder("about", "Portrait of Kerala photographer Ajo Abraham")[0] ?? null,
  testimonials: loadFolder("testimonials", "Photography by Ajo Abraham, Kerala"),
  recent: loadFolder("recent", "Recent photography story by Ajo Abraham").slice(0, 9),
};

fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
fs.writeFileSync(OUTPUT_PATH, JSON.stringify(manifest, null, 2) + "\n");

const counts = {
  hero: manifest.hero.length,
  ...Object.fromEntries(CATEGORY_SLUGS.map((s) => [s, manifest.categories[s].length])),
  story: manifest.story.length,
  about: manifest.about ? 1 : 0,
  testimonials: manifest.testimonials.length,
  recent: manifest.recent.length,
};
console.log(`[generate-photo-manifest] Wrote ${OUTPUT_PATH}`);
console.log(`[generate-photo-manifest] Counts: ${JSON.stringify(counts)}`);
