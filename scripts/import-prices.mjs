#!/usr/bin/env node
/**
 * Phase 2 of ADSENSE-READINESS.md: replace estimated prices with prices
 * checked at one real store.
 *
 *   npm run prices:template   writes data/price-check.csv (current estimates)
 *   npm run prices:import     reads it back: every row with a checked_price is
 *                             written to menu-items.json and marked verified;
 *                             empty rows stay estimates
 *
 * The store and date must match PRICE_SOURCE in site-config.ts (one store,
 * one check date for the whole site). The import refuses to run if they are
 * missing — the site must never say "checked" for a price nobody checked.
 */
import { readFileSync, writeFileSync } from 'node:fs';

const MENU = 'src/data/menu-items.json';
const CSV = 'data/price-check.csv';
const CONFIG = 'src/lib/site-config.ts';

const menu = JSON.parse(readFileSync(MENU, 'utf8'));
const mode = process.argv[2];

const quote = (s) => (/[",]/.test(s) ? `"${String(s).replace(/"/g, '""')}"` : String(s));

function parseLine(line) {
  const out = [];
  let cur = '';
  let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (inQ) {
      if (c === '"' && line[i + 1] === '"') (cur += '"'), i++;
      else if (c === '"') inQ = false;
      else cur += c;
    } else if (c === '"') inQ = true;
    else if (c === ',') out.push(cur), (cur = '');
    else cur += c;
  }
  out.push(cur);
  return out.map((s) => s.trim());
}

if (mode === 'template') {
  const lines = [
    '# Price check sheet. Fill in the store and checked_on lines, then any checked_price you have; blank rows stay estimates.',
    '# Open dominos.com, enter your ZIP, choose Carryout and copy each menu price. No order is needed.',
    '# real_name: the name the official menu uses, if different (leave blank if the same). Use the same name on every size row.',
    `store,${quote("a Domino's store in CITY, STATE (ZIP 00000)")}`,
    'checked_on,YYYY-MM-DD',
    '',
    'slug,item,size,detail,current_price,already_checked,checked_price,real_name',
  ];
  for (const item of menu)
    for (const s of item.sizes)
      lines.push([item.slug, item.title, s.name, s.detail, s.price.toFixed(2), s.verified ? 'yes' : 'no', '', ''].map(quote).join(','));
  writeFileSync(CSV, lines.join('\n') + '\n');
  console.log(`Wrote ${CSV} with ${lines.length - 7} rows to fill in.`);
  process.exit(0);
}

if (mode !== 'import') {
  console.log('Usage: node scripts/import-prices.mjs template|import');
  process.exit(1);
}

const rows = readFileSync(CSV, 'utf8').split('\n').filter((l) => l.trim() && !l.startsWith('#'));
const meta = Object.fromEntries(rows.filter((l) => /^(store|checked_on),/.test(l)).map(parseLine));
const errors = [];

if (!meta.store || /CITY|00000/.test(meta.store)) errors.push('Fill in the "store" line with the real store and ZIP.');
if (!/^\d{4}-\d{2}-\d{2}$/.test(meta.checked_on ?? '')) errors.push('Fill in "checked_on" as YYYY-MM-DD.');

const header = rows.findIndex((l) => l.startsWith('slug,'));
const updates = rows.slice(header + 1).map(parseLine);
let imported = 0;
for (const [slug, , size, , , , checked, realName] of updates) {
  const item = menu.find((m) => m.slug === slug);
  const s = item?.sizes.find((x) => x.name === size);
  if (!item || !s) errors.push(`Unknown row: ${slug} / ${size}`);
  else if (!checked) continue; // blank: stays as it is
  else if (!/^\d+(\.\d{1,2})?$/.test(checked)) errors.push(`Invalid price: ${slug} / ${size}`);
  else {
    s.price = Number(checked);
    s.verified = true;
    imported++;
    if (realName) item.title = realName;
  }
}

if (errors.length) {
  console.error(`Not imported — fix these first:\n - ${errors.join('\n - ')}`);
  process.exit(1);
}

// Item "from" price follows its cheapest size.
for (const item of menu) item.price = Math.min(...item.sizes.map((s) => s.price));
writeFileSync(MENU, JSON.stringify(menu, null, 2) + '\n');

const config = readFileSync(CONFIG, 'utf8');
if (!config.includes(meta.checked_on)) {
  console.warn(`Note: PRICE_SOURCE.checkedOn in ${CONFIG} is not ${meta.checked_on}. Update the store and date there so every page names the right check.`);
}
console.log(`Imported ${imported} checked prices from ${meta.store} (${meta.checked_on}). Blank rows were left as they were.`);
console.log('Next: also check the deal prices on /coupons (src/data/coupons.ts) against the same store.');
