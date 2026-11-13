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
| 2026-11-09 | 100 | 56/56 | After second rejection: real dates, duplicates merged, item-page boilerplate cut |

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

## Second rejection — "Low value content" again (reported 9 Nov 2026)

The site was re-reviewed about seven weeks after the domain was registered (16 Sep 2026). Fixed in code on 9 Nov:

| Problem found | Fix |
|---|---|
| 18 articles dated Jan–Jun 2026, before the domain existed (all were added on 17 Sep 2026) | `datePublished` set to 2026-09-17 |
| "A former driver explains…" and "once you have worked a closing shift" — experience nobody here has | Removed |
| "check it against our sample" on Contact and item pages (no sample exists) | Removed |
| `/posts/pizza-rewards-program-explained` duplicated `/rewards` section for section | Post removed, 301 to `/rewards` |
| `/hours` repeated the late-night guide; `/delivery-near-me` repeated `/store-locator` | Rewritten to their own job, linking to the other |
| Classic cheese page was a near-copy of the hand-tossed page (46 shared sentences) | Classic cheese is now a plain pizza page; build-your-own sections only on the crust pages, specialty-vs-build only on hand tossed (now 13) |
| Same generic paragraphs on all 10 pizza pages | Replaced with each pizza's own per-square-inch and serving numbers |
| British spelling on a US site (158 words) | US spelling |

### Deep check, same day — the bigger problems

| Problem found | Fix |
|---|---|
| **8 of the 12 "Domino's deals" on /coupons did not exist** ($29.99 family bundle, $49.99 party pack, student 15%, lunch 20%, online 25%, $5 first order, $8.99 late-night combo, $9.99 3-topping delivery). `coupons.ts` itself said "illustrative only" | Only the 4 deals confirmed from Domino's deals page wording and two roundups remain: $7.99 carryout, Mix & Match $6.99, Perfect Combo $19.99, Rewards |
| Item pages showed "Saves $4.00" etc. from a made-up $5.99 add-on side deal | Wings → carryout deal; Stuffed Cheesy Bread, pasta, sandwiches → Mix & Match; nothing for items no deal covers |
| "Best Pizza Deals Right Now" listed family/party packs and % codes | Rewritten around the 4 real deals with savings from checked prices |
| Mix & Match, group-ordering and late-night guides relied on family packs / late-night combos | Rewritten to Perfect Combo / Mix & Match / "no late-night deal found" |
| Delivery table used a fake "$9.99 best delivery offer"; carryout saving given as $8–12 / $9 in 8 places | Recomputed: $7.99 vs ~$15.49 menu + $3–6 fee + $3–5 tip = **$13–18** everywhere |
| Calories contradicted the checked cart: hand tossed "200" (cart: 290), thin "140" (≈210), pepperoni 230 < cheese 290, "pan per slice of a large" (pan is medium only), lava cakes, soda | Corrected; estimates labeled |
| Dips stated inconsistently | Per the store check: Stuffed Cheesy Bread comes with marinara (Bacon & Jalapeño also ranch); Bread Bites and wings need a $0.99 dip cup |
| "Several family bundles include a drink"; "rewards stack with every deal" | Removed / "check in the app" |
| Every page's "Last updated" and title month **moved to the current month on its own**; sitemap lastmod was the build time | Real dates in `src/lib/page-dates.ts`, used by pages, titles and sitemap |
| "Frequently ordered" / "Most-ordered" badges with no data | Removed |
| Team page: claims "checked against how the job is actually done" and "we don't estimate" | Rewritten to what is true |
| Gluten-free and vegan guides were generic "chains" content | Added sourced Domino's facts (GF crust 10" + celiac warning; no US vegan cheese) |

### Third pass — brand, images and arithmetic

