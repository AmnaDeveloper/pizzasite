import { CalendarCheck } from 'lucide-react';
import { currentMonthYear, formatLongDate, toIsoDate } from '@/lib/utils/date';

/**
 * Visible freshness signal. With no `date` prop it falls back to the current
 * month and year, which is what index and evergreen pages use.
 */
export default function LastUpdated({
  date,
  label = 'Last updated',
  className = '',
}: {
  date?: string;
  label?: string;
  className?: string;
}) {
  const iso = date ? toIsoDate(date) : undefined;
  const display = date ? formatLongDate(date) : currentMonthYear();

  return (
    <p
      className={`inline-flex items-center gap-1.5 text-[13px] font-medium text-ink-muted ${className}`}
    >
      <CalendarCheck className="h-4 w-4 text-navy" aria-hidden="true" />
      <span>
        {label}:{' '}
        {iso ? <time dateTime={iso}>{display}</time> : <span>{display}</span>}
      </span>
    </p>
  );
}
