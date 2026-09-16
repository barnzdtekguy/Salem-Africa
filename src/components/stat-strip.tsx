import { CHURCHES } from '@/data/churches';
import { MINISTRIES } from '@/data/ministries';
import { Reveal } from '@/components/reveal';
import { CountUp } from '@/components/motion/count-up';

const FOUNDING_YEAR = 1986;

export function StatStrip() {
  const nations = new Set(CHURCHES.map((c) => c.country)).size;
  const years = new Date().getFullYear() - FOUNDING_YEAR;

  // Value and suffix are separate so the counter animates the number and leaves
  // the "+" pinned. Same figures as before, still derived from the data.
  const stats = [
    { value: CHURCHES.length, suffix: '', label: 'Church locations' },
    { value: nations, suffix: '', label: 'Nations reached' },
    { value: MINISTRIES.length, suffix: '', label: 'Ministry arms' },
    { value: years, suffix: '+', label: 'Years of mandate' },
  ];

  return (
    <section className="bg-black" data-surface="dark">
      <div className="mx-auto max-w-container px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 sm:gap-6">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.06} className="text-center sm:text-left">
              {/*
                Gold, not terracotta: the red measured 2.84:1 on this navy and
                failed WCAG even at 60px. Gold clears 8.79:1.
              */}
              <p className="text-5xl text-gold sm:text-6xl">
                <CountUp value={s.value} suffix={s.suffix} />
              </p>
              <p className="mt-2 text-xs font-medium uppercase tracking-[0.14em] text-white/55 sm:text-sm">
                {s.label}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