| Problem found | Fix |
|---|---|
| **Domino’s logo** in the Christmas article image, and on bottles in an unused `drinks.webp` | Christmas image rebuilt without the box; 40 unused images (incl. logo ones) deleted |
| Site logo, favicon and share image used a domino-tile pattern (dots) in Domino’s exact red/blue | New slice logo, favicon and OG image (colors kept, owner’s choice) |
| Stock photos on “Domino’s X: Price” pages read as the real product (ice cream with lava cake, juices, lettuce sub) | Caption on every item photo: “Illustrative photo, not a Domino’s product photo” |
| “A large is **60%** more pizza than a medium” (6 places) — it is 36%; “costs 25–30% more” — it is 17% on site prices | Corrected |
| Stuffed Cheesy Bread dip: an earlier fix wrongly said no dip; the store check recorded **marinara included** | Restored to the check |
| Item text still pointed to deals that do not exist (“any large pizza same price”, wings “excluded from offers”, Bread Bites “strong bundle pick”) | Rewritten to the confirmed deals |
| “genuinely” used 41 times | Cut to 1 |

### Fourth pass — claims the site could not back up (10 Nov 2026)

| Problem found | Fix |
|---|---|
| Home hero said “**Every** Domino’s menu item”, About said “prices for every item on the menu”; the site covers 20 | “20 core items” |
| Price-per-inch analysis called the 16″ extra large “hand-tossed”; the store record says hand tossed has no XL (New York Style only) | Labelled New York Style only, on the note and the FAQ |
| Home hero showed “Page updated October 29” while the page footer said November 9 | Hero reads `PAGE_DATES['/']` |
| FAQ: “every price is labeled as an example”, “prices reviewed on a rolling schedule”; About: “Dated, and re-checked” | Rewritten to what is true: one online-cart check, dated, checked vs est. |
| Deal tiles “apply automatically” (home + 3 article spots) contradicted “build inside the deal” advice | “Open the deal and build inside it” everywhere |
| Rewards: free pizza called “any medium — take a specialty”; it is a **medium 2-topping**. Values disagreed ($13.49 / $13 / $2 / $2.25 / $2.50). “Rewards stack with deals” and generic expiry wording | Confirmed rules: 10 pts per $5+ order, one earning order per day, 60 pts = medium 2-topping (~$14.99 est.), one reward per order, 180-day inactivity expiry; stacking marked unconfirmed |
| “Buying drinks elsewhere cuts 10–15% off a family order” (4 places), “ten or fifteen dollars” on a party order, “roughly half” | Worked out: one 2-liter ≈ 8% of a $55 order; $5–8 on a party order; a third or more |
| Save-money guide: “the list we actually use”, “percentage-off codes”, “any large pizza at a fixed price — pick the loaded one” (the $7.99 deal is 1-topping) | Rewritten around the real deals with checked prices; topping-vs-specialty break-even shown ($1.50/topping est.) |
| Half-and-half “costs the price of the more expensive half” (4 places), Mix & Match “specialty surcharge $1–2”, “wings often excluded”, “most-used deal structure”, “markets we track” | Removed or replaced with “check the deal tile / cart” |
| Pepperoni Pizza listed as a Specialty pizza (it is a 1-topping build-your-own at $15.49 est., not $19.99) | Moved to Build Your Own |
| Pan crust “stops at large” / “often unavailable in XL” — Handmade Pan is medium only | Corrected |

### Fifth pass — health data, structured data, policies (10 Nov 2026)

| Problem found | Fix |
|---|---|
| **Allergen lists on all 20 item pages** (e.g. plain wings “Milk, Soy”) came from the initial build, never checked, yet labelled “as listed on the official menu” | Lists removed; each page says we have not checked Domino’s allergen information and where to find it. Ingredients relabelled “main components from the menu description” |
| Philly Cheese Steak listed a “garlic parmesan sauce” not in Domino’s description | Removed |
| JSON-LD gave Google every price — mostly estimates — as an `Offer`, as if we sold the item | `Offer` removed from MenuItem and the home ItemList |
| Organization schema: “reader-supported guide to … coupon codes” | “ad-supported guide to … deals” |
| Menu hub H1 “every item”, intro “full ingredient and allergen list”; “Full menu with prices” links | “20 core items”, “Menu & prices” |
| Privacy & cookie policy said “We use Google Analytics 4” / Clarity; neither runs on the live site. Said EEA visitors see a consent notice; the site has none of its own | Analytics text now appears only when `NEXT_PUBLIC_GA4_ID` / `NEXT_PUBLIC_CLARITY_ID` are set; consent text refers to Google’s consent message |
| Tracker article read like an insider: “bake accurate to within a minute”, staff-name attribution, “frequently does not reset”, “reduced calls to stores” | Section removed and claims softened to what is observable |
| Calories: “four meats add 120–160 per slice” vs the site’s own cart data (MeatZZa 360 vs cheese 290 = +70) | Uses the cart figures |
| Delivery page: “site defaults to delivery”; coupons: “specialty items carry a surcharge” | Softened to what is known |

