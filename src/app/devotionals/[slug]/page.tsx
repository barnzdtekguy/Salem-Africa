import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { PageShell } from '@/components/page-shell';
import { PageHero } from '@/components/page-hero';
import { getPublicDevotional } from '@/lib/content/repository';
import { renderSafeMarkdown } from '@/lib/content/markdown';

type RouteContext = { params: Promise<{ slug: string }> };
export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: RouteContext): Promise<Metadata> {
  const { slug } = await params;
  const item = await getPublicDevotional(slug);
  return { title: item ? `${item.title} | Salem Africa` : 'Devotional | Salem Africa' };
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat('en-NG', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Africa/Lagos',
  }).format(new Date(`${date}T12:00:00+01:00`));
}

export default async function DevotionalPage({ params }: RouteContext) {
  const { slug } = await params;
  const item = await getPublicDevotional(slug);
  if (!item) notFound();

  const data = item.data;
  const scripture = typeof data.scriptureText === 'string' ? data.scriptureText : '';
  const message = typeof data.message === 'string' ? data.message : '';
  const prayer = typeof data.prayer === 'string' ? data.prayer : '';

  return (
    <PageShell>
      <PageHero
        eyebrow={item.publication_date ? formatDate(item.publication_date) : 'Daily Devotional'}
        title={item.title}
        subtitle={typeof data.author === 'string' ? `By ${data.author}` : ''}
        image={item.image_url || '/images/hero-bg-3.jpg'}
      />
      <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
        {item.image_url && (
          <Image
            src={item.image_url}
            alt={item.image_alt}
            width={1200}
            height={700}
            unoptimized
            className="mb-10 h-auto max-h-[560px] w-full object-contain"
          />
        )}
        <p className="font-label text-xs font-semibold uppercase tracking-[0.2em] text-terracotta">
          {typeof data.bibleReference === 'string' ? data.bibleReference : ''}
        </p>
        <blockquote className="mt-4 border-l-2 border-gold pl-5 text-lg leading-8 text-ink">
          {scripture}
        </blockquote>
        <div
          className="prose prose-lg mt-10 max-w-none text-ink-muted"
          dangerouslySetInnerHTML={{ __html: renderSafeMarkdown(message) }}
        />
        <section className="mt-12 border-t border-ink/10 pt-8" aria-labelledby="devotional-prayer-heading">
          <h2 id="devotional-prayer-heading" className="font-display text-2xl text-ink">Prayer</h2>
          <div
            className="prose mt-4 max-w-none text-ink-muted"
            dangerouslySetInnerHTML={{ __html: renderSafeMarkdown(prayer) }}
          />
        </section>
        {typeof data.furtherReading === 'string' && data.furtherReading && (
          <p className="mt-8 text-sm text-ink-muted"><strong>Further reading:</strong> {data.furtherReading}</p>
        )}
      </article>
    </PageShell>
  );
}
