import type { MenuItem } from '@/data/types';
import MenuItemCard from './MenuItemCard';
import PriceNote from './PriceNote';
import SectionHeading from './SectionHeading';

/**
 * Reusable "here is a slice of the menu" block. Used on the homepage and at
 * the foot of category pages so every menu item has multiple internal links
 * pointing at it.
 */
export default function MenuGuideSection({
  items,
  eyebrow = 'Menu & prices',
  title = 'Menu items and example prices',
  intro,
  ctaHref = '/menus-prices',
  ctaLabel = 'See the full menu guide',
  headingId = 'menu-guide',
  prioritiseFirstImage = false,
}: {
  items: MenuItem[];
  eyebrow?: string;
  title?: string;
  intro?: string;
  ctaHref?: string;
  ctaLabel?: string;
  headingId?: string;
  prioritiseFirstImage?: boolean;
}) {
  if (!items.length) return null;

  return (
    <section aria-labelledby={headingId} className="border-t border-line">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <SectionHeading
          id={headingId}
          eyebrow={eyebrow}
          title={title}
          intro={intro}
          ctaHref={ctaHref}
          ctaLabel={ctaLabel}
        />

        <PriceNote className="mt-6 max-w-2xl" />

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => (
            <MenuItemCard
              key={item.id}
              item={item}
              priority={prioritiseFirstImage && i === 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
