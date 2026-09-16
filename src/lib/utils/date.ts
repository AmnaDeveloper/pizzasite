/** Date helpers. Everything renders on the server, so output is stable per build/ISR cycle. */

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const;

/** "March 2026" — used in titles and "Last updated" lines. */
export function currentMonthYear(date: Date = new Date()): string {
  return `${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

export function currentYear(date: Date = new Date()): number {
  return date.getFullYear();
}

/** "March 14, 2026" — human readable, used in bylines and article headers. */
export function formatLongDate(input: string | Date): string {
  const d = typeof input === 'string' ? new Date(input) : input;
  if (Number.isNaN(d.getTime())) return '';
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
}

/** "2026-03-14" — machine readable for <time dateTime> and JSON-LD. */
export function toIsoDate(input: string | Date): string {
  const d = typeof input === 'string' ? new Date(input) : input;
  if (Number.isNaN(d.getTime())) return '';
  return d.toISOString().split('T')[0];
}

/** "3 days ago" / "2 months ago" — freshness signal on index cards. */
export function relativeAge(input: string | Date, now: Date = new Date()): string {
  const d = typeof input === 'string' ? new Date(input) : input;
  if (Number.isNaN(d.getTime())) return '';
  const days = Math.floor((now.getTime() - d.getTime()) / 86_400_000);
  if (days <= 0) return 'today';
  if (days === 1) return 'yesterday';
  if (days < 30) return `${days} days ago`;
  const months = Math.round(days / 30);
  if (months < 12) return `${months} month${months === 1 ? '' : 's'} ago`;
  const years = Math.round(days / 365);
  return `${years} year${years === 1 ? '' : 's'} ago`;
}

/**
 * Replaces the literal token {{MONTH_YEAR}} in stored content with the current
 * month and year. Lets a data file say "prices checked {{MONTH_YEAR}}" without
 * anyone having to hand-edit it every month.
 */
export function withCurrentMonthYear(text: string): string {
  return text.replaceAll('{{MONTH_YEAR}}', currentMonthYear()).replaceAll(
    '{{YEAR}}',
    String(currentYear()),
  );
}

export function sortByDateDesc<T extends { datePublished: string }>(items: T[]): T[] {
  return [...items].sort(
    (a, b) => new Date(b.datePublished).getTime() - new Date(a.datePublished).getTime(),
  );
}
