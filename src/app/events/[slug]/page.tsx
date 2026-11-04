import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CalendarClock, Clock, MapPin, Radio } from 'lucide-react';
import { PageShell } from '@/components/page-shell';
import { PageHero } from '@/components/page-hero';
import { getPublicEvent } from '@/lib/content/repository';

type RouteContext = { params: Promise<{ slug: string }> };
export const dynamic = 'force-dynamic';

async function findEvent(slug: string) {
  return getPublicEvent(slug);
}

export async function generateMetadata({ params }: RouteContext): Promise<Metadata> {
  const { slug } = await params;
  const event = await findEvent(slug);
  return { title: event ? `${event.title} | Salem Africa` : 'Event | Salem Africa' };
}

function formatEventDate(date: string) {
  return new Intl.DateTimeFormat('en-NG', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Africa/Lagos',
  }).format(new Date(date));
}

export default async function EventDetailsPage({ params }: RouteContext) {
  const { slug } = await params;
  const event = await findEvent(slug);
  if (!event) notFound();

  const start = event.startsAt ? formatEventDate(event.startsAt) : event.frequency;
  const end = event.endDate ? formatEventDate(event.endDate) : event.endsAt ? formatEventDate(event.endsAt) : '';

  return (
    <PageShell>
      <PageHero
        eyebrow={event.theme || event.category}
        title={event.title}
        subtitle={event.description}
        image={event.image || '/images/hero-bg-2.jpg'}
      />
      <article className="mx-auto grid max-w-container gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(280px,.9fr)] lg:px-8 lg:py-20">
        {event.image && (
          <Image
            src={event.image}
            alt={event.imageAlt || `${event.title} flyer`}
            width={1200}
            height={1400}
            unoptimized
            className="h-auto max-h-[760px] w-full bg-sand object-contain"
          />
        )}
        <div>
          <h2 className="font-display text-2xl text-ink">Event details</h2>
          <dl className="mt-6 space-y-5">
            <div>
              <dt className="flex items-center gap-2 text-xs font-medium text-ink-muted"><CalendarClock size={15} /> Dates</dt>
              <dd className="mt-1 text-sm font-semibold text-ink">{start}{end && end !== start ? ` to ${end}` : ''}</dd>
            </div>
            <div>
              <dt className="flex items-center gap-2 text-xs font-medium text-ink-muted"><Clock size={15} /> Time</dt>
              <dd className="mt-1 text-sm font-semibold text-ink">{event.schedule} · Africa/Lagos (WAT)</dd>
            </div>
            {event.location && <div>
              <dt className="flex items-center gap-2 text-xs font-medium text-ink-muted"><MapPin size={15} /> Venue</dt>
              <dd className="mt-1 text-sm leading-6 text-ink">{event.location}</dd>
            </div>}
            {!!event.speakers?.length && <div>
              <dt className="text-xs font-medium text-ink-muted">Speakers and ministers</dt>
              <dd className="mt-1 text-sm leading-6 text-ink">{event.speakers.join(', ')}</dd>
            </div>}
          </dl>
          <p className="mt-7 whitespace-pre-line text-sm leading-7 text-ink-muted">{event.description}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            {event.registrationUrl && <a href={event.registrationUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center rounded-full bg-terracotta px-5 text-sm font-semibold text-white hover:bg-terracotta-dark">Register</a>}
            {event.livestreamUrl && <a href={event.livestreamUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 border border-ink/15 px-5 text-sm font-semibold text-ink hover:bg-sand"><Radio size={16} /> Watch live</a>}
          </div>
          <Link href="/events" className="mt-8 inline-flex text-sm font-semibold text-terracotta hover:underline">View all programs and events</Link>
        </div>
      </article>
    </PageShell>
  );
}