### Sixth pass — generic content and overclaims (10 Nov 2026)

| Problem found | Fix |
|---|---|
| Six guides (coupon codes, delivery fee, tipping, toppings, calories, tracker) never mentioned Domino’s — generic “chain” content on a Domino’s site | Each now opens with an “At Domino’s” box built from the store check or a named source (Domino’s FAQ on the delivery charge; Carpaneda v. Domino’s) |
| The same photo used twice: home + menu hero; best-deals + coupon-codes article | Second uses replaced with distinct crops (pizzas close-up; phone close-up) |
| How-to-order guide: “pay eight dollars differently”, “flat rate buys a fully loaded pizza”, “percentage code beats a bundle above $30–40”, “ask any delivery driver”, “app is cheaper because processing costs less” | Rewritten from the real deals and checked prices ($7.99 vs ~$21–26) |
| Coupon-codes guide: offers “guaranteed to work”, “most sites default to delivery”, app pricing “usually the best”, staff can “override configuration errors” | Softened to what is known |
| Delivery-fee and tipping guides: “comes up constantly, in doorways…”, “framework drivers themselves say” (implied interviews) | Removed |
| Crust guide called crust “the only free choice” while describing the pan upcharge; omitted New York Style, Gluten Free and Parmesan Stuffed | Corrected; short section on Domino’s other crusts from the store record |
| Item pages: “most common complaint”, “most people still hungry”, “most heavily discounted item on most menus” | Rewritten without invented generalizations |

### Seventh pass — arithmetic, statements and images (10 Nov 2026)

| Problem found | Fix |
|---|---|
| Group guide: “four large pizzas — roughly 24 slices” (it is 32); FAQ about a “party bundle” (no such deal); “from planning a lot of these”; “an extra-large: ten slices” (unverified); “two large orders of breadsticks” (not a Domino’s item) | Corrected; FAQ now compares Perfect Combo vs Mix & Match |
| Accessibility statement: images are “abstract decorative artwork” (they are food photos); keyboard access for “deal filters” (none exist); ads “reserve space” (Auto ads do not); “tested with Lighthouse” | Rewritten to what is true; says no independent audit |
| 17 article images had alt text like “Photo for a guide about…” | Each describes what the photo shows |
| Coupons: “Mix & Match saves less per item” — a medium 2-topping saves ~$8 (est.), more than the carryout deal | Corrected; “by percentage” claim limited to checked prices |
| Carryout guide: delivery fee covers “company-owned cars”; delivery advice at 10 min contradicted the 30-min break-even | Drivers’ mileage reimbursement; 15 min each way |
| Size guide: “worst value item on any chain menu”; slices per adult differed from the rest of the site; “offered prominently at checkout” | Corrected; one planning number site-wide (2 with sides, 3 without) |
| Happy-hour guide cited usafoodmenu.com (another menu-price site) and “full menu… every price” | Replaced with The Krazy Coupon Lady; wording fixed |
| Vegan, late-night, MeatZZa, calories: “staff never trained”, “almost nobody uses scheduling”, “saltier”, “never the largest item” | Softened or removed |

External links: all resolve; aol.com, eatdrinkdeals.com and savings.com return 403 to scripts only.

### Eighth pass — template output (10 Nov 2026)

