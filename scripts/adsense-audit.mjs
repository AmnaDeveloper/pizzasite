#!/usr/bin/env node
/**
 * AdSense readiness audit.
 *
 * Crawls every URL in the sitemap of a running copy of the site and scores it
 * against the things "Low value content" rejections are actually about:
 * how much UNIQUE text each page carries once template text shared across the
 * site is removed, near-duplicate pages, pages dominated by "example only"
 * disclaimers, plus the site-level basics a reviewer checks.
 *
 * Usage:
 *   npm run build && npx next start -p 3124 &
 *   node scripts/adsense-audit.mjs [baseUrl] [--json report.json]
 *
 * Exit code 0 = every check passes, 1 = something to fix.
 */
import { writeFileSync } from 'node:fs';

const args = process.argv.slice(2);
const BASE = (args.find((a) => a.startsWith('http')) ?? 'http://localhost:3124').replace(/\/$/, '');
const jsonOut = args.includes('--json') ? args[args.indexOf('--json') + 1] : null;

/* ------------------------------------------------------------- thresholds */
const T = {
  // Unique words (after removing text shared with 3+ other pages).
  uniqueWords: { article: 700, hub: 400, item: 350, legal: 250, utility: 150 },
  // 5-word shingle Jaccard similarity between two pages' unique text.
  maxSimilarity: 0.3,
  // "Example only" disclaimer phrases allowed per 1,000 words.
  maxHedgePer1k: 6,
  titleMax: 65,
  descMin: 70,
  descMax: 160,
};

const HEDGES = [
  /example price/gi,
  /example offer/gi,
  /examples? only/gi,
  /illustrative/gi,
  /not a live/gi,
  /not live/gi,
  /verify at (official )?checkout/gi,
  /your store may differ/gi,
  /not affiliated/gi,
];

const REQUIRED_PAGES = ['/about', '/contact', '/privacy-policy', '/terms'];

/* ---------------------------------------------------------------- helpers */
const decode = (s) =>
  s
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));

async function get(path) {
  const res = await fetch(BASE + path, { redirect: 'manual' });
  return { status: res.status, text: res.status === 200 ? await res.text() : '' };
}

function pageType(path) {
  if (path === '/') return 'hub';
  if (/^\/posts\/.+/.test(path)) return 'article';
  if (/^\/menus-prices\/.+/.test(path)) return 'item';
  if (['/privacy-policy', '/terms', '/cookies', '/disclaimer', '/accessibility'].includes(path)) return 'legal';
  if (['/contact', '/team', '/about'].includes(path)) return 'utility';
  return 'hub';
}

/** Visible text of <main>, split into sentences. */
function extract(html) {
  const body = html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, ' ');
  const main = (body.match(/<main[\s\S]*?<\/main>/i) ?? [body])[0];
  const text = decode(
    main
      .replace(/<\/(p|li|h[1-6]|td|th|dt|dd|div|section|figcaption|caption|a|button|span)>/gi, '$&\n')
      .replace(/<[^>]+>/g, ' '),
  );
  const sentences = text
    .split(/\n|(?<=[.!?])\s+/)
    .map((s) => s.replace(/\s+/g, ' ').trim())
    .filter((s) => s.split(' ').length >= 3);
  return { text: text.replace(/\s+/g, ' ').trim(), sentences };
}

