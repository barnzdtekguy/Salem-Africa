'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { EVENTS } from '@/data/events';
import { ImageWithFallback } from '@/components/image-with-fallback';
import { formatEventTimeLabel } from '@/lib/calendar';
import { Reveal } from '@/components/reveal';

const UPCOMING = EVENTS.filter((e) => new Date(e.endDateTime ?? e.startDateTime) >= new Date()).slice(0, 6);

/**
 * Homepage "Upcoming Events" strip — mirrors thispresenthouse.org's
 * connect-wrap: a horizontally scrolling row of cards, each with an
 * image, a month/day date badge, a title, and a location + time line.
 */
export function UpcomingEvents() {
  const trackRef = useRef<HTMLDivElement>(null);

  function scrollBy(dir: 1 | -1) {
    trackRef.current?.scrollBy({ left: dir * 320, behavior: 'smooth' });
  }

  if (UPCOMING.length === 0) return null;

  return (
    <section className="bg-paper py-20 sm:py-28">
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
        <Reveal className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-3xl text-ink sm:text-4xl">Upcoming Events</h2>
          <div className="hidden items-center gap-2 sm:flex">
            <button
              type="button"
              onClick={() => scrollBy(-1)}
              aria-label="Scroll left"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/15 text-ink transition hover:border-terracotta hover:text-terracotta"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              onClick={() => scrollBy(1)}
              aria-label="Scroll right"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/15 text-ink transition hover:border-terracotta hover:text-terracotta"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </Reveal>

        <div ref={trackRef} className="mt-10 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4">
          {UPCOMING.map((event) => {
            const start = new Date(event.startDateTime);
            return (
              <Link
                key={event.slug}
                href="/events"
                className="group w-72 shrink-0 snap-start"
              >
                <div className="relative overflow-hidden rounded-2xl">
                  <ImageWithFallback
                    src={event.image}
                    alt={event.title}
                    label={event.title}
                    className="aspect-[4/5] w-full"
                    imgClassName="object-cover transition duration-500 group-hover:scale-105"
                    sizes="288px"
                  />
                  <div className="absolute left-3 top-3 flex w-14 flex-col items-center justify-center rounded-xl bg-white py-2 shadow-soft">
                    <span className="text-[11px] font-bold uppercase tracking-wide text-terracotta">
                      {start.toLocaleDateString('en-US', { month: 'short' })}
                    </span>
                    <span className="text-lg font-black leading-none text-ink">{start.getDate()}</span>
                  </div>
                </div>
                <h3 className="mt-4 text-lg text-ink transition group-hover:text-terracotta">{event.title}</h3>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-ink-muted">
                  <MapPin size={13} /> {event.location} · {formatEventTimeLabel(event)}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