| Problem found | Fix |
|---|---|
| Item pages asked the same question twice: generated “How much is a large MeatZZa at Domino’s?” plus editorial “How much is a large MeatZZa?”; same for calories and piece counts (on nearly all 20 pages, also in FAQ markup) | One question per topic per page |
| “How many pieces come in Domino’s 8-piece wings?” | Dropped when the name states the count |
| “How much does a topping cost?” with an identical answer on three crust pages | Kept on the hand-tossed page only |
| Template glitches: “$10.99 for the any flavor”, “16 pieces · 16 pieces”, “$5.99 for the 16 pieces” | “$10.99 for 8 pieces”, “16 pieces” |
| The $7.99 deal price was labelled “estimate” / “by our estimate” on item pages; it is a reported price we did not set | “Reported deal price, not tested at checkout” |

### Ninth pass — hub, drinks, store locator (10 Nov 2026)

| Problem found | Fix |
|---|---|
| Menu hub: specialty pizzas “get the most out of a flat-price carryout deal” — the $7.99 deal is 1-topping only | Says specialty pizzas are not covered |
| “Cheapest here: ExtravaganZZa” when all five specialty pizzas share a price | Ties say “several items start at the same price” |
| Taste verdicts nobody could give without eating: Lava Cake “most reliably good dessert”, “excellent eaten fresh”, “best thing on it”; Stuffed Cheesy Bread “worth the upgrade”; Loaded Chicken “reheats better than anything else” | Replaced with price facts |
| Drinks page: “ten or fifteen dollars” on a party order (fixed elsewhere, not here); shop 2-liter $2.29 vs $2.50–3.00 elsewhere; “many stores keep stock at room temperature”; drinks “count toward the delivery minimum”; “highest-markup item”; “every side ranked” | $5–8; $2.75; softened; “each side we checked” |
| Store locator: city list (San Diego, Jacksonville, LA, Seattle, Atlanta) left from old location pages; “most failed deliveries are not the store’s fault”; “drivers lose most time at the gate” | Removed; Domino’s Hotspots named for parks and beaches |
| Excerpts contradicting fixed articles: “crust is the only free decision”, “every topping costs the same”, “most flexible deal in chain pizza” | Corrected |

**Owner — HTTP redirect:** `http://` → `https://` answers **302** (temporary). In Cloudflare → SSL/TLS → Edge Certificates, turn on **Always Use HTTPS** (301), or make the Coolify/Traefik redirect permanent.

**Owner — consent message:** in AdSense → Privacy & messaging, turn on the Google consent message (GDPR) for EEA/UK/Switzerland. The privacy and cookie pages now say this is shown.

**Owner check:** the contact form returns 503 when the `SMTP_*` environment variables are not set. Send yourself a test message on the live site after redeploying; if it fails, add the SMTP variables in Coolify or a reviewer’s message will bounce.

What code cannot fix, and what most likely decides the next review:

1. **Age and traffic.** Wait until the site is at least 3 months old (mid-December 2026) and Search Console shows most pages indexed with some clicks. Re-applying every few weeks does not help.
2. **First-hand evidence.** The site still mostly explains things anyone could write. Photos of real orders, receipts, the deals page screenshot at a real store, the $7.99 carryout deal actually tested — that is what separates it from the other menu-price sites.
3. **The domain name contains the brand.** Nothing to do now, but keep the not-affiliated notice and never use the logo.

### Tenth pass — untested experience claims (12 Nov 2026)

- **Hours page:** removed the "last-order calculator", which turned an unchecked 30-minute delivery / 10-minute carryout cut-off into a table of clock times, plus the "last delivery order" column. The same cut-off claim was also removed from the late-night, Christmas and happy-hour articles.
- **Delivery page:** "fifteen orders ahead at 6:30 on a Friday", "25–45 minutes is normal", "the last fifty feet is where deliveries fail" replaced with hedged guidance; guest-order points wording corrected.
- **Food quality never tested:** removed claims about how sides hold up in transit (drinks page ranking with timings), what a well-done bake does to specific pizzas, wings "improve with extra oven time", alfredo "declines after fifteen minutes", pepperoni greasiness, reheating verdicts, and gluten-free texture verdicts. Pepperoni and wings page copy rewritten; two pepperoni FAQs and one wings FAQ removed.
- **"Free at most stores":** modification claims reworded to "usually free in the online pizza builder, which shows a price if one applies".
- **Safety:** the gluten-free guide no longer says staff "change gloves at most stores" when told it is medical.
- **Speculation removed:** the tipping article no longer says Domino's leaves the checkout unclear to protect fee revenue, and no longer says "nothing on the screen explains" the fee (Domino's states the delivery charge is not a tip).
- **About / team / footer:** author bio no longer mentions allergen pages; footer says "We check or estimate prices".
- **Template:** calorie notes no longer lower-case brand names ("dasani water" → "Dasani water"); a 0-calorie item no longer reads "About 0 calories".

