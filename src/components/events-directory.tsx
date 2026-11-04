import Link from 'next/link';
import type { SalemEvent } from '@/data/events';
import { ImageWithFallback } from '@/components/image-with-fallback';
import { Reveal } from '@/components/reveal';

function dateInLagos(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Africa/Lagos',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function eventDateInLagos(value: string) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Africa/Lagos',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date(value));
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function detailsHref(event: SalemEvent) {
  const isEvent = event.contentType === 'event' || event.category.startsWith('Conference');
  return isEvent ? `/events/${event.slug}` : `/weekly-programmes/${event.slug}`;
}

function GatheringCard({ event, index }: { event: SalemEvent; index: number }) {
  return (
    <Reveal delay={index * 0.06}>
      <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-ink/[0.07] bg-white shadow-soft transition hover:shadow-hover">
        <ImageWithFallback
          src={event.image}
          alt={event.imageAlt || `${event.title} flyer`}
          label={event.title}
          className="aspect-[4/5] w-full bg-sand"
          imgClassName="object-contain"
          sizes="(min-width: 1024px) 30vw, 90vw"
        />
        <div className="flex flex-1 flex-col items-center p-6 text-center">
          <h2 className="font-display text-xl text-ink">{event.title}</h2>
          <Link
            href={detailsHref(event)}
            className="mt-5 inline-flex min-h-11 items-center justify-center rounded-full bg-terracotta px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-terracotta-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
          >
            See Details
          </Link>
        </div>
      </article>
    </Reveal>
  );
}

export function EventsDirectory({ events }: { events: SalemEvent[] }) {
  const today = dateInLagos();
  const upcoming = events.filter((event) => !event.startsAt || eventDateInLagos(event.startsAt) >= today);
  const past = events.filter((event) => event.contentType === 'event' && event.startsAt && eventDateInLagos(event.startsAt) < today);

  return (
    <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <h2 className="font-display text-xl text-ink">Upcoming Programs &amp; Events</h2>
        <span className="mt-2 block font-label text-xs text-ink-muted">{upcoming.length} gatherings</span>
      </div>

      {upcoming.length ? (
        <div className="grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {upcoming.map((event, index) => <GatheringCard key={event.slug} event={event} index={index} />)}
        </div>
      ) : (
        <p className="py-12 text-center text-sm text-ink-muted">There are no upcoming programs or events right now.</p>
      )}

      {past.length > 0 && (
        <section className="mt-16" aria-labelledby="past-events-heading">
          <div className="mb-8 text-center">
            <h2 id="past-events-heading" className="font-display text-xl text-ink">Past Events</h2>
            <span className="mt-2 block font-label text-xs text-ink-muted">{past.length} events</span>
          </div>
          <div className="grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {past.map((event, index) => <GatheringCard key={event.slug} event={event} index={index} />)}
          </div>
        </section>
      )}
    </div>
  );
}
