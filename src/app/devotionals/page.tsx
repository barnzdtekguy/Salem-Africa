import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Download, ArrowRight } from 'lucide-react';
import { PageHero } from '@/components/page-hero';
import { PageShell } from '@/components/page-shell';
import { loadPublicDevotionals } from '@/lib/content/repository';
import { formatCalendarDate, normalizeCalendarDate } from '@/lib/content/calendar-date';

export const metadata: Metadata = { title: 'Daily Devotion | Salem Africa' };
export const dynamic = 'force-dynamic';

function publicationDate(item: { publication_date: string | null; publication_date_invalid?: boolean; created_at: string }) {
  if (item.publication_date_invalid) return null;
  return normalizeCalendarDate(item.publication_date)
    ?? (item.publication_date === null ? normalizeCalendarDate(item.created_at.slice(0, 10)) : null);
}

function formatDate(date: string) {
  return formatCalendarDate(date, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function monthLabel(date: string) {
  return formatCalendarDate(date, {
    month: 'long',
    year: 'numeric',
  });
}

export default async function DevotionalsPage() {
  const result = await loadPublicDevotionals();
  if (result.status === 'unavailable') {
    return (
      <PageShell>
        <PageHero
          eyebrow="Grow in the Word"
          title="Daily Devotion"
          subtitle="Scripture, reflection, and prayer for every day."
          image="/images/hero-bg-3.jpg"
        />
        <main className="py-16 sm:py-24">
          <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
            <section className="mx-auto max-w-2xl py-10 text-center" aria-labelledby="devotional-unavailable-heading">
              <h2 id="devotional-unavailable-heading" className="font-display text-2xl text-ink">Devotionals are temporarily unavailable</h2>
              <p className="mt-3 text-sm leading-7 text-ink-muted">Please try again later.</p>
            </section>
          </div>
        </main>
      </PageShell>
    );
  }
  const devotionals = result.value;
  const [latest, ...previous] = devotionals;
  const months = new Map<string, typeof previous>();
  const undated: typeof previous = [];
  for (const item of previous) {
    const date = publicationDate(item);
    if (!date) {
      undated.push(item);
      continue;
    }
    const key = date.slice(0, 7);
    months.set(key, [...(months.get(key) ?? []), item]);
  }

  return (
    <PageShell>
      <PageHero
        eyebrow="Grow in the Word"
        title="Daily Devotion"
        subtitle="Scripture, reflection, and prayer for every day."
        image="/images/hero-bg-3.jpg"
      />
      <main className="py-16 sm:py-24">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          {!latest ? (
            <section className="mx-auto max-w-2xl py-10 text-center" aria-labelledby="devotional-empty-heading">
              <h2 id="devotional-empty-heading" className="font-display text-2xl text-ink">A daily word is coming soon</h2>
              <p className="mt-3 text-sm leading-7 text-ink-muted">
                No devotionals have been published yet. Please check back soon for scripture, reflection, and prayer.
              </p>
            </section>
          ) : (
            <>
              <section aria-labelledby="latest-devotional-heading">
                <h2 id="latest-devotional-heading" className="mb-8 text-center font-display text-2xl text-ink sm:text-3xl">
                  Latest Devotional
                </h2>
                <article className="mx-auto grid max-w-5xl overflow-hidden border border-ink/[0.09] bg-white lg:grid-cols-[minmax(0,.85fr)_minmax(0,1.15fr)]">
                  {latest.image_url && (
                    <Image
                      src={latest.image_url}
                      alt={latest.image_alt || ''}
                      width={900}
                      height={700}
                      unoptimized
                      className="h-full max-h-[440px] w-full bg-sand object-cover lg:max-h-none"
                    />
                  )}
                  <div className="flex flex-col justify-center p-6 sm:p-10">
                    <p className="font-label text-xs font-semibold uppercase tracking-[0.18em] text-gold-dark">
                      {formatDate(publicationDate(latest) ?? '') ?? 'Date unavailable'}
                    </p>
                    <h3 className="mt-3 font-display text-2xl text-ink sm:text-3xl">{latest.title}</h3>
                    {typeof latest.data.author === 'string' && latest.data.author && (
                      <p className="mt-2 text-sm text-ink-muted">By {latest.data.author}</p>
                    )}
                    {typeof latest.data.bibleReference === 'string' && (
                      <p className="mt-4 text-sm font-semibold text-terracotta">{latest.data.bibleReference}</p>
                    )}
                    <div className="mt-6 flex flex-wrap gap-3">
                      <Link href={`/devotionals/${latest.slug}`} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-terracotta px-5 text-sm font-semibold text-white transition hover:bg-terracotta-dark">
                        Read devotional <ArrowRight size={16} aria-hidden="true" />
                      </Link>
                      <a href={`/api/devotionals/${encodeURIComponent(latest.slug)}/pdf`} className="inline-flex min-h-11 items-center gap-2 border border-ink/15 px-5 text-sm font-semibold text-ink transition hover:bg-sand">
                        <Download size={16} aria-hidden="true" /> Download PDF
                      </a>
                    </div>
                  </div>
                </article>
              </section>

              {previous.length > 0 && (
                <section className="mt-16 sm:mt-20" aria-labelledby="previous-devotionals-heading">
                  <h2 id="previous-devotionals-heading" className="mb-10 text-center font-display text-2xl text-ink sm:text-3xl">
                    Browse Previous Devotionals
                  </h2>
                  <div className="mx-auto max-w-4xl space-y-10">
                    {[...months.entries()].map(([month, items]) => (
                      <section key={month} aria-labelledby={`devotional-month-${month}`}>
                        <h3 id={`devotional-month-${month}`} className="mb-4 text-center font-label text-xs font-semibold uppercase tracking-[0.18em] text-gold-dark">
                          {monthLabel(`${month}-01`) ?? 'Date unavailable'}
                        </h3>
                        <ul className="divide-y divide-ink/10 border-y border-ink/10">
                          {items.map((item) => (
                            <li key={item.id} className="flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between">
                              <div>
                                <p className="text-xs font-medium text-ink-muted">{formatDate(publicationDate(item) ?? '') ?? 'Date unavailable'}</p>
                                <Link href={`/devotionals/${item.slug}`} className="mt-1 inline-block font-display text-lg text-ink hover:text-terracotta focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700">
                                  {item.title}
                                </Link>
                                {typeof item.data.bibleReference === 'string' && (
                                  <p className="mt-1 text-sm text-ink-muted">{item.data.bibleReference}</p>
                                )}
                              </div>
                              <div className="flex shrink-0 flex-wrap gap-4">
                                <Link href={`/devotionals/${item.slug}`} className="inline-flex min-h-11 items-center text-sm font-semibold text-terracotta hover:underline">
                                  Read
                                </Link>
                                <a href={`/api/devotionals/${encodeURIComponent(item.slug)}/pdf`} className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-ink hover:text-terracotta">
                                  <Download size={15} aria-hidden="true" /> Download PDF
                                </a>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </section>
                    ))}
                  </div>
                  {undated.length > 0 && (
                    <section className="mx-auto mt-10 max-w-4xl" aria-labelledby="devotional-undated-heading">
                      <h3 id="devotional-undated-heading" className="mb-4 text-center font-label text-xs font-semibold uppercase tracking-[0.18em] text-gold-dark">
                        Date unavailable
                      </h3>
                      <ul className="divide-y divide-ink/10 border-y border-ink/10">
                        {undated.map((item) => (
                          <li key={item.id} className="py-5">
                            <Link href={`/devotionals/${item.slug}`} className="font-display text-lg text-ink hover:text-terracotta">
                              {item.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}
                </section>
              )}
            </>
          )}
        </div>
      </main>
    </PageShell>
  );
}
