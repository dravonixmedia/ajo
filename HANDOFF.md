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

Photos are currently a manually-maintained content manifest at
`lib/content/photos.ts`, with files under `public/photos/**`. Adding a
photo today means editing that file and pushing to Git — there's no
upload UI for Ajo yet. If/when that's built (a Git-based CMS like Decap/
Tina, or a headless CMS like Sanity), this section should be updated with
the new workflow.
