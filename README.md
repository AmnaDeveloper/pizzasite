# Slice & Save — independent pizza menu, price & coupon guide

A production-ready, AdSense-ready informational website built with Next.js (App
Router), React, TypeScript and Tailwind CSS.

The site is an **independent, unofficial guide** to Domino's menu prices,
coupons, rewards, hours and delivery. It is not affiliated with Domino's, uses
no brand logos or copyrighted assets, and labels every price as an example. All
text and artwork in this repository is original.

---

## Quick start

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build — must pass with no errors
npm run start      # serve the production build locally
npm run lint       # eslint
```

Requires Node 18.18+ (developed on Node 22).

---

## 1. Set your domain and site identity

Everything lives in **`src/lib/site-config.ts`** — it is the single source of
truth. Nothing else in the codebase hardcodes a URL, a name, a colour or a
third-party ID.

Before you deploy, change at minimum:

| Constant | What it does |
| --- | --- |
| `SITE_URL` | Canonical URLs, `sitemap.xml`, OpenGraph tags, JSON-LD. **No trailing slash.** |
| `SITE_NAME` / `SITE_TAGLINE` | Header, footer, titles, structured data |
| `CONTACT_EMAIL` / `EDITORIAL_EMAIL` | Contact page, footer, legal pages |
| `SOCIAL_LINKS` / `TWITTER_HANDLE` | Footer links and `sameAs` in Organization schema |
| `ORGANIZATION` | Publisher name and location used in legal pages and schema |
| `BRAND` | The brand the guide writes *about* |
| `COLORS` | Palette (mirror any change in the `@theme` block of `src/app/globals.css`) |

`SITE_URL` currently points at a placeholder (`https://www.sliceandsave.com`).
**Change it before you deploy** — canonical tags and the sitemap depend on it.

### Colours — strict two-hue palette

The site uses **exactly two hues** and white: brand red `#E31837` and brand blue
`#006491`. Every other token is a shade or tint of one of them — including the
"neutrals", which are desaturated blues rather than greys, so no third hue ever
reaches the page. There is deliberately no green success colour and no amber
rating colour.

`COLORS` in `site-config.ts` documents the palette; Tailwind reads the actual
values from the `@theme` block at the top of `src/app/globals.css`. **Change
both together.**

| Utility | Value | Hue |
| --- | --- | --- |
| `brand` | `#E31837` | red |
| `brand-dark` | `#B31229` | red |
| `brand-soft` | `#FCE9EC` | red tint |
| `navy` | `#006491` | blue |
| `navy-dark` | `#004E71` | blue |
| `navy-soft` | `#E4F0F5` | blue tint |
| `ink` (body text) | `#062F42` | blue shade |
| `prose` (article text) | `#123A4C` | blue shade |
| `ink-muted` | `#446B7D` | blue shade |
| `line` (borders) | `#D6E4EB` | blue tint |
| `surface-alt` | `#F2F7F9` | blue tint |
| `surface` | `#FFFFFF` | — |

Every text/background pair meets WCAG AA (4.5:1). If you change a value,
re-check the contrast before shipping — the Accessibility Statement claims AA.

The generated artwork in `public/images/` follows the same two-hue rule; the
generator palette lives in the image script referenced in section 3.

---

## 2. Environment variables

Create `.env.local` (never commit it). Every one is optional — anything left
unset simply disables that feature rather than breaking the build.

```bash
# Analytics & ads — each script only renders if its ID is present
NEXT_PUBLIC_GA4_ID=G-XXXXXXXXXX
NEXT_PUBLIC_ADSENSE_PUB_ID=ca-pub-0000000000000000
NEXT_PUBLIC_CLARITY_ID=abcd1234
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=your-search-console-token

# Contact form (src/app/api/contact/route.ts). Without these the form
# validates and returns success without sending, which is fine for local dev.
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=postmaster@example.com
SMTP_PASS=your-smtp-password
CONTACT_TO=hello@yourdomain.com

# On-demand revalidation (src/app/api/revalidate/route.ts).
# The route refuses all requests until this is set.
REVALIDATE_SECRET=some-long-random-string
```

`AdSlot` renders nothing at all until `NEXT_PUBLIC_ADSENSE_PUB_ID` is set, so
the pre-approval site ships with no empty ad boxes.

---

## 3. Adding content

All content lives in `src/data/`. **Adding one entry automatically creates the
page, the sitemap URL and the internal links** — there is no route to write and
no list to keep in sync.

### A blog post → `src/data/posts.json`