### Eleventh pass — policies, arithmetic, last generalizations (12 Nov 2026)

- **Privacy policy:** no longer says Google "measures traffic" (no analytics runs); "three categories" of cookies corrected; automatic-collection paragraph now describes server logs and Google's ad cookies only; "We are based in the United States" replaced with a neutral international-processing statement.
- **Cookie policy:** the site sets no cookies of its own (checked: no Set-Cookie on the live site). The "strictly necessary — the site cannot function without these" row became a hedged security-provider row; analytics reason shown only when analytics is configured.
- **Terms / disclaimer:** "Prices … are estimates" heading fixed (some are checked); allergen wording now says we do not list allergens; disclaimer explains calorie sourcing.
- **Arithmetic:** "thin vs pan meat slice differ by more than double" (false: ~220 vs ~340–380) and "four toppings routinely costs more than a specialty" (our own figures make them equal at $19.99) corrected; "thin crust saves more than removing every meat topping" corrected.
- **Contradiction:** coupons FAQ said a flat deal "buys a plain or fully loaded pizza equally", while the same page says upgrades cost extra. Fixed.
- **Unverified generalizations:** "points rarely added afterwards", "most coupon-site codes are expired", "in order of how often they catch people out", "finds four or five dollars", "free at most stores" (sandwich, modifications FAQ, thin crust, light cheese), sandwich "goes soggy" FAQ, extra cheese "difference often invisible".
- **Home hero:** "Photos" badge (implied real food photos) → "Calories"; hero sentence rewritten.
- **Dates:** every page and post really changed since the last commit, so PAGE_DATES, MENU_ITEMS_UPDATED and posts' dateModified are now 2026-11-12.

### Twelfth pass — brand look-alike, boilerplate, last untested claims (12 Nov 2026)

- **Brand colors:** the site used Domino's exact brand red (#E31837) and blue (#006491). On a domain containing "dominos", that reads as a look-alike site (misrepresentation risk). The palette is now tomato orange #C2410C and basil green #1B5E3B, with all neutrals retinted and every text pair above WCAG AA. The logo, icon, favicon.ico and og-default.png were regenerated to match.
- **Templated boilerplate:** menu item pages repeated the full price-source paragraph directly under the short price note, ran a two-paragraph allergen block and ended with a legalistic "publicly available menu" line. All three were cut to one line each. The homepage showed the same price-source paragraph three times; the section intro is now one short sentence.
- **Untested texture and reheat claims removed:**
  - Menu items: bread bites (harden, oven vs microwave), stuffed cheesy bread ("changes within twenty minutes"; the "survive delivery" FAQ), lava cake (forty-minute bag, "twenty seconds in a microwave", two FAQs), pan reheating, loaded chicken "soggy", thin "best eaten straight away", Philly "steak dries out".
  - Articles: the group "holds up" list, crust comparison bullets, "only crust good the next day", Christmas reheat advice.
- **Generalizations softened:** store hours ("most stores open 10:30am", "most stores close 11pm–midnight", "campus stores consistently later"); "most promo codes are 18-month-old offers"; vegan desserts "almost always"; the cheese-portioning claim; "nobody is declining your delivery"; "most people never use"; "zones follow driving time".
- The cheese pizza value line now names the reported $7.99 carryout deal instead of "almost always beaten".
- **Images:** a contact sheet of all 44 images showed no Domino's logos, boxes or uniforms. Menu photos stay labeled "illustrative".
- Build OK, tsc and eslint clean, audit 56/56, 100/100.

## Rules from here on

- Never state that a price, a store or a date was checked unless it was.
- Prefer one clear disclaimer per page over a label on every element.
- New pages need a real reason to exist; ten thin pages hurt more than they help.
