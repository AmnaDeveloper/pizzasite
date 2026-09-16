'use client';

import { useState, type FormEvent } from 'react';
import { Send, CheckCircle2, AlertTriangle } from 'lucide-react';

type Status = 'idle' | 'sending' | 'sent' | 'error';

const TOPICS = [
  'Price correction',
  'Content feedback',
  'Broken link or error',
  'Advertising enquiry',
  'Something else',
] as const;

export default function ContactForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('sending');
    setMessage('');

    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const body = (await res.json()) as { ok?: boolean; error?: string };

      if (!res.ok || !body.ok) {
        setStatus('error');
        setMessage(body.error ?? 'Something went wrong. Please try again.');
        return;
      }

      setStatus('sent');
      setMessage('Thanks — your message reached us. We reply to most within two days.');
      form.reset();
    } catch {
      setStatus('error');
      setMessage('We could not reach the server. Please check your connection and retry.');
    }
  }

  const inputClass =
    'mt-1.5 w-full rounded-md border border-line bg-surface px-3.5 py-2.5 text-[15px] text-ink placeholder:text-ink-muted/70 focus:border-navy';

  return (
    <form onSubmit={onSubmit} className="rounded-card border border-line bg-surface p-5 sm:p-6">
      {/* Honeypot: real people never fill this in, bots usually do. */}
      <div aria-hidden="true" className="absolute left-[-9999px]">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="text-sm font-bold text-ink">
            Your name <span className="text-brand">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            maxLength={100}
            autoComplete="name"
            className={inputClass}
            placeholder="Jordan Alvarez"
          />
        </div>
        <div>
          <label htmlFor="email" className="text-sm font-bold text-ink">
            Email address <span className="text-brand">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            maxLength={200}
            autoComplete="email"
            className={inputClass}
            placeholder="you@example.com"
          />
        </div>
      </div>

      <div className="mt-4">
        <label htmlFor="topic" className="text-sm font-bold text-ink">
          What is this about?
        </label>
        <select id="topic" name="topic" className={inputClass} defaultValue={TOPICS[0]}>
          {TOPICS.map((topic) => (
            <option key={topic} value={topic}>
              {topic}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4">
        <label htmlFor="message" className="text-sm font-bold text-ink">
          Message <span className="text-brand">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          minLength={10}
          maxLength={4000}
          className={inputClass}
          placeholder="If you are reporting a price that has changed, telling us the city and the item helps us verify it quickly."
        />
        <p className="mt-1.5 text-[13px] text-ink-muted">
          Please do not include payment details or anything sensitive. We only use your
          email to reply to this message.
        </p>
      </div>

      <button
        type="submit"
        disabled={status === 'sending'}
        className="mt-5 inline-flex items-center gap-2 rounded-md bg-brand px-5 py-3 text-base font-bold text-white transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Send className="h-4 w-4" aria-hidden="true" />
        {status === 'sending' ? 'Sending…' : 'Send message'}
      </button>

      <div aria-live="polite" className="mt-4">
        {status === 'sent' ? (
          <p className="flex items-start gap-2 rounded-md bg-navy-soft px-3 py-2.5 text-sm font-medium text-navy-dark">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            {message}
          </p>
        ) : null}
        {status === 'error' ? (
          <p className="flex items-start gap-2 rounded-md bg-brand-soft px-3 py-2.5 text-sm font-medium text-brand-dark">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            {message}
          </p>
        ) : null}
      </div>
    </form>
  );
}
