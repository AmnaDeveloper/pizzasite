# Slice & Save — AdSense & Search Readiness

A full read of the current build against Google AdSense's approval bar and Google Search's 2026 ranking signals, plus a standing content policy so everything published from here forward is built to clear both.

**Site:** pizzasite (Next.js App Router) · **Scope:** 18 guides · 20 menu items · legal pages · **Analyzed:** 2026-09-10

---

## 1. Readiness scorecard

The build itself is unusually far along for a pre-launch site — the gap to AdSense-ready is mostly configuration, not code.

| Area | Status | Notes |
| --- | --- | --- |
| Content quality | ✅ Strong | 18 posts, 824–1059 words, original, byline + FAQ on every one |
| Technical SEO | ✅ Strong | Per-page schema, sitemap, canonical, robots — all auto-generated |
| AdSense config | ❌ Not live | Placeholder domain, empty publisher ID, no deployment yet |
| Trust signals | ✅ Resolved | Real bylines (Amna Sadam, Maha Iqbal), body-text claims now match who's actually credited — see §2a |

---

## 2. Before you apply for AdSense

Google cannot review a site it cannot crawl publicly, and it will not serve ads against a placeholder identity. These are the items that actually block the application, in the order to fix them.

### 🔴 Blockers

1. **Site is only running on localhost.** Everything else is worthless until the site is on a public domain Google's crawler can reach.
   - **Fix:** buy a real domain and deploy to Vercel (the README is already written for this). Do this first — it unblocks every other item.

2. **`SITE_URL` and contact emails are still placeholder.** `src/lib/site-config.ts` points at `sliceandsave.com` — a domain you don't own — and every canonical tag, the sitemap, and the JSON-LD publisher block inherit it.
   - **Fix:** once the real domain is bought, update `SITE_URL`, `CONTACT_EMAIL`, `EDITORIAL_EMAIL`, and the author emails in `authors.ts` to match, then redeploy.

3. **`ads.txt` ships a placeholder publisher ID.** `pub-0000000000000000` — Google documents that a placeholder ID is treated as if there's no `ads.txt` at all, which blocks ad serving even after approval.
   - **Fix:** create the AdSense account (you get a real `pub-…` ID immediately, before review finishes) and drop it into `public/ads.txt`.

### 🟡 Do before applying

4. **No Search Console or GA4 connected.** `GOOGLE_SITE_VERIFICATION` and `GA4_ID` are both empty env vars. Without Search Console you can't submit the sitemap or request indexing, and reviewers move faster on sites that are already indexed.
   - **Fix:** verify the domain in Search Console, submit `/sitemap.xml`, request indexing on the homepage and top 5 guides.

5. ~~**Author bios read as invented personas.**~~ ✅ **Done (2026-09-10).** Replaced the three fictional personas with the real editors — **Amna Sadam (Co-Founder)** and **Maha Iqbal (Content Lead)** — in `src/data/authors.ts`, reassigned all 18 posts' bylines, and rewrote the about/team page copy that named the old personas. Bios describe their actual role/process here rather than invented outside credentials (no fabricated "registered dietitian," "twelve years in retail pricing," etc.) — safer for E-E-A-T once the site is reviewed. Social links were intentionally left out; avatars are still the abstract placeholder tiles pending real photos.

6. ~~**One guide is still missing its photo.**~~ ✅ **Done (2026-09-10).** No new photo was supplied for `pizza-coupon-codes-explained`, so per owner's instruction it now reuses `best-pizza-deals-this-month.jpg` with its own alt text. All 18 posts have a real photo now.

---

## 2a. Content-strength pass (2026-09-10)

With the author swap done, the article bodies needed a follow-up check: five guides originally written in DeShawn's or Priya's voice contained **first-person experience claims** ("I delivered pizza for four years," "I drove for four years," "I counsel people on food for a living," even a title reading "…From Someone Who Was One"). Once those posts were reattributed to Maha, those claims became false — exactly the kind of inconsistency that damages trust if a reader or a reviewer notices it. All five were rewritten to keep the insight but drop the fabricated personal claim, and the one title that carried the false claim was shortened and corrected.

While in there, ran every post against the length rules in §7:
- **11 titles were over the safe ~60-character SERP width** (with the site name suffix, some were pushing 85+ characters and would have been truncated in Google results) — shortened all of them to ≤58 characters while keeping the primary keyword up front.
- **1 meta description was over 155 characters** (`hand-tossed-vs-thin-crust-vs-pan`) — trimmed to fit without losing meaning.
- Word counts (821–1059), FAQ counts (3 per post) and freshness dates were already all within policy — no changes needed there.

---

## 2b. Second image pass (2026-09-10) — homepage & /menus-prices

