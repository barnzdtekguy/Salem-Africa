import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight, BookOpen, ExternalLink } from 'lucide-react';
import { PageShell } from '@/components/page-shell';
import { PageHero } from '@/components/page-hero';
import { Reveal } from '@/components/reveal';

export const metadata: Metadata = { title: 'Fresh Impact Bookshop | Salem Africa' };

const BOOKSHOP_URL = 'https://www.freshimpact.store/';

export default function StorePage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Salem Store"
        title="Fresh Impact Bookshop"
        subtitle="Books and resources to inspire faith, growth and a life of purpose."
        image="/images/hero-bg-2.jpg"
      />

      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="grid overflow-hidden rounded-[2rem] border border-ink/[0.07] bg-white shadow-panel lg:grid-cols-[1.05fr_0.95fr]">
              <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-16">
                <span className="inline-flex w-fit items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-2 font-label text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-dark">
                  <BookOpen size={14} />
                  Official online shop
                </span>
                <h2 className="mt-7 max-w-lg font-display text-3xl leading-tight text-ink sm:text-4xl">
                  Find your next read.
                </h2>
                <p className="mt-5 max-w-lg text-sm leading-7 text-ink-muted sm:text-base">
                  Visit Fresh Impact Bookshop to browse books and resources for faith, growth and a life
                  of purpose.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <a
                    href={BOOKSHOP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center gap-2 rounded-full bg-terracotta px-5 py-3 text-sm font-semibold text-white transition hover:bg-terracotta-dark"
                  >
                    Visit Fresh Impact Bookshop
                    <ExternalLink size={16} aria-hidden="true" />
                  </a>
                  <Link
                    href="/contact"
                    className="inline-flex min-h-11 items-center gap-2 rounded-full border border-ink/10 px-5 py-3 text-sm font-semibold text-ink transition hover:border-gold/40 hover:bg-surface"
                  >
                    Contact Salem
                    <ArrowUpRight size={16} />
                  </Link>
                </div>
              </div>

              <div className="relative flex min-h-[320px] items-center justify-center overflow-hidden bg-sand p-8 sm:min-h-[420px]">
                <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full border border-gold/30" />
                <div className="absolute -right-8 -top-12 h-56 w-56 rounded-full border border-gold/25" />
                <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-white/50 blur-2xl" />
                <div className="relative flex h-56 w-56 items-center justify-center rounded-[2rem] border border-white/80 bg-white/75 shadow-panel backdrop-blur sm:h-64 sm:w-64">
                  <div className="absolute inset-4 rounded-[1.5rem] border border-gold/20" />
                  <BookOpen size={104} strokeWidth={1.1} className="relative text-gold-dark" />
                  <div className="absolute -bottom-5 -right-6 rounded-xl border border-gold/20 bg-white px-4 py-3 shadow-soft">
                    <p className="font-label text-[9px] font-semibold uppercase tracking-[0.2em] text-gold-dark">
                      Fresh Impact
                    </p>
                    <p className="mt-1 text-xs text-ink-muted">Faith, growth and purpose</p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </PageShell>
  );
}
