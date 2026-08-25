import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Reveal } from '@/components/reveal';

const LEADERS = [
  { name: 'Archbishop Dr Sam Amaga', role: 'Founder & Visionary', img: '/images/samamaga.jpg' },
  { name: 'Bishop Dr Love Sam Amaga', role: 'Co-Founder', img: '/images/bishoplove.jpg' },
  { name: 'Bishop Enobong Etteh', role: 'Continental Bishop Africa', img: '/images/bishopenobong.jpg' },
  { name: 'Rev Catherine Etteh', role: 'Senior Minister', img: '/images/catherine.jpg' },
  { name: 'Bishop David Onimisi', role: 'Regional Director', img: '/images/onimisi.jpg' },
  { name: 'Pastor Israel Eze', role: 'International Missions', img: '/images/israeleze.jpg' },
];

// Duplicated once for a seamless CSS-only marquee loop.
const LOOP = [...LEADERS, ...LEADERS];

export function LeadershipMarquee() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
        <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="font-label text-xs font-semibold uppercase tracking-[0.3em] text-terracotta">Our Covering</span>
            <h2 className="mt-3 font-display text-3xl text-ink sm:text-4xl">Leadership</h2>
          </div>
          <Link
            href="/leadership"
            className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-5 py-2.5 text-sm font-semibold text-ink transition hover:border-terracotta hover:text-terracotta"
          >
            View All Leaders
            <ArrowRight size={15} />
          </Link>
        </Reveal>
      </div>

      <div className="group relative overflow-hidden py-2">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-paper to-transparent sm:w-32" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-paper to-transparent sm:w-32" />

        <div className="flex w-max animate-marquee gap-6 group-hover:[animation-play-state:paused]">
          {LOOP.map((leader, i) => (
            <div
              key={`${leader.name}-${i}`}
              className="w-56 shrink-0 overflow-hidden rounded-2xl border border-ink/[0.06] bg-white shadow-soft transition hover:shadow-hover"
            >
              <div className="relative aspect-[4/5] w-full">
                <Image src={leader.img} alt={leader.name} fill className="object-cover" />
              </div>
              <div className="p-4 text-center">
                <h4 className="font-display text-sm text-ink">{leader.name}</h4>
                <p className="mt-1 text-xs text-ink-muted">{leader.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
