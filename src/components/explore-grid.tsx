import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, HandCoins, Mail, Compass } from 'lucide-react';
import { Reveal } from '@/components/reveal';

interface Tile {
  href: string;
  eyebrow: string;
  title: string;
  text: string;
  image?: string;
  gradient?: string;
  icon?: React.ReactNode;
  area: string;
}

const TILES: Tile[] = [
  {
    href: '/ministries',
    eyebrow: '35 Ministry Arms',
    title: 'Find where you fit',
    text: 'From Prayer to Media to Missions — browse every ministry and see how to get involved.',
    image: '/images/bg-ministries.jpg',
    area: 'lg:col-start-1 lg:row-start-1 lg:col-span-2 lg:row-span-2',
  },
  {
    href: '/events',
    eyebrow: 'What\u2019s On',
    title: 'Upcoming events',
    text: 'Conventions, camps, prayer nights and more — with a calendar you can save to your own.',
    image: '/images/hero-bg-2.jpg',
    area: 'lg:col-start-3 lg:row-start-1 lg:col-span-2 lg:row-span-1',
  },
  {
    href: '/about',
    eyebrow: 'Our Story',
    title: 'About Salem',
    text: 'The mandate, the history, the founder.',
    image: '/images/samamaga.jpg',
    area: 'lg:col-start-3 lg:row-start-2 lg:col-span-1 lg:row-span-1',
  },
  {
    href: '/vision',
    eyebrow: 'The Blueprint',
    title: 'Vision & mandate',
    text: 'Our message, priorities and goals.',
    gradient: 'from-ink to-black',
    icon: <Compass size={26} strokeWidth={1.6} />,
    area: 'lg:col-start-4 lg:row-start-2 lg:col-span-1 lg:row-span-1',
  },
  {
    href: '/leadership',
    eyebrow: 'Our Covering',
    title: 'Leadership',
    text: 'Meet the team.',
    image: '/images/bishopenobong.jpg',
    area: 'lg:col-start-1 lg:row-start-3 lg:col-span-1 lg:row-span-1',
  },
  {
    href: '/churches',
    eyebrow: '37 Locations',
    title: 'Find a church',
    text: 'Search by city or country.',
    image: '/images/hero-bg-3.jpg',
    area: 'lg:col-start-2 lg:row-start-3 lg:col-span-1 lg:row-span-1',
  },
  {
    href: '/give',
    eyebrow: 'Sow a Seed',
    title: 'Give online',
    text: 'Tithes, missions & building.',
    gradient: 'from-terracotta to-terracotta-dark',
    icon: <HandCoins size={26} strokeWidth={1.6} />,
    area: 'lg:col-start-3 lg:row-start-3 lg:col-span-1 lg:row-span-1',
  },
  {
    href: '/contact',
    eyebrow: 'Reach Us',
    title: 'Contact',
    text: 'Questions, prayer, counsel.',
    gradient: 'from-terracotta-dark to-black',
    icon: <Mail size={26} strokeWidth={1.6} />,
    area: 'lg:col-start-4 lg:row-start-3 lg:col-span-1 lg:row-span-1',
  },
];

export function ExploreGrid() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-xl text-center">
          <span className="font-label text-xs font-semibold uppercase tracking-[0.3em] text-terracotta">
            Explore Salem Africa
          </span>
          <h2 className="mt-3 font-display text-3xl text-ink sm:text-4xl">Everything, in one place</h2>
          <p className="mt-3 text-sm leading-6 text-ink-muted">
            Tap into any part of the Salem family — the full story sits one click away.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-3">
          {TILES.map((tile, i) => (
            <Reveal
              key={tile.href}
              delay={i * 0.05}
              className={`${tile.area} ${tile.title === 'Find where you fit' ? 'sm:col-span-2' : ''}`}
            >
              <Link
                href={tile.href}
                className="group relative flex h-full min-h-[180px] flex-col justify-end overflow-hidden rounded-2xl shadow-soft transition hover:shadow-hover"
              >
                {tile.image ? (
                  <>
                    <Image
                      src={tile.image}
                      alt=""
                      fill
                      className="object-cover transition duration-700 ease-out group-hover:scale-105"
                      sizes="(min-width: 1024px) 40vw, 90vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink-deep/90 via-ink-deep/35 to-ink-deep/10" />
                  </>
                ) : (
                  <div className={`absolute inset-0 bg-gradient-to-br ${tile.gradient}`} />
                )}

                {tile.icon && (
                  <div className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm">
                    {tile.icon}
                  </div>
                )}

                <div className="relative z-10 p-5 sm:p-6">
                  <p className="font-label text-[11px] font-semibold uppercase tracking-[0.14em] text-gold">
                    {tile.eyebrow}
                  </p>
                  <h3 className="mt-1.5 flex items-center gap-1.5 font-display text-xl text-white sm:text-2xl">
                    {tile.title}
                    <ArrowUpRight
                      size={18}
                      className="translate-x-0 opacity-0 transition group-hover:translate-x-1 group-hover:opacity-100"
                    />
                  </h3>
                  <p className="mt-1.5 max-w-xs text-xs leading-5 text-white/70 sm:text-sm">{tile.text}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
