# AdSense readiness module

**Rejected:** 23 Oct 2026 — "Low value content". This file is the working plan to fix it, phase by phase. Update the status column as each phase lands, and re-run the audit after every phase.

## Run the audit

```bash
npm run build
npx next start -p 3124 &
npm run audit:adsense -- http://localhost:3124          # summary
npm run audit:adsense -- http://localhost:3124 --json audit.json
```

`scripts/adsense-audit.mjs` crawls every sitemap URL and checks:

| Check | Pass when |
|---|---|
| Unique words per page | Text shared with 3+ other pages removed; article ≥ 700, hub ≥ 400, item ≥ 350, legal ≥ 250, utility ≥ 150 |
| Near-duplicates | No two pages share > 30% of their unique 5-word sequences |
| Disclaimer density | ≤ 6 "example price / verify at checkout / not affiliated…" phrases per 1,000 words |
| Metadata | Title ≤ 65 chars (articles exempt), description 70–160, exactly one h1, alt on every image |
| Site basics | About, Contact, Privacy, Terms exist; ads.txt has the real pub ID; robots.txt doesn't block; AdSense loader in raw HTML; no broken links; no placeholder text |

The audit measures what a script can. It cannot judge whether content is **true** or **useful** — phases 1 and 2 below are about exactly that, and they matter more than the score.

## Root causes (what the reviewer sees)

1. **Unverifiable data presented as checked.** Prices were AI-estimated, but the site said they came from "a rolling sample of stores our team prices", showed "prices last checked" dates and "researched by" lines. Fabricated sourcing is the core low-value / misleading signal.
2. **The site keeps disowning its own content.** "Example price", "example offer", "not a live code" on nearly every block reads as "nothing here is real".
3. **Thin hub pages.** `/posts` had 52 unique words; `/menus-prices` 323.
4. **Brand-menu niche + new domain.** "X menu prices" sites are a frequently rejected category, and the domain is 1–2 months old with little indexing or traffic.

## Audit history

| Date | Score | Passing pages | Notes |
|---|---|---|---|
| 2026-10-25 | 92 | 51/55 | First run. Thin `/posts` (52 unique words) and `/menus-prices`; home and menu hub disclaimer-heavy |
| 2026-10-25 | 100 | 55/55 | After phases 1, 3, 4, 5 |
| 2026-10-29 | 100 | 55/55 | Real menu and 38 checked prices; every price labelled checked or est. |

A 100 here means the measurable checks pass — it does **not** mean approval. Phase 2 (real prices) and phase 6 (indexing & age) remain.

## Phases

| # | Phase | Owner | Status |
|---|---|---|---|
| 0 | Audit module (`scripts/adsense-audit.mjs`, `npm run audit:adsense`) | Claude | ✅ Done |
| 1 | **Honesty pass** — one `PRICE_SOURCE` setting drives every sentence about where prices come from; remove "store sample", "we priced", "last checked", "reader reports we verify", "drivers we've talked to" | Claude | ✅ Done |
| 2 | **Real prices** — 38 prices checked at Domino's, 628 N High St, Columbus OH, 25 Oct 2026 (`data/verified-prices-2026-10-25.json`); menu rebuilt around the real items; remaining sizes and deal prices labelled "est.". To finish: check the other pizza sizes, crusts, one topping and the deals page, then `npm run prices:import` | Owner + Claude | 🟡 Mostly done |
| 3 | **Fewer disclaimers** — keep the header notice, one price note per page and the footer; drop per-card "example" tags | Claude | ✅ Done |
| 4 | **Strengthen thin hubs** — `/posts`, `/menus-prices` | Claude | ✅ Done |
| 5 | **Articles** — remove first-person experience claims nobody can back up; keep the practical advice | Claude | ✅ Done |
| 6 | **Indexing & traffic** — redeploy, resubmit sitemap, request indexing; wait until most pages show as indexed in Search Console | Owner | ⏳ |
| 7 | **Re-apply** — only when audit passes, phase 2 is done, and the site is ~3 months old with pages indexed | Owner | ⏳ |

## Rules from here on

- Never state that a price, a store or a date was checked unless it was.
- Prefer one clear disclaimer per page over a label on every element.
- New pages need a real reason to exist; ten thin pages hurt more than they help.
