import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Download } from 'lucide-react';
import { PageShell } from '@/components/page-shell';
import { PageHero } from '@/components/page-hero';
import { PublicContentUnavailable } from '@/components/public-content-unavailable';
import { loadPublicDevotional } from '@/lib/content/repository';
import { renderSafeMarkdown } from '@/lib/content/markdown';
import { formatCalendarDate } from '@/lib/content/calendar-date';

type RouteContext = { params: Promise<{ slug: string }> };
export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: 'Daily Devotion | Salem Africa' };

function formatDate(date: string) {
  return formatCalendarDate(date, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default async function DevotionalPage({ params }: RouteContext) {
  const { slug } = await params;
  const result = await loadPublicDevotional(slug);
  if (result.status === 'unavailable') {
    return <PublicContentUnavailable title="Daily Devotion" image="/images/hero-bg-3.jpg" />;
  }
  const item = result.value;
  if (!item) notFound();

  const data = item.data;
  const scripture = typeof data.scriptureText === 'string' ? data.scriptureText : '';
  const message = typeof data.message === 'string' ? data.message : '';
  const prayer = typeof data.prayer === 'string' ? data.prayer : '';

  return (
    <PageShell>
      <PageHero
        eyebrow={item.publication_date ? formatDate(item.publication_date) ?? 'Daily Devotional' : 'Daily Devotional'}
        title={item.title}
        subtitle={typeof data.author === 'string' ? `By ${data.author}` : ''}
        image={item.image_url || '/images/hero-bg-3.jpg'}
      />
      <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
        <p className="text-sm text-ink-muted">{item.publication_date ? formatDate(item.publication_date) ?? 'Daily Devotion' : 'Daily Devotion'}</p>
        {typeof data.author === 'string' && data.author && (
          <p className="mt-1 text-sm text-ink-muted">By {data.author}</p>
        )}
        <a
          href={`/api/devotionals/${encodeURIComponent(item.slug)}/pdf`}
          className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full border border-ink/15 px-5 text-sm font-semibold text-ink transition hover:bg-sand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
        >
          <Download size={16} aria-hidden="true" /> Download PDF
        </a>
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
        <h2 className="font-display text-2xl text-ink">Scripture: {typeof data.bibleReference === 'string' ? data.bibleReference : ''}</h2>
        <blockquote className="mt-4 border-l-2 border-gold pl-5 text-lg leading-8 text-ink">
          {scripture}
        </blockquote>
        <div
          className="prose prose-lg mt-10 max-w-none text-ink-muted"
          dangerouslySetInnerHTML={{ __html: renderSafeMarkdown(message) }}
        />
        <section className="mt-12 border-t border-ink/10 pt-8" aria-labelledby="devotional-prayer-heading">
          <h2 id="devotional-prayer-heading" className="text-center font-display text-2xl text-ink">Prayer</h2>
          <div
            className="prose mt-4 max-w-none text-ink-muted"
            dangerouslySetInnerHTML={{ __html: renderSafeMarkdown(prayer) }}
          />
        </section>
        {typeof data.furtherReading === 'string' && data.furtherReading && (
          <p className="mt-8 text-sm text-ink-muted"><strong>Further reading:</strong> {data.furtherReading}</p>
        )}
        <Link href="/devotionals" className="mt-10 inline-flex min-h-11 items-center text-sm font-semibold text-terracotta hover:underline">
          Browse all devotionals
        </Link>
      </article>
    </PageShell>
  );
}
