'use client';

import { useEffect, useRef, useState } from 'react';
import { CalendarPlus, ChevronDown, Download, ExternalLink } from 'lucide-react';
import type { SalemEvent } from '@/data/events';
import { downloadIcsFile, googleCalendarUrl, outlookCalendarUrl } from '@/lib/calendar';

export function AddToCalendar({ event, variant = 'solid' }: { event: SalemEvent; variant?: 'solid' | 'outline' }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  const buttonClass =
    variant === 'solid'
      ? 'bg-terracotta text-white hover:bg-terracotta-dark'
      : 'border border-ink/15 text-ink hover:border-terracotta hover:text-terracotta';

  return (
    <div className="relative inline-block" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition ${buttonClass}`}
        aria-haspopup="true"
        aria-expanded={open}
      >
        <CalendarPlus size={16} />
        Add to Calendar
        <ChevronDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-30 mt-2 w-60 overflow-hidden rounded-2xl border border-ink/10 bg-white py-1.5 shadow-panel">
          <a
            href={googleCalendarUrl(event)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-4 py-2.5 text-sm text-ink transition hover:bg-sand"
          >
            Google Calendar
            <ExternalLink size={13} className="text-ink-faint" />
          </a>
          <a
            href={outlookCalendarUrl(event)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-4 py-2.5 text-sm text-ink transition hover:bg-sand"
          >
            Outlook Calendar
            <ExternalLink size={13} className="text-ink-faint" />
          </a>
          <button
            type="button"
            onClick={() => {
              downloadIcsFile(event);
              setOpen(false);
            }}
            className="flex w-full items-center justify-between px-4 py-2.5 text-left text-sm text-ink transition hover:bg-sand"
          >
            Apple / Outlook file (.ics)
            <Download size={13} className="text-ink-faint" />
          </button>
        </div>
      )}
    </div>
  );
}