Append an object matching the `Post` interface in `src/data/types.ts`. Required:
`slug`, `title`, `excerpt`, `category`, `tags`, `author` (an author slug),
`datePublished`, `dateModified`, `readTime`, `image`, `imageAlt`, `keywords`,
`faqs`, `content` (HTML).

- The page appears at `/posts/<slug>`, is added to `/posts` and to the sitemap.
- `content` is rendered inside `.prose-guide` — use `<h2>`, `<h3>`, `<p>`,
  `<ul>`, `<ol>`, `<blockquote>`, `<table>`. Wrap wide tables in
  `<div class="table-scroll">`.
- `faqs` are rendered as an accordion **and** emitted as `FAQPage` JSON-LD.
- `featured: true` promotes it to the homepage.
- The token `{{MONTH_YEAR}}` in `content` is replaced with the live month and
  year at render time (`{{YEAR}}` works too).

### A menu item → `src/data/menu-items.json`

Append an object matching `MenuItem`. Appears at `/menus-prices/<slug>`, in the
right category section on `/menus-prices`, and emits `Product` +
`AggregateOffer` schema. Set `popular: true` to feature it on the homepage.
`related` is an array of other item slugs.

### A city → `src/data/locations.ts` **and** `src/data/locationRichContent.ts`

Both are required. `locations.ts` holds the structured data (hours, coordinates,
neighbourhoods); `locationRichContent.ts` holds the per-city prose keyed by the
same slug. A city missing its rich-content entry returns a 404 by design — this
is deliberate, so nobody ships a templated city page.

Also add `public/images/locations/<slug>.png`.

### A deal → `src/data/coupons.ts`

Append a `Coupon`. Codes are illustrative and are labelled as such everywhere
they render — do not present them as live promotional codes.

### An author → `src/data/authors.ts`

Append an `Author`, add `public/images/authors/<slug>.png`, and reference the
slug from a post's `author` field. Authors appear on `/team` with `Person`
schema and a byline on every article they wrote.

### Images

Original PNG artwork lives in `public/images/`. `next/image` converts it to AVIF
or WebP on demand — do not pre-convert. Sizes used:

| Location | Dimensions |
| --- | --- |
| `images/menu/<slug>.png` | 1000 × 667 |
| `images/posts/<slug>.png` | 1200 × 630 |
| `images/locations/<slug>.png` | 1200 × 630 |
| `images/authors/<slug>.png` | 400 × 400 |
| `images/og-default.png` | 1200 × 630 |

---

## 4. Project structure

```
src/
  app/
    layout.tsx              Root layout: fonts, global metadata, Organization + WebSite JSON-LD, analytics
    globals.css             Tailwind v4 @theme (the palette) + .prose-guide article styles
    not-found.tsx           Custom 404 (renders its own header/footer)
    sitemap.ts              Generated from the data files
    robots.ts               Allows crawlers, disallows /api, points at the sitemap
    manifest.ts             PWA manifest
    (site)/                 Route group — everything here gets Header + Footer
      layout.tsx
      page.tsx              Homepage
      menus-prices/         Menu index + [slug] detail
      posts/                Blog index + [slug] article
      locations/            City index + [slug] city guide
      coupons/  drinks/  rewards/  store-locator/  hours/  delivery-near-me/
      about/  contact/  team/
      privacy-policy/  terms/  cookies/  disclaimer/  accessibility/
    api/
      contact/route.ts      Nodemailer + honeypot + rate limit
      revalidate/route.ts   Secret-protected on-demand ISR
  components/               Header, Footer, HeroSection, MenuGuideSection,
                            CouponsClient, FaqAccordion, AuthorBio, Breadcrumbs,
                            ContactForm, LastUpdated, PriceNote, AdSlot, JsonLd…
  data/                     ALL content lives here
  lib/
    site-config.ts          Single source of truth
    seo-config.ts           generatePageSEO() + root metadata
    seo/schema.ts           JSON-LD builders
    content.ts              Typed accessors over the data files
    utils/date.ts           Date formatting + {{MONTH_YEAR}} substitution
public/
  ads.txt                   ← replace the placeholder publisher ID after approval
  icon.svg  logo.svg  images/
```

The homepage lives at `src/app/(site)/page.tsx` rather than `src/app/page.tsx`
so that it is wrapped by the header and footer like every other page.

---

## 5. SEO

Handled centrally — you should not need to touch it per page.

- **`generatePageSEO()`** (`src/lib/seo-config.ts`) builds title, description,
  canonical, OpenGraph and Twitter metadata. Every page uses it, so no page can
  ship without a canonical or a description.
