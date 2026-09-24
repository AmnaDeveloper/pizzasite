import Image from 'next/image';
import Link from 'next/link';
import type { Post } from '@/data/types';
import { formatLongDate, toIsoDate } from '@/lib/utils/date';

/** Built to the same proportions as MenuItemCard — see the note there. */
export default function PostCard({
  post,
  priority = false,
}: {
  post: Post;
  priority?: boolean;
}) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-card border border-line bg-surface transition-colors hover:border-navy">
      <Link href={`/posts/${post.slug}`} className="relative block aspect-[16/10]">
        <Image
          src={post.image}
          alt={post.imageAlt}
          fill
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover"
        />
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-[11px] font-bold uppercase tracking-wide text-navy">
          {post.category}
        </p>
        {/* Title and excerpt are each clamped to two lines so every card in
            a row is exactly the same height. Switch to line-clamp-1 for a denser
            grid if titles are short. */}
        <h3 className="mt-1.5 line-clamp-2 min-h-[2.75em] text-[17px] font-extrabold leading-snug text-ink">
          <Link href={`/posts/${post.slug}`} className="hover:text-brand">
            {post.title}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-2 flex-1 text-[14px] leading-relaxed text-ink-muted">
          {post.excerpt}
        </p>

        <div className="mt-4 flex items-center justify-between gap-3 border-t border-line pt-3 text-[13px] text-ink-muted">
          <time dateTime={toIsoDate(post.dateModified)}>
            {formatLongDate(post.dateModified)}
          </time>
          <span>{post.readTime} min read</span>
        </div>
      </div>
    </article>
  );
}
