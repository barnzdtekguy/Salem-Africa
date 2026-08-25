import type { Metadata } from 'next';
import Link from 'next/link';
import { PageShell } from '@/components/page-shell';
import { PageHero } from '@/components/page-hero';
import { MediaTabs } from '@/components/media-tabs';
import { Reveal } from '@/components/reveal';
import { Headphones, Download, Podcast } from 'lucide-react';

export const metadata: Metadata = { title: 'Audio | Salem Africa' };

/**
 * Audio messages. `src` points at an mp3 under /public/audio/... — drop the
 * file in with that exact name and the player below starts working.
 */
const TRACKS: Array<{ title: string; speaker: string; date: string; src: string }> = [];

export default function AudioPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Listen"
        title="Audio Messages"
        subtitle="Take the Word with you — on the commute, in the kitchen, wherever you are."
        image="/images/hero-bg-3.jpg"
      />
      <MediaTabs />

      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <Reveal className="mx-auto max-w-2xl text-center">
            <span className="font-label text-xs font-semibold uppercase tracking-[0.3em] text-terracotta">
              Audio Library
            </span>
            <h2 className="mt-3 font-display text-3xl text-ink sm:text-4xl">Stream or download</h2>
            <p className="mt-4 text-sm leading-7 text-ink-muted">
              Every message is released as audio for offline listening and easy sharing.
            </p>
          </Reveal>

          {TRACKS.length > 0 ? (
            <div className="mx-auto mt-14 max-w-3xl space-y-4">
              {TRACKS.map(({ title, speaker, date, src }, i) => (
                <Reveal key={title} delay={i * 0.05}>
                  <div className="rounded-2xl border border-ink/[0.07] bg-white p-5 shadow-soft sm:p-6">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-terracotta-soft text-terracotta">
                          <Headphones size={20} strokeWidth={1.8} />
                        </div>
                        <div>
                          <h3 className="font-display text-base text-ink">{title}</h3>
                          <p className="mt-1 text-xs text-ink-muted">
                            {speaker} — {date}
                          </p>
                        </div>
                      </div>
                      <a
                        href={src}
                        download
                        className="inline-flex items-center gap-2 rounded-full border border-ink/10 px-4 py-2 text-xs font-semibold text-ink-muted transition hover:border-terracotta/30 hover:text-terracotta"
                      >
                        <Download size={14} />
                        Download
                      </a>
                    </div>
                    {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                    <audio controls preload="none" src={src} className="mt-4 w-full">
                      Your browser does not support the audio player.
                    </audio>
                  </div>
                </Reveal>
              ))}
            </div>
          ) : (
            <Reveal delay={0.1} className="mx-auto mt-14 max-w-xl">
              <div className="rounded-2xl border border-ink/[0.07] bg-white p-10 text-center shadow-soft">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-terracotta-soft text-terracotta">
                  <Podcast size={24} strokeWidth={1.8} />
                </div>
                <h3 className="mt-5 font-display text-lg text-ink">Audio is on the way</h3>
                <p className="mt-2 text-sm leading-6 text-ink-muted">
                  The media team is preparing the audio archive. Until then you can watch messages on
                  the{' '}
                  <Link href="/media/messages" className="font-semibold text-terracotta hover:underline">
                    previous messages
                  </Link>{' '}
                  page.
                </p>
              </div>
            </Reveal>
          )}
        </div>
      </section>
    </PageShell>
  );
}
