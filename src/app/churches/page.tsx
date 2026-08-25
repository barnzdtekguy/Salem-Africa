import type { Metadata } from 'next';
import { PageShell } from '@/components/page-shell';
import { PageHero } from '@/components/page-hero';
import { ChurchLocator } from '@/components/church-locator';

export const metadata: Metadata = { title: 'Locate a Church | Salem Africa' };

export default function ChurchesPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="37 Locations · 5 Nations"
        title="Locate a Church"
        subtitle="Find a Salem Family church near you, across nations and continents."
        image="/images/hero-bg-3.jpg"
      />

      <section className="py-16 sm:py-24">
        <ChurchLocator />
      </section>
    </PageShell>
  );
}
