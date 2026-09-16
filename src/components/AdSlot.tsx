import { ADSENSE_PUB_ID } from '@/lib/site-config';

/**
 * Reserved advertising slot.
 *
 * Renders nothing at all until ADSENSE_PUB_ID is configured, which keeps the
 * pre-approval site free of empty ad boxes. Once the publisher ID is set, the
 * slot reserves its own height so filling it does not shift the layout.
 */
export default function AdSlot({
  slotId,
  label = 'Advertisement',
  minHeight = 280,
  className = '',
}: {
  slotId?: string;
  label?: string;
  minHeight?: number;
  className?: string;
}) {
  if (!ADSENSE_PUB_ID) return null;

  return (
    <aside
      aria-label={label}
      className={`mx-auto w-full max-w-6xl px-4 ${className}`}
      style={{ minHeight }}
    >
      <p className="mb-1 text-center text-[11px] uppercase tracking-wide text-ink-muted">
        {label}
      </p>
      <ins
        className="adsbygoogle block"
        style={{ display: 'block', minHeight }}
        data-ad-client={ADSENSE_PUB_ID}
        data-ad-slot={slotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </aside>
  );
}
