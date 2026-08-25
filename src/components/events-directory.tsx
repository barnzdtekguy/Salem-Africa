'use client';

import { useMemo, useState } from 'react';
import { Clock, MapPin, X, ArrowRight } from 'lucide-react';
import type { SalemEvent } from '@/data/events';
import { ImageWithFallback } from '@/components/image-with-fallback';
import { EventCalendar } from '@/components/event-calendar';
import { AddToCalendar } from '@/components/add-to-calendar';
import { Reveal } from '@/components/reveal';
import { formatEventDateLabel, formatEventTimeLabel } from '@/lib/calendar';

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function EventCard({ event, onOpen }: { event: SalemEvent; onOpen: (e: SalemEvent) => void }) {
  const start = new Date(event.startDateTime);
  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-ink/[0.07] bg-white shadow-soft transition hover:shadow-hover">
      <button type="button" onClick={() => onOpen(event)} className="text-left">
        <ImageWithFallback
          src={event.image}
          alt={event.title}
          label={event.title}
          className="aspect-[16/10] w-full"
          imgClassName="object-cover transition duration-500 group-hover:scale-105"
          sizes="(min-width: 1024px) 30vw, 90vw"
        />
      </button>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-3">
          <div className="flex w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-terracotta-soft py-2 text-terracotta">
            <span className="font-label text-lg font-bold leading-none">{start.getDate()}</span>
            <span className="mt-0.5 text-[10px] font-semibold uppercase tracking-wide">
              {start.toLocaleDateString('en-US', { month: 'short' })}
            </span>
          </div>
          <span className="rounded-full bg-sand px-2.5 py-1 font-label text-[10px] font-semibold uppercase tracking-wide text-ink-muted">
            {event.category}
          </span>
        </div>

        <button type="button" onClick={() => onOpen(event)} className="mt-3 text-left">
          <h3 className="font-display text-lg text-ink transition group-hover:text-terracotta">{event.title}</h3>
        </button>

        <div className="mt-2 space-y-1 text-xs text-ink-muted">
          <span className="flex items-center gap-1.5">
            <Clock size={13} /> {formatEventTimeLabel(event)}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin size={13} /> {event.location}
          </span>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 pt-1">
          <button
            type="button"
            onClick={() => onOpen(event)}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-terracotta transition hover:text-terracotta-dark"
          >
            Details
            <ArrowRight size={14} />
          </button>
          <AddToCalendar event={event} variant="outline" />
        </div>
      </div>
    </div>
  );
}

export function EventsDirectory({ events }: { events: SalemEvent[] }) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [active, setActive] = useState<SalemEvent | null>(null);

  const upcoming = useMemo(() => {
    const now = new Date();
    return events.filter((e) => new Date(e.endDateTime ?? e.startDateTime) >= now);
  }, [events]);

  const visible = useMemo(() => {
    if (!selectedDate) return upcoming;
    return upcoming.filter((e) => isSameDay(new Date(e.startDateTime), selectedDate));
  }, [upcoming, selectedDate]);

  return (
    <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[340px_1fr]">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <EventCalendar events={upcoming} selected={selectedDate} onSelect={setSelectedDate} />
        </div>

        <div>
          <div className="mb-6 flex items-baseline justify-between">
            <h2 className="font-display text-xl text-ink">
              {selectedDate
                ? selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
                : 'All Upcoming Events'}
            </h2>
            <span className="font-label text-xs text-ink-muted">{visible.length} event{visible.length === 1 ? '' : 's'}</span>
          </div>

          {visible.length === 0 ? (
            <div className="rounded-2xl border border-ink/[0.07] bg-white p-10 text-center text-sm text-ink-muted">
              No events on this date. Try another day on the calendar.
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2">
              {visible.map((event, i) => (
                <Reveal key={event.slug} delay={i * 0.05}>
                  <EventCard event={event} onOpen={setActive} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </div>

      {active && (
        <div className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center sm:p-6">
          <div className="absolute inset-0 bg-ink-deep/65 backdrop-blur-sm" onClick={() => setActive(null)} aria-hidden />

          <div className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-t-3xl bg-white shadow-panel sm:rounded-3xl">
            <button
              type="button"
              onClick={() => setActive(null)}
              aria-label="Close"
              className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-ink shadow-soft transition hover:bg-white"
            >
              <X size={18} />
            </button>

            <ImageWithFallback
              src={active.image}
              alt={active.title}
              label={active.title}
              className="aspect-[16/9] w-full"
              sizes="(min-width: 640px) 36rem, 100vw"
            />

            <div className="p-7">
              <span className="rounded-full bg-sand px-2.5 py-1 font-label text-[10px] font-semibold uppercase tracking-wide text-ink-muted">
                {active.category}
              </span>
              <h2 className="mt-4 font-display text-2xl text-ink">{active.title}</h2>

              <div className="mt-3 space-y-1.5 text-sm text-ink-muted">
                <span className="flex items-center gap-2">
                  <Clock size={15} /> {formatEventDateLabel(active)} · {formatEventTimeLabel(active)}
                </span>
                <span className="flex items-center gap-2">
                  <MapPin size={15} /> {active.location}
                </span>
              </div>

              <p className="mt-5 text-sm leading-7 text-ink-muted">{active.description}</p>

              <div className="mt-7">
                <AddToCalendar event={active} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
