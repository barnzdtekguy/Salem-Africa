import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { PageShell } from '@/components/page-shell';
import { PageHero } from '@/components/page-hero';
import { MediaTabs } from '@/components/media-tabs';
import { Reveal } from '@/components/reveal';
import { PlayCircle, Radio, Youtube } from 'lucide-react';

export const metadata: Metadata = { title: 'Previous Messages | Salem Africa' };

export const dynamic = 'force-dynamic';

const YOUTUBE_CHANNEL_ID = 'UCJ1RPuT4zkFJ6aDcQhglB4A';
const YOUTUBE_CHANNEL_URL = 'https://www.youtube.com/@SalemLagosLive';
const YOUTUBE_FEED_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${YOUTUBE_CHANNEL_ID}`;

type Message = { id: string; title: string; publishedAt: string };

function decodeXml(value: string) {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&(#x[\da-f]+|#\d+|amp|lt|gt|quot|apos);/gi, (entity, code: string) => {
      const namedEntities: Record<string, string> = {
        amp: '&',
        lt: '<',
        gt: '>',
        quot: '"',
        apos: "'",
      };

      if (code[0] !== '#') return namedEntities[code.toLowerCase()] ?? entity;

      const numericValue = code[1]?.toLowerCase() === 'x'
        ? Number.parseInt(code.slice(2), 16)
        : Number.parseInt(code.slice(1), 10);

      return Number.isFinite(numericValue) && numericValue <= 0x10ffff
        ? String.fromCodePoint(numericValue)
        : entity;
    });
}

function getTag(entry: string, tagName: string) {
  const escapedTagName = tagName.replace(':', '\\:');
  const match = entry.match(new RegExp(`<${escapedTagName}>([\\s\\S]*?)<\\/${escapedTagName}>`));
  return match ? decodeXml(match[1].trim()) : '';
}

async function getMessages(): Promise<Message[]> {
  try {
    const response = await fetch(YOUTUBE_FEED_URL, {
      headers: { Accept: 'application/atom+xml' },
      next: { revalidate: 3600 },
    });

    if (!response.ok) return [];

    const feed = await response.text();
    const entries = [...feed.matchAll(/<entry\b[^>]*>([\s\S]*?)<\/entry>/g)];

    return entries
      .map(([, entry]) => ({
        id: getTag(entry, 'yt:videoId'),
        title: getTag(entry, 'title'),
        publishedAt: getTag(entry, 'published'),
      }))
      .filter((message) => message.id && message.title && message.publishedAt);
  } catch {
    return [];
  }
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat('en-NG', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Africa/Lagos',
  }).format(new Date(date));
}

export default async function MessagesPage() {
  const messages = await getMessages();

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
              Watch Salem’s latest services and messages from the YouTube channel.
            </p>
            <Link
              href={YOUTUBE_CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-terracotta hover:underline"
            >
              <Youtube size={17} />
              Visit Salem’s YouTube channel
            </Link>
          </Reveal>

          {messages.length > 0 ? (
            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {messages.map((message, i) => (
                <Reveal key={message.id} delay={i * 0.06}>
                  <article className="group h-full overflow-hidden rounded-2xl border border-ink/[0.07] bg-white shadow-soft transition hover:-translate-y-1 hover:shadow-hover">
                    <a
                      href={`https://www.youtube.com/watch?v=${message.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Watch ${message.title} on YouTube`}
                      className="relative block aspect-video w-full overflow-hidden bg-ink-deep"
                    >
                      <Image
                        src={`https://i.ytimg.com/vi/${message.id}/hqdefault.jpg`}
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                      <span className="absolute inset-0 flex items-center justify-center bg-ink/15 text-white transition group-hover:bg-ink/35">
                        <PlayCircle size={48} strokeWidth={1.5} />
                      </span>
                    </a>
                    <div className="p-5">
                      <a
                        href={`https://www.youtube.com/watch?v=${message.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/title"
                      >
                        <h3 className="font-display text-base text-ink transition group-hover/title:text-terracotta">
                          {message.title}
                        </h3>
                      </a>
                      <p className="mt-2 text-xs text-ink-muted">{formatDate(message.publishedAt)}</p>
                      <a
                        href={`https://www.youtube.com/watch?v=${message.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-terracotta hover:underline"
                      >
                        Watch on YouTube
                      </a>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          ) : (
            <Reveal delay={0.1} className="mx-auto mt-14 max-w-xl">
              <div className="rounded-2xl border border-ink/[0.07] bg-white p-10 text-center shadow-soft">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-terracotta-soft text-terracotta">
                  <PlayCircle size={24} strokeWidth={1.8} />
                </div>
                <h3 className="mt-5 font-display text-lg text-ink">Watch Salem messages</h3>
                <p className="mt-2 text-sm leading-6 text-ink-muted">
                  Salem’s YouTube videos will appear here when the channel feed is available. You can
                  also browse the full video library on YouTube.
                </p>
                <Link
                  href={YOUTUBE_CHANNEL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-terracotta px-5 py-3 text-sm font-semibold text-white transition hover:bg-terracotta-dark"
                >
                  <Youtube size={17} />
                  Browse Salem videos
                </Link>
                <Link
                  href="/media/live"
                  className="mx-auto mt-4 flex w-fit items-center gap-2 text-sm font-semibold text-terracotta hover:underline"
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