More photos were dropped into `public/images/`. Before using any of them, checked provenance: several filenames (`pepperoni-pizza.webp`, `extravaganzza-pizza.webp`, `philly-cheese-steak-pizza.webp`, `boneless-chicken.webp`, `stuffed-cheesy-bread.webp`, `drinks.webp`) matched **exact asset filenames live on a competitor site** (`dominos-menu.us`) checked earlier in this session — confirmed with the owner these are the owner's own/licensed images, not scraped, before placing any of them.

One image was still rejected regardless: `drinks.webp` shows bottles with **Domino's actual logo printed on the label**. Site policy is "no brand logos or copyrighted assets" — using it would contradict the site's own non-affiliation claim and create real trademark risk, so it was left unused no matter who owns the photo rights.

What got placed:
- **3 menu items** got real photos, replacing the original abstract-illustration placeholders: `pepperoni-pizza`, `boneless-chicken-bites`, `cheesy-bread`.
- **4 pages that had zero images at all** — `/coupons`, `/rewards`, `/delivery-near-me`, `/menus-prices` — got a header photo. (The homepage hero deliberately stays image-free — it's a documented Core Web Vitals decision, see `HeroSection.tsx`, and wasn't touched.)
- **Bug fix while in `/delivery-near-me`:** the page still said "city guides for 16 US markets" and linked to a `#cities` anchor from the locations-feature removal earlier in this session — that section no longer exists, so the anchor was dead and the meta description was making a false claim. Fixed both.

