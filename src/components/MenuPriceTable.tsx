import Link from 'next/link';
import type { MenuCategory, MenuItem } from '@/data/types';
import PriceTag from './PriceTag';

const PIZZA_SIZES = ['Small', 'Medium', 'Large', 'Extra Large'] as const;

function sizeOf(item: MenuItem, sizeName: string) {
  return item.sizes.find((s) => s.name === sizeName) ?? null;
}

/**
 * The full price list, grouped by menu section.
 *
 * Two variants because the menu genuinely has two shapes: pizzas share one size
 * ladder and belong in columns, while everything else has its own size names
 * and reads better as a list inside a single cell. Forcing both into one grid
 * produces a table half full of dashes.
 *
 * Column widths are pinned with <colgroup> rather than left to the browser.
 * Auto layout gives the item name most of the table and scatters the prices, so
 * the eye has to travel to compare two numbers that should sit next to each
 * other. Prices also use tabular-nums so the digits line up column to column.
 */
export default function MenuPriceTable({
  groups,
  variant,
  caption,
}: {
  groups: { category: MenuCategory; items: MenuItem[] }[];
  variant: 'pizza' | 'other';
  caption: string;
}) {
  const isPizza = variant === 'pizza';
  const columns = isPizza ? PIZZA_SIZES.length + 2 : 3;

  return (
    <div className="table-scroll overflow-hidden rounded-card border border-line">
      <table className="w-full min-w-[40rem] table-fixed text-[15px]">
        <caption className="sr-only">{caption}</caption>

        <colgroup>
          {isPizza ? (
            <>
              <col className="w-[32%]" />
              <col className="w-[15%]" />
              <col className="w-[15%]" />
              <col className="w-[15%]" />
              <col className="w-[15%]" />
              <col className="w-[8%]" />
            </>
          ) : (
            <>
              <col className="w-[30%]" />
              <col className="w-[58%]" />
              <col className="w-[12%]" />
            </>
          )}
        </colgroup>

        <thead>
          <tr className="bg-navy text-left text-[11px] uppercase tracking-wide text-white">
            <th scope="col" className="px-4 py-3 font-bold">
              Item
            </th>
            {isPizza ? (
              PIZZA_SIZES.map((size) => (
                <th key={size} scope="col" className="px-3 py-3 text-right font-bold">
                  {size === 'Extra Large' ? 'X-Large' : size}
                </th>
              ))
            ) : (
              <th scope="col" className="px-4 py-3 font-bold">
                Sizes & prices
              </th>
            )}
            <th scope="col" className="px-4 py-3 text-right font-bold">
              Cal
            </th>
          </tr>
        </thead>

        <tbody>
          {groups.map((group) => (
            <CategoryGroup
              key={group.category}
              category={group.category}
              columns={columns}
            >
              {group.items.map((item, i) => (
                <tr
                  key={item.id}
                  className={`border-t border-line transition-colors hover:bg-navy-soft ${
                    i % 2 === 1 ? 'bg-surface-alt' : 'bg-surface'
                  }`}
                >
                  <th scope="row" className="px-4 py-3 text-left font-semibold">
                    <Link
                      href={`/menus-prices/${item.slug}`}
                      className="text-ink hover:text-brand hover:underline"
                    >
                      {item.title}
                    </Link>
                  </th>

                  {isPizza ? (
                    PIZZA_SIZES.map((size) => {
                      const s = sizeOf(item, size);
                      return (
                        <td
                          key={size}
                          className={`px-3 py-3 text-right ${s ? 'font-extrabold text-brand' : 'text-line'}`}
                        >
                          {s ? <PriceTag price={s.price} verified={s.verified} /> : '—'}
                        </td>
                      );
                    })
                  ) : (
                    <td className="px-4 py-3 text-[14px] text-ink-muted">
                      {/* Same price for every option (e.g. five soda flavours): one line. */}
                      {item.sizes.length > 1 &&
                      item.sizes.every((s) => s.price === item.sizes[0].price && s.verified === item.sizes[0].verified) ? (
                        <span>
                          {item.sizes.length} options{' '}
                          <PriceTag
                            price={item.sizes[0].price}
                            verified={item.sizes[0].verified}
                            className="font-extrabold text-brand"
                          />
                          <span className="block text-[12px]">{item.sizes.map((s) => s.name).join(', ')}</span>
                        </span>
                      ) : (
                        item.sizes.map((size, si) => (
                          <span key={size.name} className="whitespace-nowrap">
                            {si > 0 ? <span className="px-2 text-line">·</span> : null}
                            {size.name}{' '}
                            <PriceTag price={size.price} verified={size.verified} className="font-extrabold text-brand" />
                          </span>
                        ))
                      )}
                    </td>
                  )}

                  <td className="px-4 py-3 text-right tabular-nums text-ink-muted">
                    {item.calories}
                  </td>
                </tr>
              ))}
            </CategoryGroup>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** A category label row followed by that category's items. */
function CategoryGroup({
  category,
  columns,
  children,
}: {
  category: MenuCategory;
  columns: number;
  children: React.ReactNode;
}) {
  return (
    <>
      <tr className="border-t border-line bg-navy-soft">
        <th
          scope="colgroup"
          colSpan={columns}
          className="px-4 py-2 text-left text-[11px] font-bold uppercase tracking-wide text-navy-dark"
        >
          {category}
        </th>
      </tr>
      {children}
    </>
  );
}
