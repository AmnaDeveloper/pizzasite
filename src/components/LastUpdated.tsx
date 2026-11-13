import { CalendarCheck } from 'lucide-react';
import { formatLongDate, toIsoDate } from '@/lib/utils/date';

/**
 * Visible "last updated" line. The date is required and must be the day the
 * page's content really changed — a date that moves on its own every month is
 * fake freshness, which search engines and ad reviewers treat as a spam signal.
 */
export default function LastUpdated({
  date,
  label = 'Last updated',
  className = '',
}: {
  date: string;
  label?: string;
  className?: string;
}) {
  const iso = toIsoDate(date);
  const display = formatLongDate(date);

  return (
    <p
      className={`inline-flex items-center gap-1.5 text-[13px] font-medium text-ink-muted ${className}`}
    >
      <CalendarCheck className="h-4 w-4 text-navy" aria-hidden="true" />
      <span>
        {label}:{' '}
        <time dateTime={iso}>{display}</time>
      </span>
    </p>
  );
}
