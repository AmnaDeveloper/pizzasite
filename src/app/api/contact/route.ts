import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { CONTACT_EMAIL, SITE_NAME } from '@/lib/site-config';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Contact form handler.
 *
 * Set these environment variables to actually deliver mail (see README):
 *   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, CONTACT_TO
 * With none of them set the route validates the submission and returns success
 * without sending, so the form works in local development.
 */

type Payload = {
  name?: string;
  email?: string;
  topic?: string;
  message?: string;
  /** Honeypot — real users leave this empty. */
  company?: string;
};

/** Very small in-memory rate limit. Per-instance only; adequate for a form. */
const recent = new Map<string, number[]>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const hits = (recent.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  hits.push(now);
  recent.set(key, hits);
  return hits.length > MAX_PER_WINDOW;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(request: Request) {
  let body: Payload;
  try {
    body = (await request.json()) as Payload;
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request body.' }, { status: 400 });
  }

  // Silently accept honeypot submissions so bots do not learn they were caught.
  if (body.company) {
    return NextResponse.json({ ok: true });
  }

  const name = (body.name ?? '').trim();
  const email = (body.email ?? '').trim();
  const topic = (body.topic ?? 'General').trim();
  const message = (body.message ?? '').trim();

  if (!name || name.length > 100) {
    return NextResponse.json(
      { ok: false, error: 'Please enter your name.' },
      { status: 400 },
    );
  }
  if (!EMAIL_RE.test(email) || email.length > 200) {
    return NextResponse.json(
      { ok: false, error: 'Please enter a valid email address.' },
      { status: 400 },
    );
  }
  if (message.length < 10 || message.length > 4000) {
    return NextResponse.json(
      { ok: false, error: 'Please write a message between 10 and 4000 characters.' },
      { status: 400 },
    );
  }

  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    'unknown';

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: 'Too many messages from this connection. Please try later.' },
      { status: 429 },
    );
  }

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, CONTACT_TO } = process.env;

  // No mail transport configured — accept the message so the form is usable in dev.
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    console.info('[contact] SMTP not configured; message accepted but not sent.', {
      topic,
      from: email,
    });
    return NextResponse.json({ ok: true, delivered: false });
  }

  try {
    const port = Number(SMTP_PORT ?? 587);
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port,
      secure: port === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });

    await transporter.sendMail({
      from: `"${SITE_NAME} contact form" <${SMTP_USER}>`,
      to: CONTACT_TO ?? CONTACT_EMAIL,
      replyTo: `"${name}" <${email}>`,
      subject: `[${SITE_NAME}] ${topic} — ${name}`,
      text: [
        `Topic: ${topic}`,
        `From: ${name} <${email}>`,
        `IP: ${ip}`,
        '',
        message,
      ].join('\n'),
    });

    return NextResponse.json({ ok: true, delivered: true });
  } catch (error) {
    console.error('[contact] send failed', error);
    return NextResponse.json(
      { ok: false, error: 'We could not send your message. Please email us directly.' },
      { status: 502 },
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { ok: false, error: 'Method not allowed.' },
    { status: 405, headers: { Allow: 'POST' } },
  );
}
