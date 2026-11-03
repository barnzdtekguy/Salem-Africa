import type { Metadata } from 'next';
import { PageShell } from '@/components/page-shell';
import { PageHero } from '@/components/page-hero';
import { GivingAccounts } from '@/components/giving-accounts';

export const metadata: Metadata = { title: 'Give Online | Salem Africa' };

export default function GivePage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Sow a Seed"
        title="Give Online"
        subtitle="Support your church and community with cheerful, faithful giving."
        image="/images/hero-bg-4.jpg"
      />
      <GivingAccounts />
    </PageShell>
  );
}
