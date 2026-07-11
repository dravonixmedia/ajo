#!/usr/bin/env node
/**
 * Generates on-brand placeholder "photo plates" for local development and
 * initial deployment, entirely offline (no network access, no native image
 * libs — just a hand-rolled PNG encoder over Node's built-in zlib).
 *
 * These are intentionally abstract warm-toned gradient plates in the site's
 * palette, NOT fake stock photography — they exist so the full Next/Image
 * pipeline (responsive sizes, AVIF/WebP negotiation, blur-up, layout
 * stability) is exercised end to end while real photography is pending.
 * Swap the files under /public/photos/** with Ajo's originals; the CMS-ready
 * manifests in lib/content/*.ts already point at these paths.
 */
import { deflateSync } from "node:zlib";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..", "public", "photos");

// Brand palette
const PALETTE = {
  ivory: [244, 240, 232],
  paper: [232, 224, 212],
  charcoal: [23, 22, 20],
  brown: [90, 70, 56],
  gold: [180, 154, 108],
};

function hexMix(a, b, t) {
  return [
    Math.round(a[0] + (b[0] - a[0]) * t),
    Math.round(a[1] + (b[1] - a[1]) * t),
    Math.round(a[2] + (b[2] - a[2]) * t),
  ];
}

function clamp8(v) {
  return v < 0 ? 0 : v > 255 ? 255 : v | 0;
}

function paeth(a, b, c) {
  const p = a + b - c;
  const pa = Math.abs(p - a);
  const pb = Math.abs(p - b);
  const pc = Math.abs(p - c);
  if (pa <= pb && pa <= pc) return a;
  if (pb <= pc) return b;
  return c;
}

// Simple deterministic PRNG so re-runs are stable (no external seedrandom dep)
function mulberry32(seed) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function crc32(buf) {
  let c;
  const table = crc32.table || (crc32.table = (() => {
    const t = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
      c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      t[n] = c >>> 0;
    }
    return t;
  })());
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) crc = table[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, "ascii");
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function encodePNG(width, height, rgbBuffer) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // color type: RGB
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  // Apply the Paeth predictor filter per scanline (bpp=3): smooth gradients
  // become near-constant small deltas, which deflate then compresses well.
  // Using filter 0 (none) here would feed deflate raw, high-entropy pixel
  // data and produce PNGs an order of magnitude larger.
  const bpp = 3;
  const stride = width * bpp;
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y++) {
    const rowStart = y * stride;
    const outStart = y * (stride + 1);
    raw[outStart] = 4; // Paeth
    for (let i = 0; i < stride; i++) {
      const x = rgbBuffer[rowStart + i];
      const a = i >= bpp ? rgbBuffer[rowStart + i - bpp] : 0;
      const b = y > 0 ? rgbBuffer[rowStart - stride + i] : 0;
      const c = y > 0 && i >= bpp ? rgbBuffer[rowStart - stride + i - bpp] : 0;
      raw[outStart + 1 + i] = (x - paeth(a, b, c)) & 0xff;
    }
  }
  const idat = deflateSync(raw, { level: 9 });

  return Buffer.concat([
    sig,
    chunk("IHDR", ihdr),
    chunk("IDAT", idat),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

/**
 * Renders one plate: diagonal duotone gradient + soft off-center glow +
 * gentle vignette. Film grain is applied site-wide via a CSS overlay
 * instead of being baked into each plate (see .noise in globals.css).
 */
function renderPlate({ width, height, from, to, angle = 120, glow = 0.22, vignette = 0.38, seed = 1 }) {
  const buf = Buffer.alloc(width * height * 3);
  const rad = (angle * Math.PI) / 180;
  const dx = Math.cos(rad);
  const dy = Math.sin(rad);
  const rand = mulberry32(seed);

  // Glow origin, offset from center for an organic light source feel
  const glowX = width * (0.32 + rand() * 0.36);
  const glowY = height * (0.24 + rand() * 0.3);
  const glowRadius = Math.max(width, height) * 0.55;

  const cx = width / 2;
  const cy = height / 2;
  const maxDist = Math.sqrt(cx * cx + cy * cy);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const proj = ((x - cx) * dx + (y - cy) * dy) / (Math.abs(cx * dx) + Math.abs(cy * dy) + 1);
      const t = clampUnit(0.5 + proj * 0.5);
      let [r, g, b] = hexMix(from, to, t);

      const gd = Math.sqrt((x - glowX) ** 2 + (y - glowY) ** 2) / glowRadius;
      const glowAmt = Math.max(0, 1 - gd) * glow;
      r = r + (255 - r) * glowAmt;
      g = g + (250 - g) * glowAmt;
      b = b + (235 - b) * glowAmt;

      const vd = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2) / maxDist;
      const vAmt = Math.pow(vd, 1.6) * vignette;
      r = r * (1 - vAmt);
      g = g * (1 - vAmt);
      b = b * (1 - vAmt);

      const idx = (y * width + x) * 3;
      buf[idx] = clamp8(r);
      buf[idx + 1] = clamp8(g);
      buf[idx + 2] = clamp8(b);
    }
  }
  return buf;
}

function clampUnit(v) {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

function writePlate(relPath, opts) {
  const buf = renderPlate(opts);
  const png = encodePNG(opts.width, opts.height, buf);
  const full = join(ROOT, relPath);
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, png);
  process.stdout.write(`  ${relPath} (${opts.width}x${opts.height})\n`);
}

const { ivory, paper, charcoal, brown, gold } = PALETTE;

