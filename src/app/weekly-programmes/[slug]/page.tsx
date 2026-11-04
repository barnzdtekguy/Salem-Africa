import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CalendarClock, Clock, MapPin, Radio } from 'lucide-react';
import { PageHero } from '@/components/page-hero';
import { PageShell } from '@/components/page-shell';
import { getPublicWeeklyProgram } from '@/lib/content/repository';

type RouteContext = { params: Promise<{ slug: string }> };
export const dynamic = 'force-dynamic';

async function findProgram(slug: string) {
  return getPublicWeeklyProgram(slug);
}

export async function generateMetadata({ params }: RouteContext): Promise<Metadata> {
  const { slug } = await params;
  const program = await findProgram(slug);
  return { title: program ? `${program.title} | Salem Africa` : 'Weekly Programme | Salem Africa' };
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat('en-NG', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Africa/Lagos',
  }).format(new Date(`${date}T12:00:00+01:00`));
}

export default async function WeeklyProgramPage({ params }: RouteContext) {
  const { slug } = await params;
  const program = await findProgram(slug);
  if (!program) notFound();

  const exceptions = program.exceptions ?? [];

  return (
    <PageShell>
      <PageHero
        eyebrow="Weekly Programme"
        title={program.title}
        subtitle={program.description}
        image={program.image || '/images/hero-bg-2.jpg'}
      />
      <article className="mx-auto grid max-w-container gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(280px,.9fr)] lg:px-8 lg:py-20">
        {program.image && (
          <Image
            src={program.image}
            alt={program.imageAlt || `${program.title} flyer`}
            width={1200}
            height={1400}
            unoptimized
            className="h-auto max-h-[760px] w-full bg-sand object-contain"
          />
        )}
        <div>
          <h2 className="text-center font-display text-2xl text-ink lg:text-left">Programme details</h2>
          <dl className="mt-6 space-y-5">
            <div>
              <dt className="flex items-center gap-2 text-xs font-medium text-ink-muted"><CalendarClock size={15} /> Schedule</dt>
              <dd className="mt-1 text-sm font-semibold text-ink">{program.frequency}</dd>
            </div>
            <div>
              <dt className="flex items-center gap-2 text-xs font-medium text-ink-muted"><Clock size={15} /> Time</dt>
              <dd className="mt-1 text-sm font-semibold text-ink">{program.schedule} · Africa/Lagos (WAT)</dd>
            </div>
            {program.location && (
              <div>
                <dt className="flex items-center gap-2 text-xs font-medium text-ink-muted"><MapPin size={15} /> Venue</dt>
                <dd className="mt-1 text-sm leading-6 text-ink">{program.location}</dd>
              </div>
            )}
            {program.minister && (
              <div>
                <dt className="text-xs font-medium text-ink-muted">Minister or speaker</dt>
                <dd className="mt-1 text-sm leading-6 text-ink">{program.minister}</dd>
              </div>
            )}
          </dl>
          {program.description && <p className="mt-7 whitespace-pre-line text-sm leading-7 text-ink-muted">{program.description}</p>}
          {exceptions.length > 0 && (
            <section className="mt-8" aria-labelledby="programme-date-changes">
              <h3 id="programme-date-changes" className="font-display text-xl text-ink">Date-specific changes</h3>
              <ul className="mt-3 space-y-3">
                {exceptions.map((exception) => (
                  <li key={exception.date} className="border-l-2 border-terracotta pl-4 text-sm leading-6 text-ink-muted">
                    <strong className="text-ink">{formatDate(exception.date)}:</strong>{' '}
                    {exception.status === 'cancelled'
                      ? 'This gathering is cancelled.'
                      : `Schedule changed${exception.startTime ? ` to ${exception.startTime}` : ''}${exception.venue ? ` at ${exception.venue}` : ''}.`}
                    {exception.note && ` ${exception.note}`}
                  </li>
                ))}
              </ul>
            </section>
          )}
          {program.livestreamUrl && (
            <a href={program.livestreamUrl} target="_blank" rel="noopener noreferrer" className="mt-7 inline-flex min-h-11 items-center gap-2 rounded-full border border-ink/15 px-5 text-sm font-semibold text-ink hover:bg-sand">
              <Radio size={16} /> Watch live
            </a>
          )}
          <div>
            <Link href="/events" className="mt-8 inline-flex text-sm font-semibold text-terracotta hover:underline">View all programs and events</Link>
          </div>
        </div>
      </article>
    </PageShell>
  );
}
