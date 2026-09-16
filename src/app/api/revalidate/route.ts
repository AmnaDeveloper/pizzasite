import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * On-demand revalidation. Lets you push a price change live without a full
 * redeploy: update the data file, deploy, then hit this endpoint for the
 * affected path.
 *
 *   curl -X POST "https://example.com/api/revalidate?path=/menus-prices" \
 *        -H "x-revalidate-secret: $REVALIDATE_SECRET"
 *
 * Requires REVALIDATE_SECRET to be set; without it the route refuses every
 * request rather than defaulting to open.
 */
export async function POST(request: Request) {
  const secret = process.env.REVALIDATE_SECRET;

  if (!secret) {
    return NextResponse.json(
      { ok: false, error: 'Revalidation is not configured on this deployment.' },
      { status: 503 },
    );
  }

  const provided =
    request.headers.get('x-revalidate-secret') ??
    new URL(request.url).searchParams.get('secret');

  if (provided !== secret) {
    return NextResponse.json({ ok: false, error: 'Unauthorised.' }, { status: 401 });
  }

  const path = new URL(request.url).searchParams.get('path') ?? '/';

  if (!path.startsWith('/')) {
    return NextResponse.json(
      { ok: false, error: 'Path must start with a slash.' },
      { status: 400 },
    );
  }

  try {
    revalidatePath(path);
    return NextResponse.json({ ok: true, revalidated: path, at: Date.now() });
  } catch (error) {
    console.error('[revalidate] failed', error);
    return NextResponse.json(
      { ok: false, error: 'Revalidation failed.' },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { ok: false, error: 'Method not allowed.' },
    { status: 405, headers: { Allow: 'POST' } },
  );
}
