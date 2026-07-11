# Handoff Checklist — Moving to Ajo's Own GitHub + Cloudflare

This site is currently deployed under Dravonix Media's Cloudflare account,
connected to this repo via Cloudflare Workers Builds (Git integration), and
live at `https://ajo.dravonix.dev`.

If ownership moves to Ajo (his own GitHub account and his own Cloudflare
account, possibly his own domain), follow this checklist in order.

## 1. Transfer the GitHub repo

On GitHub: this repo's **Settings → General → Danger Zone → Transfer
ownership** → enter Ajo's GitHub username. He needs a GitHub account first.

## 2. Decide the domain

- **Option A — keep using a `dravonix.dev` subdomain.** Simplest, but DNS/
  custom-domain routing for that subdomain must stay configured on Dravonix
  Media's Cloudflare account, since only the zone owner can attach routes to
  it. Not a fully independent setup.
- **Option B — Ajo uses his own domain** (e.g. `ajoabraham.com`). Requires
  adding that domain as a zone in his own Cloudflare account (pointing its
  nameservers at Cloudflare). This is the option for full independence.

## 3. Set up the Cloudflare Worker under Ajo's account

In Ajo's Cloudflare dashboard: **Workers & Pages → Create → connect a Git
repository** → select this repo (now under his GitHub account — he
authorizes the Cloudflare GitHub App himself, no leftover permissions to
untangle).

Set:
- **Build command:** `npm run cf-build`
- **Deploy command:** `npx wrangler deploy`

(These are already correct in `package.json` — this is just re-configuring
the Cloudflare project's build settings, which don't carry over
automatically.)

## 4. Update the domain-specific values in code

Once the real domain (from step 2) is known, update these — this is the
**only** code that needs to change; no component/design/business logic is
affected:

- **`wrangler.jsonc`**
  - `name` — the Worker's name (currently `"ajo"`)
  - `services[0].service` — must match `name`
  - `routes[0].pattern` — currently `"ajo.dravonix.dev"`, change to the real
    domain
- **`package.json`**
  - `name` field (cosmetic, keep consistent with the Worker name)
- **`app/layout.tsx`, `app/sitemap.ts`, `app/robots.ts`**
  - The `siteUrl` constant (currently `"https://ajo.dravonix.dev"`) — drives
    canonical URLs, Open Graph/Twitter preview images, and the sitemap.
    Update every occurrence to the real domain.
- **`lib/siteConfig.ts`**
  - `CONTACT_EMAIL` — only if the business email is changing too

## 5. Attach the custom domain + verify

Add the custom domain in the new Cloudflare project once the zone (step 2)
is active. Push a commit (or trigger a manual deploy) and confirm the site
loads, `/sitemap.xml` and `/robots.txt` resolve, and images render (see the
`images.unoptimized` note in `next.config.ts` if photos ever break again —
same root cause as before: the Images binding needs Cloudflare Images
provisioned, which this site currently avoids relying on).

## 6. Decommission the old deployment

Once the new one is confirmed working: delete the `ajo` Worker from
Dravonix Media's Cloudflare account and remove the `ajo.dravonix.dev` DNS
record.

## 7. Ongoing content updates

Photos are auto-scanned from `public/photos/**` at build time (see
`lib/content/photoScanner.ts`) — no code change needed to add, remove, or
reorder photographs. To publish new photos:

1. Drop image files (`.jpg`, `.jpeg`, `.png`, `.webp`, or `.avif`) into the
   right folder:
   - `public/photos/weddings/`, `fashion/`, `portraits/`, `baby-family/` —
     the four portfolio galleries
   - `public/photos/hero/` — home hero (cycles through everything there)
   - `public/photos/story/` — Signature Story sequence
   - `public/photos/about/` — About section portrait (first file wins)
   - `public/photos/testimonials/` — Testimonials background photos
   - `public/photos/recent/` — Journal/Recent Stories grid (shows up to 9)
2. Commit and push (or upload directly via GitHub's web UI, same way
   `hero.jpg` was added) — the next deploy picks the new files up
   automatically.

Ordering follows natural filename sort (`wedding-2.jpg` before
`wedding-10.jpg`, regardless of zero-padding). A file named `cover.*` in a
folder is always moved to the front, so Ajo can choose a category's/hero's
lead photo without renaming anything else.

Alt text is generated from the filename — `bride-getting-ready.jpg` becomes
"Bride getting ready — Weddings photography by Ajo Abraham, Kerala". Purely
numeric or generic filenames fall back to a generic category description.
For meaningful SEO alt text, name files descriptively.

This covers "upload and it appears" without any CMS. It does **not** give
Ajo control over alt text wording, category descriptions, or curation
beyond file naming/the cover convention — if that level of control matters,
the CMS options (Decap/Tina or Sanity) discussed earlier are still the
next step up.
