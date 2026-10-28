import type { Metadata } from 'next';
import { PageShell } from '@/components/page-shell';
import { PageHero } from '@/components/page-hero';
import { EventsDirectory } from '@/components/events-directory';
import { EVENTS } from '@/data/events';

export const metadata: Metadata = { title: 'Services & Events | Salem Africa' };

export default function EventsPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="What's On"
        title="Services & Events"
        subtitle="Join our weekly gatherings and find upcoming Salem events."
        image="/images/hero-bg-2.jpg"
      />

      <section className="py-16 sm:py-24">
        <EventsDirectory events={EVENTS} />
      </section>
    </PageShell>
  );
}
