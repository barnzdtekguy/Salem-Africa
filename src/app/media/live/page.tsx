import type { Metadata } from 'next';
import Link from 'next/link';
import { PageShell } from '@/components/page-shell';
import { PageHero } from '@/components/page-hero';
import { MediaTabs } from '@/components/media-tabs';
import { Reveal } from '@/components/reveal';
import { Radio, CalendarClock, Bell } from 'lucide-react';
import { EVENTS } from '@/data/events';

export const metadata: Metadata = { title: 'Live | Salem Africa' };

export default function LivePage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Watch Live"
        title="Live Service"
        subtitle="Worship with the Salem Africa family wherever you are in the world."
        image="/images/hero-bg-1.jpg"
      />
      <MediaTabs />

      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <Reveal>
            {/* Stream player slot. Replace this block with the YouTube/Facebook
                live embed iframe once the channel URL is confirmed. */}
            <div className="relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-2xl bg-ink-deep text-center shadow-panel">
              <div className="px-6">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-white">
                  <Radio size={28} strokeWidth={1.8} />
                </div>
                <p className="mt-5 font-display text-2xl text-white">The stream is currently offline</p>
                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/60">
                  The live player embed goes here. It will go live automatically a few minutes before
                  each service begins.
                </p>
              </div>
            </div>
          </Reveal>

          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {EVENTS.map((event, i) => (
              <Reveal key={event.slug} delay={i * 0.08}>
                <div className="h-full rounded-2xl border border-ink/[0.07] bg-white p-7 shadow-soft">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-terracotta-soft text-terracotta">
                    <CalendarClock size={22} strokeWidth={1.8} />
                  </div>
                  <p className="mt-5 font-label text-xs font-semibold uppercase tracking-[0.2em] text-terracotta">
                    {event.frequency}
                  </p>
                  <h3 className="mt-2 font-display text-lg text-ink">{event.title}</h3>
                  <p className="mt-1.5 text-sm leading-6 text-ink-muted">{event.schedule}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.15} className="mx-auto mt-14 max-w-xl">
            <div className="flex items-start gap-4 rounded-2xl border border-gold/30 bg-gold-soft p-6">
              <Bell size={22} className="mt-0.5 shrink-0 text-gold-dark" />
              <div>
                <h3 className="font-display text-base text-ink">Missed the service?</h3>
                <p className="mt-1.5 text-sm leading-6 text-ink-muted">
                  Every service is archived shortly after it ends. Browse the{' '}
                  <Link href="/media/messages" className="font-semibold text-terracotta hover:underline">
                    previous messages
                  </Link>{' '}
                  library to watch on demand.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </PageShell>
  );
}
