import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight, BookOpen, Sparkles } from 'lucide-react';
import { PageShell } from '@/components/page-shell';
import { PageHero } from '@/components/page-hero';
import { Reveal } from '@/components/reveal';

export const metadata: Metadata = { title: 'Fresh Impact Bookshop | Salem Africa' };

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
                <span className="inline-flex w-fit items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 font-label text-[10px] font-semibold uppercase tracking-[0.2em] text-blue-700">
                  <Sparkles size={14} />
                  Under development
                </span>
                <h2 className="mt-7 max-w-lg font-display text-3xl leading-tight text-ink sm:text-4xl">
                  A fresh collection is on its way.
                </h2>
                <p className="mt-5 max-w-lg text-sm leading-7 text-ink-muted sm:text-base">
                  We’re preparing the Fresh Impact Bookshop. Book listings and purchase links will be
                  added as soon as they’re ready.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 rounded-full bg-blue-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-800"
                  >
                    Contact Salem
                    <ArrowUpRight size={16} />
                  </Link>
                  <Link
                    href="/"
                    className="inline-flex items-center rounded-full border border-ink/10 px-5 py-3 text-sm font-semibold text-ink transition hover:border-ink/25 hover:bg-surface"
                  >
                    Back to home
                  </Link>
                </div>
              </div>

              <div className="relative flex min-h-[320px] items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-[#f4f7fc] to-[#e8edf6] p-8 sm:min-h-[420px]">
                <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full border border-blue-200/70" />
                <div className="absolute -right-8 -top-12 h-56 w-56 rounded-full border border-blue-200/60" />
                <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-white/50 blur-2xl" />
                <div className="relative flex h-56 w-56 items-center justify-center rounded-[2rem] border border-white/80 bg-white/75 shadow-[0_24px_80px_rgba(20,53,112,0.14)] backdrop-blur sm:h-64 sm:w-64">
                  <div className="absolute inset-4 rounded-[1.5rem] border border-blue-100" />
                  <BookOpen size={104} strokeWidth={1.1} className="relative text-blue-700" />
                  <div className="absolute -bottom-5 -right-6 rounded-xl border border-blue-100 bg-white px-4 py-3 shadow-soft">
                    <p className="font-label text-[9px] font-semibold uppercase tracking-[0.2em] text-blue-700">
                      Fresh Impact
                    </p>
                    <p className="mt-1 text-xs text-ink-muted">Bookshop coming soon</p>
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
