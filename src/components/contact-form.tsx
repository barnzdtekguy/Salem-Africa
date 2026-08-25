'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';

const CATEGORIES = ['Prayer Request', 'General Inquiry', 'Counseling'];

export function ContactForm() {
  const [category, setCategory] = useState(CATEGORIES[1]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = String(form.get('name') ?? '');
    const email = String(form.get('email') ?? '');
    const message = String(form.get('message') ?? '');

    const subject = encodeURIComponent(`[${category}] Message from ${name}`);
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
    window.location.href = `mailto:info@salemafrica.placeholder.org?subject=${subject}&body=${body}`;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="mb-1.5 block text-xs font-medium text-ink-muted">Full Name</label>
        <input
          id="name"
          name="name"
          type="text"
          required
          placeholder="Your name"
          className="w-full rounded-lg border border-ink/10 bg-white px-4 py-3 text-sm text-ink placeholder:text-ink-faint focus:border-terracotta focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-ink-muted">Email Address</label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="you@example.com"
          className="w-full rounded-lg border border-ink/10 bg-white px-4 py-3 text-sm text-ink placeholder:text-ink-faint focus:border-terracotta focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="category" className="mb-1.5 block text-xs font-medium text-ink-muted">Select Category</label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full rounded-lg border border-ink/10 bg-white px-4 py-3 text-sm text-ink focus:border-terracotta focus:outline-none"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="message" className="mb-1.5 block text-xs font-medium text-ink-muted">Message</label>
        <textarea
          id="message"
          name="message"
          required
          rows={4}
          placeholder="How can we help?"
          className="w-full rounded-lg border border-ink/10 bg-white px-4 py-3 text-sm text-ink placeholder:text-ink-faint focus:border-terracotta focus:outline-none"
        />
      </div>

      <button
        type="submit"
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-terracotta px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-terracotta-dark"
      >
        Send Message
        <Send size={15} />
      </button>
    </form>
  );
}
