import type { Metadata } from 'next';
import { PageShell } from '@/components/page-shell';
import { PageHero } from '@/components/page-hero';
import { Reveal } from '@/components/reveal';
import { HandCoins, Globe2, Sparkle, Building2, Landmark } from 'lucide-react';

export const metadata: Metadata = { title: 'Give Online | Salem Africa' };

const CATEGORIES = [
  {
    icon: HandCoins,
    title: 'Tithes & Offerings',
    text: 'Honour God with the firstfruits of your increase as an act of worship and obedience.',
  },
  {
    icon: Building2,
    title: 'Building Project',
    text: 'Partner with us as we expand our facilities to accommodate a growing congregation.',
  },
  {
    icon: Globe2,
    title: 'Missions & Outreach',
    text: 'Fund the spread of the Gospel across nations, from local outreach to global missions.',
  },
  {
    icon: Sparkle,
    title: 'Special Seed',
    text: 'Sow into a specific vision or project the Lord has laid on your heart.',
  },
];

export default function GivePage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Sow a Seed"
        title="Give Online"
        subtitle="Support your church and community with cheerful, faithful giving."
        image="/images/hero-bg-4.jpg"
      />

      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <Reveal className="mx-auto max-w-2xl text-center">
            <span className="font-label text-xs font-semibold uppercase tracking-[0.3em] text-terracotta">Sow a Seed</span>
            <h2 className="mt-3 font-display text-3xl text-ink sm:text-4xl">
              &ldquo;Give, and it will be given to you.&rdquo;
            </h2>
            <p className="mt-4 text-sm leading-7 text-ink-muted">
              Luke 6:38 — Every gift, big or small, fuels the work of the Kingdom across Salem Africa
              and beyond. Choose a giving category below to get started.
            </p>
          </Reveal>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {CATEGORIES.map(({ icon: Icon, title, text }, i) => (
              <Reveal key={title} delay={i * 0.08}>
                <div className="h-full rounded-2xl border border-ink/[0.07] bg-white p-7 text-center shadow-soft transition hover:-translate-y-1 hover:shadow-hover">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-terracotta-soft text-terracotta">
                    <Icon size={24} strokeWidth={1.8} />
                  </div>
                  <h3 className="mt-5 font-display text-lg text-ink">{title}</h3>
                  <p className="mt-2.5 text-sm leading-6 text-ink-muted">{text}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.15} className="mx-auto mt-14 max-w-xl">
            <div className="flex items-start gap-4 rounded-2xl border border-gold/30 bg-gold-soft p-6">
              <Landmark size={22} className="mt-0.5 shrink-0 text-gold-dark" />
              <div>
                <h3 className="font-display text-base text-ink">Bank Transfer Details</h3>
                <p className="mt-1.5 text-sm leading-6 text-ink-muted">
                  Account details and an online payment gateway will be published here once finalised
                  by the finance team. For now, please see any usher or contact the church office to
                  give in person.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </PageShell>
  );
}
