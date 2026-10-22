import type { Metadata } from 'next';
import Link from 'next/link';
import { PageShell } from '@/components/page-shell';
import { PageHero } from '@/components/page-hero';
import { MediaTabs } from '@/components/media-tabs';
import { Reveal } from '@/components/reveal';
import { Radio, CalendarClock, Bell, MapPin } from 'lucide-react';
import { EVENTS } from '@/data/events';

export const metadata: Metadata = { title: 'Live | Salem Africa' };

const YOUTUBE_CHANNEL_ID = 'UCJ1RPuT4zkFJ6aDcQhglB4A';
const YOUTUBE_LIVE_STREAMS_PLAYLIST_ID = `UULV${YOUTUBE_CHANNEL_ID.slice(2)}`;
const LIVE_STREAM_EMBED_URL = `https://www.youtube.com/embed/videoseries?list=${YOUTUBE_LIVE_STREAMS_PLAYLIST_ID}&autoplay=1&mute=1&playsinline=1`;
const YOUTUBE_STREAMS_URL = 'https://www.youtube.com/@SalemLagosLive/streams';

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
            <div className="mx-auto max-w-4xl">
              <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-ink-deep shadow-panel">
                <iframe
                  src={LIVE_STREAM_EMBED_URL}
                  title="Salem Lagos live service"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                  className="absolute inset-0 h-full w-full"
                />
              </div>
              <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
                <p className="text-sm text-ink-muted">
                  The newest Salem service stream or replay loads here automatically.
                </p>
                <a
                  href={YOUTUBE_STREAMS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-terracotta px-5 py-3 text-sm font-semibold text-white transition hover:bg-terracotta-dark"
                >
                  <Radio size={16} />
                  Browse Salem streams
                </a>
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
                  {event.location && (
                    <p className="mt-2 flex items-start gap-2 text-sm leading-6 text-ink-muted">
                      <MapPin size={15} className="mt-1 shrink-0" />
                      <span>{event.location}</span>
                    </p>
                  )}
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
