'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, CalendarClock, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import { EVENTS } from '@/data/events';
import { ImageWithFallback } from '@/components/image-with-fallback';
import { Reveal } from '@/components/reveal';

/** Homepage strip for recurring weekly services and their current flyers. */
export function UpcomingEvents() {
  const trackRef = useRef<HTMLDivElement>(null);
  const featuredEvent = EVENTS.find((event) => event.category.startsWith('Conference'));
  const weeklyEvents = EVENTS.filter((event) => event !== featuredEvent);

  function scrollBy(dir: 1 | -1) {
    trackRef.current?.scrollBy({ left: dir * 320, behavior: 'smooth' });
  }

  if (EVENTS.length === 0) return null;

  return (
    <section aria-labelledby="upcoming-events-heading" className="bg-paper py-20 sm:py-28">
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
        <Reveal className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-label text-xs font-semibold uppercase tracking-[0.3em] text-gold-dark">
              What’s happening
            </p>
            <h2 id="upcoming-events-heading" className="mt-2 font-display text-3xl text-ink sm:text-4xl">
              Upcoming at Salem
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/events"
              className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-ink transition hover:text-gold-dark"
            >
              View all services &amp; events
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>
        </Reveal>

        {featuredEvent && (
          <Reveal className="mt-10">
            <article className="grid overflow-hidden rounded-2xl border border-ink/[0.07] bg-white shadow-soft lg:grid-cols-[0.9fr_1.1fr]">
              <ImageWithFallback
                src={featuredEvent.image}
                alt={`${featuredEvent.title} event flyer`}
                label={featuredEvent.title}
                className="aspect-[4/3] w-full bg-sand lg:aspect-auto lg:min-h-[360px]"
                imgClassName="object-contain"
                sizes="(min-width: 1024px) 40vw, 100vw"
              />
              <div className="flex flex-col justify-center p-6 sm:p-9 lg:p-12">
                <p className="font-label text-xs font-semibold uppercase tracking-[0.2em] text-gold-dark">
                  {featuredEvent.category}
                </p>
                <h3 className="mt-3 font-display text-2xl text-ink sm:text-3xl">
                  {featuredEvent.title}
                </h3>
                <p className="mt-3 text-sm font-semibold leading-6 text-ink">
                  {featuredEvent.frequency} · {featuredEvent.schedule}
                </p>
                <p className="mt-2 flex items-start gap-2 text-sm leading-6 text-ink-muted">
                  <MapPin size={16} className="mt-1 shrink-0 text-gold-dark" aria-hidden="true" />
                  <span>{featuredEvent.location}</span>
                </p>
                <p className="mt-4 text-sm leading-6 text-ink-muted">{featuredEvent.description}</p>
                <Link
                  href="/events"
                  className="mt-5 inline-flex min-h-11 w-fit items-center gap-2 rounded-full bg-terracotta px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-terracotta-dark"
                >
                  Conference details
                  <ArrowRight size={15} aria-hidden="true" />
                </Link>
              </div>
            </article>
          </Reveal>
        )}

        {weeklyEvents.length > 0 && (
          <Reveal className="mt-12 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-label text-xs font-semibold uppercase tracking-[0.3em] text-gold-dark">
                Gather with us
              </p>
              <h3 className="mt-2 font-display text-2xl text-ink sm:text-3xl">Weekly Services</h3>
            </div>
            <div className="hidden items-center gap-2 sm:flex">
              <button
                type="button"
                onClick={() => scrollBy(-1)}
                aria-label="Scroll left"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/15 text-ink transition hover:border-gold/50 hover:text-gold-dark"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                onClick={() => scrollBy(1)}
                aria-label="Scroll right"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/15 text-ink transition hover:border-gold/50 hover:text-gold-dark"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </Reveal>
        )}

        <div ref={trackRef} className="mt-6 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4">
          {weeklyEvents.map((event) => (
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
