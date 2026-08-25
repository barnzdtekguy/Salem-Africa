import type { Metadata } from 'next';
import Link from 'next/link';
import { PageShell } from '@/components/page-shell';
import { PageHero } from '@/components/page-hero';
import { MediaTabs } from '@/components/media-tabs';
import { Reveal } from '@/components/reveal';
import { PlayCircle, Radio } from 'lucide-react';

export const metadata: Metadata = { title: 'Previous Messages | Salem Africa' };

/**
 * Sermon archive. Add one entry per message — `youtubeId` is the only field
 * needed to make a card play; leave it empty and the card renders as a
 * placeholder tile until the recording is uploaded.
 */
const MESSAGES: Array<{ title: string; speaker: string; date: string; youtubeId?: string }> = [];

export default function MessagesPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Watch Again"
        title="Previous Messages"
        subtitle="The undiluted Word, archived so you can return to it as often as you need."
        image="/images/hero-bg-2.jpg"
      />
      <MediaTabs />

      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <Reveal className="mx-auto max-w-2xl text-center">
            <span className="font-label text-xs font-semibold uppercase tracking-[0.3em] text-terracotta">
              Message Library
            </span>
            <h2 className="mt-3 font-display text-3xl text-ink sm:text-4xl">Sermons on demand</h2>
            <p className="mt-4 text-sm leading-7 text-ink-muted">
              Every Sunday celebration, midweek teaching and special conference session, gathered in
              one place.
            </p>
          </Reveal>

          {MESSAGES.length > 0 ? (
            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {MESSAGES.map(({ title, speaker, date, youtubeId }, i) => (
                <Reveal key={title} delay={i * 0.06}>
                  <div className="group h-full overflow-hidden rounded-2xl border border-ink/[0.07] bg-white shadow-soft transition hover:-translate-y-1 hover:shadow-hover">
                    <div className="relative aspect-video w-full bg-ink-deep">
                      {youtubeId ? (
                        <iframe
                          src={`https://www.youtube.com/embed/${youtubeId}`}
                          title={title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
                          allowFullScreen
                          className="absolute inset-0 h-full w-full"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-white/40">
                          <PlayCircle size={40} strokeWidth={1.5} />
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="font-display text-base text-ink">{title}</h3>
                      <p className="mt-1 text-xs text-ink-muted">
                        {speaker} — {date}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          ) : (
            <Reveal delay={0.1} className="mx-auto mt-14 max-w-xl">
              <div className="rounded-2xl border border-ink/[0.07] bg-white p-10 text-center shadow-soft">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-terracotta-soft text-terracotta">
                  <PlayCircle size={24} strokeWidth={1.8} />
                </div>
                <h3 className="mt-5 font-display text-lg text-ink">The archive is being built</h3>
                <p className="mt-2 text-sm leading-6 text-ink-muted">
                  Recorded messages will appear here as the media team uploads them. In the meantime,
                  join us for the{' '}
                  <Link href="/media/live" className="font-semibold text-terracotta hover:underline">
                    live service
                  </Link>
                  .
                </p>
                <Link
                  href="/media/live"
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-terracotta px-5 py-3 text-sm font-semibold text-white transition hover:bg-terracotta-dark"
                >
                  <Radio size={16} />
                  Watch Live
                </Link>
              </div>
            </Reveal>
          )}
        </div>
      </section>
    </PageShell>
  );
}
