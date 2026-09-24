import type { MenuItem } from '@/data/types';
import { CURRENCY_SYMBOL } from '@/lib/site-config';

/** Diameters in inches for the shared pizza size ladder. */
const DIAMETERS: Record<string, number> = {
  Small: 10,
  Medium: 12,
  Large: 14,
  'Extra Large': 16,
};

export type SizeValueRow = {
  size: string;
  diameter: number;
  area: number;
  price: number;
  slices?: number;
  /** Cents per square inch. */
  centsPerSqIn: number;
};

/**
 * Price per square inch for each size of one pizza, computed from the menu
 * data. This is the site's own analysis rather than a restated price list —
 * the kind of original number that competitors' menu copies don't carry.
 */
export function sizeValueRows(item: MenuItem): SizeValueRow[] {
  return item.sizes
    .filter((s) => DIAMETERS[s.name])
    .map((s) => {
      const diameter = DIAMETERS[s.name];
      const area = Math.PI * (diameter / 2) ** 2;
      return {
        size: s.name,
        diameter,
        area,
        price: s.price,
        slices: s.slices,
        centsPerSqIn: (s.price / area) * 100,
      };
    });
}

/**
 * Table first (it is the accessible, crawlable version of the data), with an
 * inline bar in the last column so the downward trend reads at a glance. On
 * phones the area column and bars drop out so the answer column never scrolls
 * off-screen. The cheapest row per square inch is flagged in brand red.
 */
export default function SizeValueChart({ item }: { item: MenuItem }) {
  const rows = sizeValueRows(item);
  if (!rows.length) return null;

  const max = Math.max(...rows.map((r) => r.centsPerSqIn));
  const best = Math.min(...rows.map((r) => r.centsPerSqIn));

  return (
    <div className="table-scroll self-start overflow-hidden rounded-card border border-line bg-surface">
      <table className="w-full text-[15px]">
        <caption className="sr-only">
          Example price per square inch for a {item.title.toLowerCase()} by size
        </caption>
        <thead>
          <tr className="bg-navy text-left text-[11px] uppercase tracking-wide text-white">
            <th scope="col" className="px-4 py-3 font-bold">Size</th>
            <th scope="col" className="hidden px-3 py-3 text-right font-bold sm:table-cell">Area</th>
            <th scope="col" className="px-3 py-3 text-right font-bold">Price</th>
            <th scope="col" className="px-4 py-3 text-right font-bold sm:w-[42%] sm:text-left">Per sq inch</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {rows.map((r) => {
            const isBest = r.centsPerSqIn === best;
            return (
              <tr key={r.size} className={isBest ? 'bg-brand-soft/60' : undefined}>
                <th scope="row" className="whitespace-nowrap px-4 py-3.5 text-left font-semibold text-ink">
                  {r.size}
                  <span className="ml-1.5 text-[13px] font-medium text-ink-muted">
                    {r.diameter}&Prime;
                  </span>
                </th>
                <td className="hidden whitespace-nowrap px-3 py-3.5 text-right tabular-nums text-ink-muted sm:table-cell">
                  {Math.round(r.area)} sq in
                </td>
                <td className="px-3 py-3.5 text-right font-bold tabular-nums text-ink">
                  {CURRENCY_SYMBOL}
                  {r.price.toFixed(2)}
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-3">
                    <span className="hidden h-2.5 flex-1 overflow-hidden rounded-full bg-navy-soft sm:block">
                      <span
                        className={`block h-full rounded-full ${isBest ? 'bg-brand' : 'bg-navy'}`}
                        style={{ width: `${(r.centsPerSqIn / max) * 100}%` }}
                      />
                    </span>
                    <span
                      className={`ml-auto shrink-0 whitespace-nowrap text-right sm:w-24 font-extrabold tabular-nums ${
                        isBest ? 'text-brand' : 'text-ink'
                      }`}
                    >
                      {r.centsPerSqIn.toFixed(1)}¢
                      {isBest ? (
                        <span className="ml-1 text-[11px] font-bold uppercase">best</span>
                      ) : null}
                    </span>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
