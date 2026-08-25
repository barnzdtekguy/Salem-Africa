import type { Metadata } from 'next';
import { PageShell } from '@/components/page-shell';
import { PageHero } from '@/components/page-hero';
import { EventsDirectory } from '@/components/events-directory';
import { EVENTS } from '@/data/events';

export const metadata: Metadata = { title: 'Events | Salem Africa' };

export default function EventsPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="What's On"
        title="Upcoming Events"
        subtitle="Browse the calendar, tap a date, and save any event straight to your own calendar."
        image="/images/hero-bg-2.jpg"
      />

      <section className="py-16 sm:py-24">
        <EventsDirectory events={EVENTS} />
      </section>
    </PageShell>
  );
}