const words = (s) => s.toLowerCase().match(/[a-z0-9$.%'-]+/g) ?? [];

function shingles(text, n = 5) {
  const w = words(text);
  const set = new Set();
  for (let i = 0; i + n <= w.length; i++) set.add(w.slice(i, i + n).join(' '));
  return set;
}

function jaccard(a, b) {
  if (!a.size || !b.size) return 0;
  let inter = 0;
  const [small, big] = a.size < b.size ? [a, b] : [b, a];
  for (const x of small) if (big.has(x)) inter++;
  return inter / (a.size + b.size - inter);
}

/* ------------------------------------------------------------------ crawl */
const report = { base: BASE, generated: new Date().toISOString(), site: [], pages: [], duplicates: [] };

const sitemap = await get('/sitemap.xml');
const urls = [...sitemap.text.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) =>
  new URL(m[1]).pathname.replace(/\/$/, '') || '/',
);

const pages = [];
for (const path of urls) {
  const { status, text: html } = await get(path);
  if (status !== 200) {
    pages.push({ path, status, fail: [`HTTP ${status}`] });
    continue;
  }
  const { text, sentences } = extract(html);
  const title = decode((html.match(/<title>([\s\S]*?)<\/title>/i) ?? [, ''])[1]);
  const desc = decode((html.match(/<meta name="description" content="([^"]*)"/i) ?? [, ''])[1]);
  const imgs = [...html.matchAll(/<img\b[^>]*>/gi)].map((m) => m[0]);
  const links = [...html.matchAll(/href="(\/[^"#?]*)/g)].map((m) => m[1].replace(/\/$/, '') || '/');
  pages.push({
    path,
    status,
    type: pageType(path),
    title,
    desc,
    h1: (html.match(/<h1\b/gi) ?? []).length,
    imgsMissingAlt: imgs.filter((i) => !/\balt="[^"]+"/.test(i)).length,
    links: [...new Set(links)],
    text,
    sentences,
  });
}

/* --------------------------------------------- boilerplate & unique text */
// A sentence on 3+ pages is template text, not page content.
const sentenceCount = new Map();
for (const p of pages) for (const s of new Set(p.sentences ?? [])) sentenceCount.set(s, (sentenceCount.get(s) ?? 0) + 1);

for (const p of pages) {
  if (!p.sentences) continue;
  const unique = p.sentences.filter((s) => (sentenceCount.get(s) ?? 0) < 3);
  p.uniqueText = unique.join(' ');
  p.totalWords = words(p.text).length;
  p.uniqueWords = words(p.uniqueText).length;
  p.hedges = HEDGES.reduce((n, re) => n + (p.text.match(re)?.length ?? 0), 0);
  p.hedgePer1k = p.totalWords ? +(p.hedges / (p.totalWords / 1000)).toFixed(1) : 0;
  p.shingles = shingles(p.uniqueText);
}

/* -------------------------------------------------------- near-duplicates */
const content = pages.filter((p) => p.shingles && p.type !== 'legal');
for (let i = 0; i < content.length; i++) {
  for (let j = i + 1; j < content.length; j++) {
    const sim = jaccard(content[i].shingles, content[j].shingles);
    if (sim > T.maxSimilarity) report.duplicates.push({ a: content[i].path, b: content[j].path, similarity: +sim.toFixed(2) });
  }
}

/* ------------------------------------------------------------ page checks */
const known = new Set(pages.map((p) => p.path));
for (const p of pages) {
  if (p.status !== 200) {
    report.pages.push({ path: p.path, pass: false, fail: p.fail });
    continue;
  }
  const fail = [];
  const min = T.uniqueWords[p.type];
  if (p.uniqueWords < min) fail.push(`thin: ${p.uniqueWords} unique words (need ${min})`);
  if (p.hedgePer1k > T.maxHedgePer1k && p.type !== 'legal') fail.push(`disclaimer-heavy: ${p.hedgePer1k} per 1k words`);
  if (p.title.length > T.titleMax && p.type !== 'article') fail.push(`title ${p.title.length} chars`);
  if (p.desc.length < T.descMin || p.desc.length > T.descMax) fail.push(`description ${p.desc.length} chars`);
  if (p.h1 !== 1) fail.push(`${p.h1} h1 tags`);
  if (p.imgsMissingAlt) fail.push(`${p.imgsMissingAlt} images without alt`);
  const dups = report.duplicates.filter((d) => d.a === p.path || d.b === p.path);
  if (dups.length) fail.push(`near-duplicate of ${dups.map((d) => `${d.a === p.path ? d.b : d.a} (${d.similarity})`).join(', ')}`);
  report.pages.push({
    path: p.path,
    type: p.type,
    totalWords: p.totalWords,
    uniqueWords: p.uniqueWords,
    hedgePer1k: p.hedgePer1k,
    pass: fail.length === 0,
    fail,
  });
}

/* ------------------------------------------------------------ site checks */
const site = (name, pass, detail = '') => report.site.push({ name, pass, detail });

for (const r of REQUIRED_PAGES) site(`required page ${r}`, known.has(r));

const ads = await get('/ads.txt');
site('ads.txt has a real publisher ID', /google\.com,\s*pub-(?!0{16})\d{16},\s*DIRECT/.test(ads.text), ads.text.split('\n').find((l) => l.startsWith('google.com')) ?? 'missing');

const robots = await get('/robots.txt');
site('robots.txt does not block /_next/ or the whole site', !/Disallow:\s*\/(_next\/)?\s*$/m.test(robots.text));

const home = await get('/');
site('AdSense loader in raw HTML', /pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js\?client=ca-pub-\d{16}/.test(home.text));

const allLinks = new Set(pages.flatMap((p) => p.links ?? []));
const broken = [];
for (const l of allLinks) {
  if (known.has(l) || l.startsWith('/_next') || l.startsWith('/images')) continue;
  const { status } = await get(l);
  if (status >= 400) broken.push(`${l} (${status})`);
}
site('no broken internal links', broken.length === 0, broken.join(', '));

// Whole words only, and case-sensitive for code leftovers: "NaN" must not match "financial".
const placeholders = pages.filter(
  (p) => /lorem ipsum|coming soon|under construction/i.test(p.text ?? '') || /\b(TODO|undefined|NaN)\b/.test(p.text ?? ''),
);
site('no placeholder / unfinished text', placeholders.length === 0, placeholders.map((p) => p.path).join(', '));

/* ---------------------------------------------------------------- output */
const failing = report.pages.filter((p) => !p.pass);
const siteFail = report.site.filter((s) => !s.pass);
const score = Math.round(
  (100 * (report.pages.length - failing.length + report.site.length - siteFail.length)) /
    (report.pages.length + report.site.length),
);
report.score = score;

console.log(`\nAdSense readiness audit — ${BASE}`);
console.log(`Pages: ${report.pages.length}  ·  passing: ${report.pages.length - failing.length}  ·  score: ${score}/100\n`);
console.log('SITE CHECKS');
for (const s of report.site) console.log(` ${s.pass ? '✓' : '✗'} ${s.name}${s.detail && !s.pass ? ` — ${s.detail}` : ''}`);
console.log('\nPAGES (unique words / total words / disclaimers per 1k)');
for (const p of [...report.pages].sort((a, b) => (a.uniqueWords ?? 0) - (b.uniqueWords ?? 0))) {
  console.log(
    ` ${p.pass ? '✓' : '✗'} ${String(p.uniqueWords ?? '-').padStart(5)} / ${String(p.totalWords ?? '-').padStart(5)} / ${String(p.hedgePer1k ?? '-').padStart(4)}  ${p.path}${p.fail.length ? `\n      → ${p.fail.join('\n      → ')}` : ''}`,
  );
}
if (report.duplicates.length) {
  console.log('\nNEAR-DUPLICATE PAIRS');
  for (const d of report.duplicates.sort((a, b) => b.similarity - a.similarity)) console.log(`  ${d.similarity}  ${d.a}  ↔  ${d.b}`);
}
if (jsonOut) writeFileSync(jsonOut, JSON.stringify(report, null, 2));
process.exit(failing.length || siteFail.length ? 1 : 0);
