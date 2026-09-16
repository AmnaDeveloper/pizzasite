import Image from 'next/image';
import Link from 'next/link';
import { Star } from 'lucide-react';
import type { MenuItem } from '@/data/types';
import { CURRENCY_SYMBOL } from '@/lib/site-config';

/**
 * The shared card shape. MenuItemCard and PostCard are deliberately built to
 * identical proportions — same 16:10 image, same padding, same type scale, same
 * bordered meta row — so a grid of either reads as the same component.
 */
export default function MenuItemCard({
  item,
  priority = false,
}: {
  item: MenuItem;
  priority?: boolean;
}) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-card border border-line bg-surface transition-colors hover:border-navy">
      <Link href={`/menus-prices/${item.slug}`} className="relative block aspect-[16/10]">
        <Image
          src={item.image}
          alt={item.imageAlt}
          fill
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover"
        />
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-[11px] font-bold uppercase tracking-wide text-navy">
          {item.category}
        </p>
        {/* Single-line clamps — see the note in PostCard. */}
        <h3 className="mt-1.5 line-clamp-1 text-[17px] font-extrabold leading-snug text-ink">
          <Link href={`/menus-prices/${item.slug}`} className="hover:text-brand">
            {item.title}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-1 flex-1 text-[14px] leading-relaxed text-ink-muted">
          {item.description}
        </p>

        <div className="mt-4 flex items-center justify-between gap-3 border-t border-line pt-3">
          <p className="text-[17px] font-extrabold text-brand">
            {CURRENCY_SYMBOL}
            {item.price.toFixed(2)}
            <span className="ml-1 text-[12px] font-medium text-ink-muted">example</span>
          </p>
          <p className="inline-flex items-center gap-1 text-[13px] font-semibold text-ink-muted">
            <Star className="h-3.5 w-3.5 fill-brand text-brand" aria-hidden="true" />
            {item.rating.toFixed(1)}
          </p>
        </div>
      </div>
    </article>
  );
}
