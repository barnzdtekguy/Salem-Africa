import type { Metadata } from 'next';
import { PageShell } from '@/components/page-shell';
import { PageHero } from '@/components/page-hero';
import { EventsDirectory } from '@/components/events-directory';
import { EVENTS } from '@/data/events';

export const metadata: Metadata = { title: 'Weekly Services | Salem Africa' };

export default function EventsPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="What's On"
        title="Weekly Services"
        subtitle="See Salem Africa’s weekly service schedule and this week’s flyers."
        image="/images/hero-bg-2.jpg"
      />

      <section className="py-16 sm:py-24">
        <EventsDirectory events={EVENTS} />
      </section>
    </PageShell>
  );
}
