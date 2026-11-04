import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { isPublicationToday, loadPublicDevotionals } from '@/lib/content/repository';
import { renderSafeMarkdown } from '@/lib/content/markdown';
import { formatCalendarDate, normalizeCalendarDate } from '@/lib/content/calendar-date';

function formatLagosDate(date: string) {
  return formatCalendarDate(date, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export async function HomeDevotional() {
  const result = await loadPublicDevotionals();
  if (result.status === 'unavailable') {
    return (
      <section className="bg-white py-16 sm:py-20" aria-labelledby="home-devotional-heading">
        <div className="mx-auto max-w-container px-4 text-center sm:px-6 lg:px-8">
          <h2 id="home-devotional-heading" className="font-display text-2xl text-ink">Daily Devotion</h2>
          <p className="mt-3 text-sm text-ink-muted">Today’s devotional is temporarily unavailable. Please try again later.</p>
        </div>
      </section>
    );
  }
  const devotionals = result.value;
  const devotional = devotionals.find((item) => isPublicationToday(item)) ?? devotionals[0];
  if (!devotional) return null;

  const message = typeof devotional.data.message === 'string' ? devotional.data.message : '';

  return (
    <section className="bg-white py-16 sm:py-20" aria-labelledby="home-devotional-heading">
      <div className="mx-auto grid max-w-container gap-8 px-4 sm:px-6 lg:grid-cols-[.7fr_1.3fr] lg:items-center lg:px-8">
        <div>
          <p className="font-label text-xs font-semibold uppercase tracking-[0.3em] text-gold-dark">
            {isPublicationToday(devotional) ? 'Today’s devotional' : 'Latest devotional'}
          </p>
          <h2 id="home-devotional-heading" className="mt-3 font-display text-3xl text-ink">
            {devotional.title}
          </h2>
          <p className="mt-3 text-sm text-ink-muted">
            {formatLagosDate(
              devotional.publication_date
                ?? (devotional.publication_date_invalid ? null : normalizeCalendarDate(devotional.created_at.slice(0, 10)))
                ?? '',
            ) ?? 'Date unavailable'}
            {typeof devotional.data.author === 'string' && ` · ${devotional.data.author}`}
          </p>
          {typeof devotional.data.bibleReference === 'string' && (
            <p className="mt-2 text-sm font-semibold text-terracotta">{devotional.data.bibleReference}</p>
          )}
          <Link href={`/devotionals/${devotional.slug}`} className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-terracotta hover:underline">
            Read devotional <ArrowRight size={16} aria-hidden="true" />
          </Link>
          <Link href="/devotionals" className="ml-5 inline-flex min-h-11 items-center text-sm font-semibold text-ink-muted hover:underline">
            All devotionals
          </Link>
        </div>
        <div
          className="prose max-w-none text-sm leading-7 text-ink-muted"
          dangerouslySetInnerHTML={{ __html: renderSafeMarkdown(message.slice(0, 900)) }}
        />
      </div>
    </section>
  );
}
