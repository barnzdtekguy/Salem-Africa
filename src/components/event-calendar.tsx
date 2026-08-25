'use client';

import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { SalemEvent } from '@/data/events';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function dayKey(d: Date) {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

export function EventCalendar({
  events,
  selected,
  onSelect,
}: {
  events: SalemEvent[];
  selected: Date | null;
  onSelect: (date: Date | null) => void;
}) {
  const [viewDate, setViewDate] = useState(() => {
    const now = new Date();
    const upcoming = events.find((e) => new Date(e.startDateTime) >= now);
    return upcoming ? new Date(upcoming.startDateTime) : now;
  });

  const eventsByDay = useMemo(() => {
    const map = new Map<string, SalemEvent[]>();
    events.forEach((e) => {
      const key = dayKey(new Date(e.startDateTime));
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(e);
    });
    return map;
  }, [events]);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstOfMonth = new Date(year, month, 1);
  const startWeekday = firstOfMonth.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  const cells: (Date | null)[] = [];
  for (let i = 0; i < startWeekday; i += 1) cells.push(null);
  for (let d = 1; d <= daysInMonth; d += 1) cells.push(new Date(year, month, d));

  return (
    <div className="rounded-2xl border border-ink/[0.08] bg-white p-5 shadow-soft sm:p-6">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg text-ink">
          {viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h3>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            aria-label="Previous month"
            onClick={() => setViewDate(new Date(year, month - 1, 1))}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-ink/10 text-ink transition hover:border-terracotta hover:text-terracotta"
          >
            <ChevronLeft size={15} />
          </button>
          <button
            type="button"
            aria-label="Next month"
            onClick={() => setViewDate(new Date(year, month + 1, 1))}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-ink/10 text-ink transition hover:border-terracotta hover:text-terracotta"
          >
            <ChevronRight size={15} />
          </button>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-7 gap-1 text-center">
        {WEEKDAYS.map((w) => (
          <div key={w} className="pb-1 font-label text-[10px] font-semibold uppercase tracking-wide text-ink-faint">
            {w}
          </div>
        ))}
        {cells.map((date, i) => {
          if (!date) return <div key={`empty-${i}`} />;
          const dayEvents = eventsByDay.get(dayKey(date)) ?? [];
          const hasEvents = dayEvents.length > 0;
          const isToday = isSameDay(date, today);
          const isSelected = selected !== null && isSameDay(date, selected);

          return (
            <button
              key={dayKey(date)}
              type="button"
              disabled={!hasEvents}
              onClick={() => onSelect(isSelected ? null : date)}
              aria-pressed={isSelected}
              aria-label={hasEvents ? `${date.toDateString()}: ${dayEvents.length} event(s)` : date.toDateString()}
              className={`relative flex aspect-square flex-col items-center justify-center gap-0.5 rounded-lg font-label text-xs transition ${
                isSelected
                  ? 'bg-terracotta text-white'
                  : hasEvents
                  ? 'bg-terracotta-soft text-terracotta hover:bg-terracotta hover:text-white'
                  : 'cursor-default text-ink-muted/40'
              } ${isToday && !isSelected ? 'ring-1 ring-inset ring-gold' : ''}`}
            >
              {date.getDate()}
              {hasEvents && <span className={`h-1 w-1 rounded-full ${isSelected ? 'bg-white' : 'bg-terracotta'}`} />}
            </button>
          );
        })}
      </div>

      {selected && (
        <button
          type="button"
          onClick={() => onSelect(null)}
          className="mt-4 text-xs font-semibold text-terracotta transition hover:text-terracotta-dark"
        >
          Clear date filter ×
        </button>
      )}

      <div className="mt-5 flex items-center gap-4 border-t border-ink/[0.06] pt-4 text-[11px] text-ink-muted">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-terracotta-soft ring-1 ring-terracotta/40" /> Has events
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full ring-1 ring-gold" /> Today
        </span>
      </div>
    </div>
  );
}
