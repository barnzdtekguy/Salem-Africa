import { CalendarClock, Clock, MapPin } from 'lucide-react';
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

function WeeklyServiceCard({ event, index }: { event: SalemEvent; index: number }) {
  const today = dateInLagos();
  return (
    <Reveal delay={index * 0.06}>
      <article className="group h-full overflow-hidden rounded-2xl border border-ink/[0.07] bg-white shadow-soft transition hover:shadow-hover">
        <ImageWithFallback
          src={event.image}
          alt={event.imageAlt || event.title}
          label={event.title}
          className="aspect-[4/5] w-full bg-sand"
          imgClassName="object-contain transition duration-500 group-hover:scale-[1.02]"
          sizes="(min-width: 1024px) 30vw, 90vw"
        />

        <div className="p-6">
          <span className="rounded-full bg-sand px-2.5 py-1 font-label text-[10px] font-semibold uppercase tracking-wide text-ink-muted">
            {event.category}
          </span>
          <h2 className="mt-3 font-display text-xl text-ink">{event.title}</h2>

          <div className="mt-4 space-y-2 text-sm">
            <p className="flex items-center gap-2 font-semibold text-terracotta">
              <CalendarClock size={16} />
              {event.frequency}
            </p>
            <p className="flex items-start gap-2 leading-6 text-ink-muted">
              <Clock size={16} className="mt-1 shrink-0" />
              <span>{event.schedule}</span>
            </p>
            {event.location && (
              <p className="flex items-start gap-2 leading-6 text-ink-muted">
                <MapPin size={16} className="mt-1 shrink-0" />
                <span>{event.location}</span>
              </p>
            )}
          </div>

          <p className="mt-4 text-sm leading-6 text-ink-muted">{event.description}</p>
          {event.minister && <p className="mt-3 text-xs leading-5 text-ink-muted">Minister: {event.minister}</p>}
          {event.contentType === 'weekly_program' && event.livestreamUrl && (
            <a href={event.livestreamUrl} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex text-sm font-semibold text-terracotta hover:underline">
              Watch live
            </a>
          )}
          {event.exceptions?.filter((exception) => exception.date >= today).map((exception) => (
            <p key={exception.date} className="mt-3 border-l-2 border-terracotta pl-3 text-xs leading-5 text-terracotta">
              {exception.date}: {exception.status === 'cancelled' ? 'This gathering is cancelled.' : `Schedule changed${exception.startTime ? ` to ${exception.startTime}` : ''}${exception.venue ? ` at ${exception.venue}` : ''}.`}
            </p>
          ))}
          {event.contentType === 'event' && (
            <Link href={`/events/${event.slug}`} className="mt-5 inline-flex min-h-10 items-center text-sm font-semibold text-terracotta hover:underline">
              Event details
            </Link>
          )}
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
      <div className="section-title-group mb-8">
        <h2 className="font-display text-xl text-ink">Upcoming Programs &amp; Events</h2>
        <span className="mt-2 block font-label text-xs text-ink-muted">{upcoming.length} gatherings</span>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {upcoming.map((event, index) => (
          <WeeklyServiceCard key={event.slug} event={event} index={index} />
        ))}
      </div>
      {past.length > 0 && (
        <section className="mt-16" aria-labelledby="past-events-heading">
          <div className="section-title-group mb-8">
            <h2 id="past-events-heading" className="font-display text-xl text-ink">Past Events</h2>
            <span className="mt-2 block font-label text-xs text-ink-muted">{past.length} events</span>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {past.map((event, index) => <WeeklyServiceCard key={event.slug} event={event} index={index} />)}
          </div>
        </section>
      )}
    </div>
  );
}
