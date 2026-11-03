import type { Metadata } from 'next';
import Link from 'next/link';
import { PageShell } from '@/components/page-shell';
import { PageHero } from '@/components/page-hero';
import { getPublicDevotionals } from '@/lib/content/repository';

export const metadata: Metadata = { title: 'Daily Devotionals | Salem Africa' };
export const dynamic = 'force-dynamic';

function formatDate(date: string) {
  return new Intl.DateTimeFormat('en-NG', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Africa/Lagos',
  }).format(new Date(`${date}T12:00:00+01:00`));
}

export default async function DevotionalsPage() {
  const devotionals = await getPublicDevotionals();

  return (
    <PageShell>
      <PageHero
        eyebrow="Grow in the Word"
        title="Daily Devotionals"
        subtitle="Scripture, reflection, and prayer for every day."
        image="/images/hero-bg-3.jpg"
      />
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {devotionals.map((item) => (
              <article key={item.id} className="border border-ink/[0.09] bg-white p-6">
                <p className="font-label text-xs font-semibold uppercase tracking-[0.18em] text-gold-dark">
                  {item.publication_date ? formatDate(item.publication_date) : ''}
                </p>
                <h2 className="mt-3 font-display text-xl text-ink">{item.title}</h2>
                <p className="mt-2 text-sm text-ink-muted">
                  {typeof item.data.author === 'string' ? item.data.author : ''}
                </p>
                <p className="mt-3 text-sm font-semibold text-terracotta">
                  {typeof item.data.bibleReference === 'string' ? item.data.bibleReference : ''}
                </p>
                <Link href={`/devotionals/${item.slug}`} className="mt-5 inline-flex min-h-10 items-center text-sm font-semibold text-terracotta hover:underline">
                  Read devotional
                </Link>
              </article>
            ))}
          </div>
          {!devotionals.length && (
            <p className="py-16 text-center text-sm text-ink-muted">The next devotional will be available here soon.</p>
          )}
        </div>
      </section>
    </PageShell>
  );
}
