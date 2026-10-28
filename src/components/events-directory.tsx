import { CalendarClock, Clock, MapPin } from 'lucide-react';
import type { SalemEvent } from '@/data/events';
import { ImageWithFallback } from '@/components/image-with-fallback';
import { Reveal } from '@/components/reveal';

function WeeklyServiceCard({ event, index }: { event: SalemEvent; index: number }) {
  return (
    <Reveal delay={index * 0.06}>
      <article className="group h-full overflow-hidden rounded-2xl border border-ink/[0.07] bg-white shadow-soft transition hover:shadow-hover">
        <ImageWithFallback
          src={event.image}
          alt={event.title}
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
        </div>
      </article>
    </Reveal>
  );
}

export function EventsDirectory({ events }: { events: SalemEvent[] }) {
  return (
    <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-baseline justify-between">
        <h2 className="font-display text-xl text-ink">Services &amp; Events</h2>
        <span className="font-label text-xs text-ink-muted">{events.length} gatherings</span>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {events.map((event, index) => (
          <WeeklyServiceCard key={event.slug} event={event} index={index} />
        ))}
      </div>
    </div>
  );
}
