'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Search, X, ArrowRight, Users, HandHeart, GraduationCap, UsersRound, Truck, Wallet,
  Mic2, Sparkles, Video, Wrench, ShieldCheck, HelpingHand, Coins, HeartPulse, BookOpen,
  Droplets, Scale, BookMarked, Cross, Phone, HeartHandshake, UserCheck, Megaphone,
  UserCog, Cookie, DoorOpen, Award, Theater, Gift, Compass, Handshake,
  type LucideIcon,
} from 'lucide-react';
import { MINISTRIES, type Ministry } from '@/data/ministries';
import { ImageWithFallback } from '@/components/image-with-fallback';

const ICONS: Record<string, LucideIcon> = {
  Missions: Compass,
  Prayer: HandHeart,
  KDF: UsersRound,
  Training: GraduationCap,
  'Assimilation & Covenant Friends': Users,
  Transport: Truck,
  'Wealth Creation & Cooperative': Wallet,
  'Faith Dynamite Voice': Mic2,
  Decoration: Sparkles,
  Media: Video,
  'Facility Management & Projects': Wrench,
  Security: ShieldCheck,
  Welfare: HelpingHand,
  Finance: Coins,
  Medical: HeartPulse,
  'Education & Scholarship': BookOpen,
  'Baptism Ministry': Droplets,
  'Legal Council': Scale,
  'Bookshop & Reading Culture': BookMarked,
  'Healing & Deliverance Crack Team': Cross,
  'Counselling & Call Centre': Phone,
  'Marriage & Couples': HeartHandshake,
  'Singles Connect': UserCheck,
  Ushering: DoorOpen,
  Visitation: HandHeart,
  'Publicity & Branding': Megaphone,
  'Salem Elders Ministry': Award,
  Communion: Cookie,
  'Sanctuary Keepers': ShieldCheck,
  'Affinity Leadership': UserCog,
  Announcement: Megaphone,
  'Salem Theatre': Theater,
  Dedication: Gift,
  Protocol: UserCog,
  'Conflict Resolution Team': Handshake,
};

function iconFor(name: string): LucideIcon {
  return ICONS[name] ?? Sparkles;
}

// The full roster runs as a single row. Duplicating it lets the track loop
// seamlessly: the animation slides -50% -> 0, so cards travel left to right.
const LOOP = [...MINISTRIES, ...MINISTRIES];

function MinistryCard({ ministry, onOpen }: { ministry: Ministry; onOpen: (m: Ministry) => void }) {
  const Icon = iconFor(ministry.name);
  return (
    <button
      type="button"
      onClick={() => onOpen(ministry)}
      className="group flex h-full w-72 shrink-0 flex-col overflow-hidden rounded-2xl border border-ink/[0.07] bg-white text-left shadow-soft transition hover:-translate-y-1 hover:border-terracotta/25 hover:shadow-hover"
    >
      <ImageWithFallback
        src={ministry.image}
        alt={ministry.name}
        label={ministry.name}
        className="aspect-[16/10] w-full"
        imgClassName="object-cover transition duration-500 group-hover:scale-105"
        sizes="288px"
      />
      <div className="flex flex-1 flex-col p-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-terracotta-soft text-terracotta transition group-hover:bg-terracotta group-hover:text-white">
          <Icon size={17} strokeWidth={1.8} />
        </div>
        <h3 className="mt-3 font-display text-base text-ink">{ministry.name}</h3>
        <p className="mt-1 line-clamp-2 text-xs leading-5 text-ink-muted">{ministry.description}</p>
      </div>
    </button>
  );
}

export function MinistriesMarquee() {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState<Ministry | null>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;
    return MINISTRIES.filter((m) =>
      [m.name, m.description, ...m.subMinistries].join(' ').toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div>
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
        <div className="relative mx-auto max-w-xl">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search 35 ministries..."
            className="w-full rounded-full border border-ink/10 bg-white py-3.5 pl-12 pr-5 text-sm text-ink shadow-soft placeholder:text-ink-faint focus:border-terracotta focus:outline-none"
          />
        </div>
        <p className="mt-4 text-center text-xs text-ink-muted">
          {results ? `${results.length} of ${MINISTRIES.length} ministries` : `${MINISTRIES.length} ministries — tap any card for full details`}
        </p>
      </div>

      {results ? (
        <div className="mx-auto mt-8 max-w-container px-4 sm:px-6 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {results.map((ministry) => (
              <MinistryCard key={ministry.name} ministry={ministry} onOpen={setActive} />
            ))}
            {results.length === 0 && (
              <p className="col-span-full rounded-2xl border border-ink/[0.07] bg-white p-8 text-center text-sm text-ink-muted">
                No ministries match that search.
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="group relative mt-8 overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-paper to-transparent sm:w-24" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-paper to-transparent sm:w-24" />
          <div className="animate-marquee-reverse flex w-max gap-4 px-4 group-hover:[animation-play-state:paused]">
            {LOOP.map((ministry, i) => (
              <MinistryCard key={`${ministry.name}-${i}`} ministry={ministry} onOpen={setActive} />
            ))}
          </div>
        </div>
      )}

      {active && (
        <div className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center sm:p-6">
          <div className="absolute inset-0 bg-ink-deep/65 backdrop-blur-sm" onClick={() => setActive(null)} aria-hidden />

          <div className="relative max-h-[88vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white shadow-panel sm:rounded-3xl">
            <button
              type="button"
              onClick={() => setActive(null)}
              aria-label="Close"
              className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-ink shadow-soft transition hover:bg-white"
            >
              <X size={18} />
            </button>

            <ImageWithFallback
              src={active.image}
              alt={active.name}
              label={active.name}
              className="aspect-[16/9] w-full"
              sizes="(min-width: 640px) 32rem, 100vw"
            />

            <div className="p-7">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-terracotta-soft text-terracotta">
                {(() => {
                  const Icon = iconFor(active.name);
                  return <Icon size={22} strokeWidth={1.8} />;
                })()}
              </div>

              <h2 className="mt-4 font-display text-2xl text-ink">{active.name}</h2>
              <p className="mt-3 text-sm leading-7 text-ink-muted">{active.description}</p>

              {active.subMinistries.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-label text-xs font-semibold uppercase tracking-wider text-terracotta">Sub-Ministries</h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {active.subMinistries.map((s) => (
                      <span key={s} className="rounded-full border border-ink/10 bg-sand px-3 py-1.5 text-xs text-ink">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <Link
                href="/contact"
                className="mt-7 inline-flex items-center gap-2 rounded-full bg-terracotta px-5 py-3 text-sm font-semibold text-white transition hover:bg-terracotta-dark"
              >
                Get Involved
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
