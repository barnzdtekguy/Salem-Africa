import type { Metadata } from 'next';
import { PageShell } from '@/components/page-shell';
import { PageHero } from '@/components/page-hero';
import { Reveal } from '@/components/reveal';
import { Accordion, type AccordionItem } from '@/components/accordion';
import { Scroll, MessageCircle, Target, LayoutGrid, TrendingUp, Gem, Flame } from 'lucide-react';

export const metadata: Metadata = { title: 'Vision & Mandate | Salem Africa' };

const ITEMS: AccordionItem[] = [
  {
    icon: <Scroll size={18} strokeWidth={1.8} />,
    title: 'Visionary Mandate & History',
    content: (
      <>
        <h3 className="font-label text-sm font-semibold uppercase tracking-wider text-terracotta">
          Visionary Mandate
        </h3>
        <p className="font-display text-lg italic text-ink">&ldquo;Raising God an Army, Making Many Mighty.&rdquo;</p>
        <h3 className="mt-5 font-label text-sm font-semibold uppercase tracking-wider text-terracotta">History</h3>
        <p>
          On the 7th of March, 1986, the Lord spoke to Archbishop Sam Amaga to raise Him an army of
          people who are:
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Strong in Faith</li>
          <li>Empowered by Wisdom</li>
          <li>Intimate with the Holy Ghost</li>
          <li>Doing exploits in life and for God.</li>
        </ul>
      </>
    ),
  },
  {
    icon: <MessageCircle size={18} strokeWidth={1.8} />,
    title: 'Our Message',
    content: <p>We are taking the Word of Faith and the power of the Holy Ghost to the families of the Earth.</p>,
  },
  {
    icon: <Target size={18} strokeWidth={1.8} />,
    title: 'Our Priorities',
    content: (
      <ul className="list-disc space-y-2 pl-5">
        <li>To love God, serve God and make Heaven.</li>
        <li>To help others love God, serve God and make Heaven.</li>
      </ul>
    ),
  },
  {
    icon: <LayoutGrid size={18} strokeWidth={1.8} />,
    title: 'Four Platforms For Fulfilling This Mandate',
    content: (
      <ul className="list-disc space-y-2 pl-5">
        <li>Church Platform</li>
        <li>Education Ministry</li>
        <li>Media Ministry</li>
        <li>Missions and Outreaches</li>
      </ul>
    ),
  },
  {
    icon: <TrendingUp size={18} strokeWidth={1.8} />,
    title: 'Goals',
    content: (
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-terracotta">Short-Term Goal</h3>
          <p>7 Million Disciples</p>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-terracotta">Medium-Term Goal</h3>
          <p>10 Million Disciples, growing to 100 Million Disciples</p>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-terracotta">Long-Term Goal</h3>
          <p>300 Million Disciples</p>
        </div>
      </div>
    ),
  },
  {
    icon: <Gem size={18} strokeWidth={1.8} />,
    title: 'Core Values',
    content: (
      <ul className="grid list-disc grid-cols-1 gap-x-6 gap-y-2 pl-5 sm:grid-cols-2">
        {[
          'Practical Peace and Righteousness',
          'Faith and Wisdom',
          'Intimacy with the Holy Spirit',
          'Confidence and Positive Mentality',
          'Capacity Building',
          'Integrity',
          'Responsibility',
          'Diligence',
          'Sacrifice',
          'Living Ready, Rapturable and Rewardable',
        ].map((v) => (
          <li key={v}>{v}</li>
        ))}
      </ul>
    ),
  },
  {
    icon: <Flame size={18} strokeWidth={1.8} />,
    title: 'Our Passion & Commission',
    content: (
      <>
        <h3 className="font-label text-sm font-semibold uppercase tracking-wider text-terracotta">Our Passion</h3>
        <ul className="list-disc space-y-2 pl-5">
          <li>Soul Winning</li>
          <li>Discipleship</li>
          <li>Training believers</li>
          <li>Raising great leaders</li>
          <li>Church establishment</li>
        </ul>
        <h3 className="mt-5 font-label text-sm font-semibold uppercase tracking-wider text-terracotta">
          Commission Mandate
        </h3>
        <p>To establish 300 Million disciples as leaders across 150,000 churches worldwide if Jesus tarries.</p>
      </>
    ),
  },
];

export default function VisionPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="The Blueprint"
        title="Vision & Mandate"
        subtitle="The spiritual blueprint guiding our global impact."
        image="/images/hero-bg-2.jpg"
      />

      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <Accordion items={ITEMS} />
          </Reveal>
        </div>
      </section>
    </PageShell>
  );
}
