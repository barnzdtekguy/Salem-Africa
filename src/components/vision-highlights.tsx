import { ShieldCheck, BookOpen, Heart, Rocket } from 'lucide-react';
import { Reveal } from '@/components/reveal';
import { SectionTexture } from '@/components/section-texture';

const HIGHLIGHTS = [
  {
    icon: ShieldCheck,
    title: 'Strong in Faith',
    text: 'Rooted deeply in the Word of God, moving mountains through unwavering belief.',
  },
  {
    icon: BookOpen,
    title: 'Empowered by Wisdom',
    text: 'Operating with divine intelligence to dominate every sphere of life.',
  },
  {
    icon: Heart,
    title: 'Intimacy with the Holy Spirit',
    text: "Building a daily, transformational relationship with God's presence.",
  },
  {
    icon: Rocket,
    title: 'Doing Exploits',
    text: 'Fulfilling prophetic destiny and impacting our generation boldly.',
  },
];

export function VisionHighlights() {
  return (
    <section className="relative overflow-hidden bg-ink-deep py-20 sm:py-28">
      <SectionTexture />

      <div className="relative mx-auto max-w-container px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-xl text-center">
          <span className="font-label text-xs font-semibold uppercase tracking-[0.3em] text-gold">Our Mandate</span>
          <h2 className="mt-3 font-display text-3xl text-white sm:text-4xl">Vision Highlights</h2>
        </Reveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {HIGHLIGHTS.map(({ icon: Icon, title, text }, i) => (
            <Reveal key={title} delay={i * 0.08}>
              <div className="h-full rounded-2xl border border-white/10 bg-white/[0.04] p-7 text-center backdrop-blur-sm transition hover:-translate-y-1 hover:border-gold/30 hover:bg-white/[0.07]">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold/15 text-gold">
                  <Icon size={24} strokeWidth={1.8} />
                </div>
                <h3 className="mt-5 font-display text-lg text-white">{title}</h3>
                <p className="mt-2.5 text-sm leading-6 text-white/60">{text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