Left unused (no confident match, flagged rather than guessed): `extravaganzza-pizza.webp`, `philly-cheese-steak-pizza.webp` (not items this menu sells), `Pizza_restaurant_menu_overhead_2K_...jpeg`, `dominos-pizza-sizes.webp`, `dominos-mix-and-match.jpeg`, `save-money-dominos.jpeg` (topics that already have a photo), `drinks.webp` (Domino's logo, see above).

---

## 3. Already working in your favor

Worth knowing before you start changing things — most sites applying for AdSense are missing all of this.

- **Real word count** — 824–1059 words per guide, comfortably inside Google's "comprehensive but not padded" range.
- **Structured data everywhere** — Article, FAQ, Breadcrumb and Organization JSON-LD wired per page, not bolted on.
- **Auto-generated sitemap** — new posts, menu items and prices appear in `/sitemap.xml` with no manual step.
- **Unique meta per page** — `generatePageSEO()` forces a distinct title, description and canonical on every route.
- **Legal pages present** — privacy, terms, cookies, disclaimer and accessibility all exist already — a common rejection reason handled.
- **Prices labeled as examples** — avoids the "misleading pricing claim" flag reviewers watch for on price-comparison sites.
- **Crawler access pre-configured** — `robots.ts` already allows `Mediapartners-Google` and `AdsBot-Google` explicitly.
- **Disciplined visual identity** — a strict two-hue palette reads as considered, not templated — a soft trust signal reviewers do notice.

---

## 4. Image pass — what just changed

17 of the 18 new photos dropped into `public/images/` matched a guide by filename and are now live on their articles, replacing the old abstract-illustration placeholders.

| Item | Result |
| --- | --- |
| 17 guides | Matched by slug → moved into `/images/posts/`, alt text updated |
| `pizza-coupon-codes-explained` | No matching file found — still on the old placeholder |
| `Two_pizzas_side-by-side_2K_202608011436.jpeg` | Filename doesn't match any article — left in place, unused |

---

## 5. What AdSense actually checks

Pulled from Google's own AdSense policy pages plus current 2026 approval-guide consensus, condensed to what applies here.

**Eligibility (official)**
- 18+ and a Google Account in good standing.
- Content must be "high-quality, original" and "attract an audience" — Google states no fixed minimum post count or traffic threshold.
- You need access to your site's HTML source (true for any self-hosted Next.js deploy).
- Full compliance with the Program Policies before you even sign up.

**What gets sites flagged**
- Thin content — short, poorly researched, or reworded from elsewhere with nothing added.
- Duplicate content — Google's own systems detect copied text near-instantly.
- Pages built only to host ads — no real utility beyond the ad slot.
- Poor UX — slow loads, intrusive ad density, broken navigation.

**What reviewers respond to**
- Sites with 15–25 in-depth posts outperform sites with 50 thin ones.
- First-hand insight or a specific angle (a driver's account, a dietitian's read) is explicitly what separates approved sites from generic AI filler.
- AI-assisted writing isn't banned — thin and unoriginal is what's banned.
- Clean legal pages + no policy issues → typically reviewed in 1–14 days.

---

## 6. What ranks on Google's first page in 2026

Same research pass, this time for organic ranking rather than ad approval — the two overlap more than they differ.

**E-E-A-T**
- Experience, Expertise, Authoritativeness, Trust — Trust is now described as the "gating factor," specifically author credibility and source verification.
- A named author with a real, checkable bio outranks an anonymous "Admin" byline on comparable content.

**Helpful content**
- Google's John Mueller: relevance and content quality are "by far much more important" than page speed.
- The helpful-content system specifically rewards original insight, examples and data competitors don't have — not just longer text.

**Core Web Vitals**
- INP (Interaction to Next Paint) has replaced FID as the responsiveness metric to watch.
- Still a real factor, just a smaller one than content quality — don't over-invest here at the expense of writing.

**Backlinks**
- In 2026, Google weighs authority, relevance and trust over raw volume — a handful of links from relevant food/finance sites beats hundreds from directories.
- Genuine mentions (forums, niche roundups, press) compound; bought or spammy links carry real risk.

> **Why this matters for a Domino's price/coupon guide specifically:** this niche is exactly where Google's helpful-content system is tuned to punish thin content — "pizza deals" and "menu prices" pages are a crowded, often low-effort category. The site's advantage is the opposite of what most competitors do: real per-item pricing tables, FAQ schema per guide, and bylines with a stated angle (a former driver, a dietitian) instead of generic listicle text. Protecting that gap — not adding more pages — is the highest-leverage ranking move available right now.

---

## 7. Content policy — apply this to every future post

A standing checklist, not a one-time task. Run every new guide or menu page through this before it's published.

| Rule | Requirement |
| --- | --- |
| **Length** | 800–1,500 words, one clear topic covered completely. No post under 700 words; no post padded past 1,600 to look thorough. |
| **Intent** | Title must match what someone actually types into Google for that question — check the phrase, don't assume it. |
| **Angle** | Every post needs one sentence only your byline author could write — a first-hand detail, not generic advice available anywhere. This is what separates the site from AI-filler competitors. |
| **Originality** | Never paraphrase a competitor page. Draw numbers from your own `menu-items.json` / `coupons.ts` data, and verify any figure before publishing. |
| **Honesty** | Label every price or figure not independently verified live as an example / approximate — matches existing site convention and avoids misleading-content flags. |
| **SEO basics** | Unique meta title (≤60 chars) + description (≤155 chars), one hero image with specific alt text, 3+ FAQ entries for schema eligibility, links to 2–3 related posts or menu items. |
| **Freshness** | Update `dateModified` and the actual text whenever a price, fee or hour changes — stale "last updated" dates are a trust signal Google checks. |
| **Images** | Filename matches the post slug exactly (`{slug}.jpg` in `/images/posts/`), alt text describes the actual photo — never "abstract illustration." |
| **Byline** | Attribute to a real, checkable person with a genuine credential relevant to the claim — resolve the persona question in §2 before scaling this further. |
| **Byline consistency** | If a post's author ever changes, re-read the body for first-person claims ("I delivered…", "in my years as…") tied to the *old* author — a swapped byline with an unchanged claim is a false statement, not a style choice. |

---

## 8. Roadmap

**Phase 0 — This week: unblock launch**
- [ ] Buy the real domain, update `SITE_URL` and every email/social link to match — *deferred by owner, revisit later*
- [x] Decide the author-persona question (§2) — done, real editors added
- [ ] Fill in the missing coupon-codes photo

**Phase 1 — Weeks 1–2: go live and apply**
- Deploy to Vercel, connect the domain, redeploy with real env vars (GA4, Search Console, AdSense IDs)
- Verify in Search Console, submit `/sitemap.xml`, request indexing on the homepage + top 5 guides
- Once Google shows the site as indexed, submit the AdSense application; drop the real publisher ID into `ads.txt` the moment it's issued

**Phase 2 — Months 1–3: scale content, not just pages**
- 2–4 new guides a month, each run through the §7 policy checklist
- Earn a small number of relevant backlinks (food/deals roundups, genuine forum answers) over bulk directory submissions
- If local delivery search is a goal, reintroduce location pages later with real per-city detail rather than templated copies

**Phase 3 — Ongoing: monitor and prune**
- Watch Search Console for query/CTR shifts; rewrite or merge posts that plateau
- Check PageSpeed Insights / CrUX for INP and LCP regressions after content or image changes
- Review the AdSense Policy Center monthly for any new flags

---

## Sources

- [Eligibility requirements for AdSense — Google AdSense Help](https://support.google.com/adsense/answer/9724?hl=en)
- [AdSense Program policies — Google AdSense Help](https://support.google.com/adsense/answer/48182?hl=en)
- [Top Google Search Ranking Factors in 2026 — Yellowhead](https://www.yellowhead.com/blog/google-ranking-factors/)
- [Google E-E-A-T Guidelines 2026 Playbook — Keywords Everywhere](https://keywordseverywhere.com/blog/google-e-e-a-t-guidelines-an-overview/)
- [Google Ranking Factors 2026 — PushLeads](https://pushleads.com/how-to-improve-google-rankings/google-ranking-factors-2026/)
