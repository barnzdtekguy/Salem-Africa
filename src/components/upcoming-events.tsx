'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { CalendarClock, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import { EVENTS } from '@/data/events';
import { ImageWithFallback } from '@/components/image-with-fallback';
import { Reveal } from '@/components/reveal';

/** Homepage strip for recurring weekly services and their current flyers. */
export function UpcomingEvents() {
  const trackRef = useRef<HTMLDivElement>(null);

  function scrollBy(dir: 1 | -1) {
    trackRef.current?.scrollBy({ left: dir * 320, behavior: 'smooth' });
  }

  if (EVENTS.length === 0) return null;

  return (
    <section className="bg-paper py-20 sm:py-28">
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
        <Reveal className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-3xl text-ink sm:text-4xl">Weekly Services</h2>
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
          {EVENTS.map((event) => (
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
                    className="aspect-[4/5] w-full bg-sand"
                    imgClassName="object-contain transition duration-500 group-hover:scale-105"
                    sizes="288px"
                  />
                  <div className="absolute left-3 top-3 rounded-xl bg-white px-3 py-2 font-label text-[11px] font-bold uppercase tracking-wide text-terracotta shadow-soft">
                    {event.frequency}
                  </div>
                </div>
                <h3 className="mt-4 text-lg text-ink transition group-hover:text-terracotta">{event.title}</h3>
                <p className="mt-2 flex items-start gap-1.5 text-xs leading-5 text-ink-muted">
                  <CalendarClock size={13} className="mt-0.5 shrink-0" /> {event.schedule}
                </p>
                {event.location && (
                  <p className="mt-1 flex items-start gap-1.5 text-xs leading-5 text-ink-muted">
                    <MapPin size={13} className="mt-0.5 shrink-0" /> {event.location}
                  </p>
                )}
              </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
