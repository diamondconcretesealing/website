# Diamond Concrete Sealing — Website

Marketing site for **Diamond Concrete Sealing** (Okotoks, Alberta). Single-page Next.js
site: hero, about, services, benefits, process, projects, reviews, FAQ, contact.

Built with **Next.js 16 (App Router) + TypeScript + Tailwind CSS v4**. Deploys to Vercel.
Design identity: **slate + warm amber** (a deliberate redesign, not a clone of the
reference site it was inspired by).

## Run locally

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

## Editing content

**All copy and business data lives in [`lib/content.ts`](lib/content.ts).** Edit that one
file to update services, hours, reviews, FAQs, service areas, and contact details — the
components read from it.

## TODO before launch

Search the codebase for `TODO` — the key ones:

1. **Phone number** (`lib/content.ts` → `business.phoneDisplay` / `phoneHref`). The number
   from Google was ambiguous (mixed with competitor listings). Set the verified number and
   matching `tel:` href. Currently a placeholder `(587) 000-0000`.
2. **Email** (`lib/content.ts` → `business.email` / `emailHref`).
3. **Service area list** (`lib/content.ts` → `business.areas`) — confirm exact communities.
4. **Hero video** — DONE: AI-generated (Seedance 2.0) sealed-concrete clip at `public/hero.mp4`
   (831 KB, muted, looping; poster at `public/images/hero-poster.jpg`). Swap for real on-site
   footage later if desired — same path, keep it muted/looping and compressed.
5. **Photos** — DONE: real photos pulled from the Google Business Profile live in
   `public/images/gbp/`. Swap/add higher-res originals from the owner when available.
   (Note: a mis-attributed competitor photo — "Concrete Experts" — was excluded.)
6. **Real reviews** (`lib/content.ts` → `reviews`) — two entries are illustrative placeholders;
   the first is adapted from the Google profile.
7. **Quote-form delivery** (`app/api/contact/route.ts`) — currently logs submissions. Wire an
   email provider (e.g. Resend) or webhook/CRM to actually deliver leads.

## Placeholders

`scripts/gen-placeholders.mjs` regenerates the placeholder SVGs if needed
(`node scripts/gen-placeholders.mjs`). Delete it once real assets are in.

## Reference

`reference/` holds screenshots used during the build (design inspiration + build snapshots).
Not shipped.
