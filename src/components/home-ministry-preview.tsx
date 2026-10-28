import Link from 'next/link';
import {
  ArrowRight,
  Compass,
  GraduationCap,
  HandHeart,
  Truck,
  Users,
  UsersRound,
  type LucideIcon,
} from 'lucide-react';
import { MINISTRIES } from '@/data/ministries';
import { Reveal } from '@/components/reveal';

const FEATURED_NAMES = [
  'Missions',
  'Prayer',
  'KDF',
  'Training',
  'Assimilation & Covenant Friends',
  'Transport',
];

const MINISTRY_ICONS: Record<string, LucideIcon> = {
  Missions: Compass,
  Prayer: HandHeart,
  KDF: UsersRound,
  Training: GraduationCap,
  'Assimilation & Covenant Friends': Users,
  Transport: Truck,
};

const FEATURED_MINISTRIES = MINISTRIES.filter((ministry) =>
  FEATURED_NAMES.includes(ministry.name)
);

export function HomeMinistryPreview() {
  return (
    <section aria-labelledby="home-ministries-heading" className="bg-sand py-20 sm:py-28">
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
        <Reveal className="flex flex-wrap items-end justify-between gap-5">
          <div className="max-w-xl">
            <p className="font-label text-xs font-semibold uppercase tracking-[0.3em] text-gold-dark">
              Find your place
            </p>
            <h2 id="home-ministries-heading" className="mt-3 font-display text-3xl text-ink sm:text-4xl">
              Many ways to serve
            </h2>
            <p className="mt-3 text-sm leading-6 text-ink-muted">
              Explore a few of the ministry teams serving the Salem family and our communities.
            </p>
          </div>
          <Link
            href="/ministries"
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-ink/15 px-5 py-2.5 text-sm font-semibold text-ink transition hover:border-gold/60 hover:text-ink"
          >
            View all {MINISTRIES.length} ministries
            <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </Reveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURED_MINISTRIES.map((ministry, index) => {
            const Icon = MINISTRY_ICONS[ministry.name];

            return (
              <Reveal key={ministry.name} delay={index * 0.06}>
                <article className="group flex h-full flex-col rounded-2xl border border-ink/[0.07] bg-white p-6 shadow-soft transition duration-300 hover:-translate-y-1 hover:border-gold/50 hover:shadow-hover">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/15 text-gold-dark">
                    <Icon size={22} strokeWidth={1.8} aria-hidden="true" />
                  </div>
                  <h3 className="mt-4 font-display text-lg text-ink">{ministry.name}</h3>
                  <p className="mt-2 line-clamp-2 flex-1 text-sm leading-6 text-ink-muted">
                    {ministry.description}
                  </p>
                  <Link
                    href="/ministries"
                    className="mt-4 inline-flex min-h-11 w-fit items-center gap-2 text-sm font-semibold text-ink transition hover:text-gold-dark"
                  >
                    Explore ministry
                    <ArrowRight
                      size={15}
                      className="transition-transform group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </Link>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
