import type { Metadata } from 'next';
import { PageShell } from '@/components/page-shell';
import { PageHero } from '@/components/page-hero';
import { MinistriesMarquee } from '@/components/ministries-marquee';

export const metadata: Metadata = { title: 'Ministries | Salem Africa' };

export default function MinistriesPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="35 Ministry Arms"
        title="Our Ministries"
        subtitle="One mandate, many hands — find where you fit and tap any card for the full picture."
        image="/images/bg-ministries.jpg"
      />

      <section className="py-16 sm:py-24">
        <MinistriesMarquee />
      </section>
    </PageShell>
  );
}