const LANDSCAPE = { w: 1600, h: 1067 };
const WIDE = { w: 1920, h: 1080 };
const PORTRAIT = { w: 1100, h: 1467 };
const TALL = { w: 1000, h: 1414 };
const SQUARE = { w: 1200, h: 1200 };

let seed = 100;
function nextSeed() {
  return seed++;
}

console.log("Generating placeholder photo plates (offline, on-brand gradients)...\n");

// Hero — three cinematic slides
writePlate("hero/hero-01.png", { ...WIDE, width: WIDE.w, height: WIDE.h, from: charcoal, to: brown, angle: 115, glow: 0.28, vignette: 0.42, seed: nextSeed() });
writePlate("hero/hero-02.png", { width: WIDE.w, height: WIDE.h, from: brown, to: charcoal, angle: 60, glow: 0.24, vignette: 0.4, seed: nextSeed() });
writePlate("hero/hero-03.png", { width: WIDE.w, height: WIDE.h, from: charcoal, to: gold, angle: 150, glow: 0.2, vignette: 0.45, seed: nextSeed() });

// Weddings
const weddingPairs = [
  [ivory, gold], [gold, paper], [charcoal, brown], [paper, ivory], [brown, gold],
  [ivory, brown], [gold, charcoal], [paper, brown], [ivory, paper], [brown, paper],
];
weddingPairs.forEach(([from, to], i) => {
  const portrait = i % 3 !== 0;
  const dims = portrait ? PORTRAIT : LANDSCAPE;
  writePlate(`weddings/wedding-${String(i + 1).padStart(2, "0")}.png`, {
    width: dims.w, height: dims.h, from, to, angle: 90 + i * 24, glow: 0.24, vignette: 0.4, seed: nextSeed(),
  });
});

// Fashion — higher contrast, more dramatic
const fashionPairs = [
  [charcoal, gold], [charcoal, brown], [brown, charcoal], [charcoal, paper],
  [gold, charcoal], [charcoal, ivory], [brown, gold], [charcoal, charcoal],
];
fashionPairs.forEach(([from, to], i) => {
  const portrait = i % 4 !== 3;
  const dims = portrait ? TALL : LANDSCAPE;
  writePlate(`fashion/fashion-${String(i + 1).padStart(2, "0")}.png`, {
    width: dims.w, height: dims.h, from, to, angle: 45 + i * 30, glow: 0.3, vignette: 0.48, seed: nextSeed(),
  });
});

// Portraits
const portraitPairs = [
  [brown, paper], [paper, brown], [gold, brown], [brown, ivory],
  [paper, gold], [brown, gold], [ivory, brown], [gold, paper],
];
portraitPairs.forEach(([from, to], i) => {
  const wide = i % 5 === 4;
  const dims = wide ? LANDSCAPE : PORTRAIT;
  writePlate(`portraits/portrait-${String(i + 1).padStart(2, "0")}.png`, {
    width: dims.w, height: dims.h, from, to, angle: 100 + i * 18, glow: 0.22, vignette: 0.36, seed: nextSeed(),
  });
});

// Baby & Family — soft pastel warmth
const babyPairs = [
  [paper, ivory], [ivory, gold], [paper, gold], [ivory, paper],
  [gold, ivory], [paper, brown], [ivory, ivory], [gold, paper],
];
babyPairs.forEach(([from, to], i) => {
  const portrait = i % 3 !== 2;
  const dims = portrait ? PORTRAIT : LANDSCAPE;
  writePlate(`baby-family/baby-family-${String(i + 1).padStart(2, "0")}.png`, {
    width: dims.w, height: dims.h, from, to, angle: 70 + i * 22, glow: 0.2, vignette: 0.3, seed: nextSeed(),
  });
});

// Signature story — six connected frames, continuous warm narrative arc
const storyPairs = [
  [ivory, gold], [gold, brown], [brown, charcoal], [charcoal, brown], [brown, gold], [gold, ivory],
];
storyPairs.forEach(([from, to], i) => {
  const portrait = i % 2 === 0;
  const dims = portrait ? PORTRAIT : LANDSCAPE;
  writePlate(`story/story-${String(i + 1).padStart(2, "0")}.png`, {
    width: dims.w, height: dims.h, from, to, angle: 90 + i * 15, glow: 0.26, vignette: 0.4, seed: nextSeed(),
  });
});

// About — black & white feel duotone portrait
writePlate("about/ajo-portrait.png", {
  width: TALL.w, height: TALL.h, from: charcoal, to: paper, angle: 100, glow: 0.16, vignette: 0.4, seed: nextSeed(),
});

// Testimonials — slow-moving wide cinematic backgrounds
[1, 2, 3].forEach((i) => {
  writePlate(`testimonials/testimonial-bg-${String(i).padStart(2, "0")}.png`, {
    width: WIDE.w, height: WIDE.h, from: charcoal, to: brown, angle: 60 + i * 40, glow: 0.18, vignette: 0.52, seed: nextSeed(),
  });
});

// Recent stories — instagram-style square grid
const recentPairs = [
  [ivory, gold], [charcoal, brown], [brown, paper], [gold, charcoal],
  [paper, ivory], [brown, gold], [charcoal, gold], [ivory, brown], [gold, paper],
];
recentPairs.forEach(([from, to], i) => {
  writePlate(`recent/recent-${String(i + 1).padStart(2, "0")}.png`, {
    width: SQUARE.w, height: SQUARE.h, from, to, angle: 45 + i * 20, glow: 0.22, vignette: 0.34, seed: nextSeed(),
  });
});

console.log("\nDone.");
