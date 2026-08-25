import { CHURCHES } from '@/data/churches';
import { MINISTRIES } from '@/data/ministries';
import { Reveal } from '@/components/reveal';

const FOUNDING_YEAR = 1986;

export function StatStrip() {
  const nations = new Set(CHURCHES.map((c) => c.country)).size;
  const years = new Date().getFullYear() - FOUNDING_YEAR;

  const stats = [
    { value: `${CHURCHES.length}`, label: 'Church locations' },
    { value: `${nations}`, label: 'Nations reached' },
    { value: `${MINISTRIES.length}`, label: 'Ministry arms' },
    { value: `${years}+`, label: 'Years of mandate' },
  ];

  return (
    <section className="bg-black">
      <div className="mx-auto max-w-container px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 sm:gap-6">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.06} className="text-center sm:text-left">
              <p className="text-5xl text-terracotta sm:text-6xl">{s.value}</p>
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
