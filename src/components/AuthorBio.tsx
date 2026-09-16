import Image from 'next/image';
import Link from 'next/link';
import { BadgeCheck } from 'lucide-react';
import type { Author } from '@/data/types';

/**
 * Author card used at the foot of every article and on the team page.
 * Exists for E-E-A-T: readers should be able to see who wrote a guide and
 * what qualifies them to have written it.
 */
export default function AuthorBio({
  author,
  variant = 'compact',
}: {
  author: Author;
  variant?: 'compact' | 'full';
}) {
  return (
    <section
      id={author.slug}
      aria-label={`About ${author.name}`}
      className="scroll-mt-28 rounded-card border border-line bg-surface-alt p-5 sm:p-6"
    >
      <div className="flex flex-col gap-5 sm:flex-row">
        <Image
          src={author.avatar}
          alt={author.avatarAlt}
          width={96}
          height={96}
          className="h-20 w-20 shrink-0 rounded-full object-cover sm:h-24 sm:w-24"
        />
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <h2 className="text-lg font-extrabold text-ink">{author.name}</h2>
            <span className="inline-flex items-center gap-1 rounded-full bg-navy-soft px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-navy-dark">
              <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
              {author.role}
            </span>
          </div>

          <p className="mt-2 text-[15px] leading-relaxed text-ink-muted">{author.bio}</p>

          {variant === 'full' ? (
            <p className="mt-3 border-l-2 border-brand pl-3 text-[15px] leading-relaxed text-ink-muted">
              <strong className="text-ink">Why you can trust them: </strong>
              {author.credentials}
            </p>
          ) : null}

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
            <Link href="/team" className="font-semibold text-navy hover:text-brand">
              More from our team
            </Link>
            {author.email ? (
              <a
                href={`mailto:${author.email}`}
                className="text-ink-muted hover:text-navy"
              >
                {author.email}
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