- **JSON-LD** via `src/lib/seo/schema.ts`: `Organization` and `WebSite`
  site-wide; `BreadcrumbList` on every sub-page; `FAQPage` wherever there are
  FAQs; `Article` on posts; `Product`/`AggregateOffer` on menu items;
  `LocalBusiness` on city pages; `Person` on the team page.
- **Freshness**: `withFreshness()` and `currentMonthYear()` insert the live month
  and year into titles; `<LastUpdated />` renders a visible dated line.
- **Sitemap** is generated from the data files at build time.
- **Redirects**: ~20 legacy-path 301s are defined in `next.config.ts`.

---

## 6. Performance & security

- Every content page is statically generated; dynamic routes use
  `generateStaticParams` with `revalidate = 86400` (ISR, daily).
- `next/image` with AVIF/WebP, explicit dimensions and `sizes` on every image,
  so there is no layout shift. Ad slots reserve their height.
- Security headers in `next.config.ts`: HSTS, `X-Content-Type-Options`,
  `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`. `/api/*` is
  `noindex` and `no-store`.
- Accessibility: skip link, visible focus rings, semantic headings and
  landmarks, labelled form fields, `prefers-reduced-motion` support, tables with
  header cells and captions.

---

## 7. Deploying to Vercel

1. Push the repository to GitHub/GitLab.
2. In Vercel, **Add New → Project** and import it. Framework preset **Next.js**
   is detected automatically; no build settings need changing.
3. Add the environment variables from section 2 (Project → Settings →
   Environment Variables). `NEXT_PUBLIC_*` variables must be present at **build**
   time, so redeploy after adding them.
4. Add your domain under Project → Settings → Domains and follow the DNS
   instructions.
5. **Set `SITE_URL` in `src/lib/site-config.ts` to that domain** and redeploy —
   canonical tags and the sitemap read from it, not from the Vercel URL.
6. Verify `https://yourdomain.com/sitemap.xml`, `/robots.txt` and `/ads.txt` all
   respond, then submit the sitemap in Google Search Console.

---

## 8. AdSense checklist

Done in this codebase:

- Complete Privacy Policy explaining Google advertising cookies, third-party
  vendors, and opt-out links (Google Ads Settings, aboutads.info, NAI).
- Cookie Policy with a category-by-category table.
- Terms of Use, Disclaimer and Accessibility Statement.
- About page (who we are, where prices come from, how the site makes money) and
  a Team page with three author bios for E-E-A-T.
- Working contact form plus published email addresses.
- Unaffiliated disclaimer in the header notice bar and the footer of **every**
  page; prices labelled as examples wherever they appear.
- No placeholder or "coming soon" pages, no lorem ipsum, no broken links.
- Custom 404 with real navigation.
- `public/ads.txt` present.

Still yours to do:

1. Replace `pub-0000000000000000` in **`public/ads.txt`** with your real
   publisher ID after approval.
2. Set `NEXT_PUBLIC_ADSENSE_PUB_ID` so the AdSense script and `AdSlot`
   components render.
3. Give each `<AdSlot />` its real `slotId` from your AdSense account.
4. Add a consent-management platform if you serve the EEA, UK or Switzerland —
   both the Privacy and Cookie policies already state that one is shown.

---

## 9. Legal positioning

This site is deliberately built as an independent guide:

- The unaffiliated disclaimer is in the header bar and the footer of every page,
  in the `Organization` structured data, and on the About, Terms and Disclaimer
  pages.
- No brand logos or copyrighted brand assets are used anywhere. All artwork is
  original abstract illustration generated for this project.
- Every price carries the "example price — verify at official checkout" caveat
  via the shared `<PriceNote />` component.
- Coupon codes are explicitly labelled as illustrative placeholders, not live
  codes, on the coupons page, on each card, and in the Disclaimer.

The palette deliberately echoes the familiar red-and-blue of the brand this
guide covers. If you keep it, keep the disclaimer at least as prominent as it is
now — the closer the visual resemblance, the more work that notice has to do.

---

## 10. Content inventory

| Type | Count |
| --- | --- |
| Menu items (with sizes, calories, allergens, FAQs) | 20 |
| Blog guides (824–1,059 words each, ~17,500 words total) | 18 |
| City guides (unique per-city prose, not templated) | 16 |
| Deal types explained | 12 |
| Author profiles | 3 |
| Trust & legal pages | 8 |
| Static pages generated at build | 78 |

All of it original, written for this project.
