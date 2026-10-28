import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, BookOpen, HandCoins, Mail, Compass } from 'lucide-react';
import { Reveal } from '@/components/reveal';

interface Tile {
  href: string;
  eyebrow: string;
  title: string;
  text: string;
  image?: string;
  gradient?: string;
  icon?: React.ReactNode;
  imageSizes?: string;
  external?: boolean;
}

const STANDARD_TILE_SIZES = '(min-width: 1280px) 304px, (min-width: 1024px) 25vw, (min-width: 640px) 50vw, calc(100vw - 2rem)';

const TILES: Tile[] = [
  {
    href: '/ministries',
    eyebrow: '35 Ministry Arms',
    title: 'Find where you fit',
    text: 'From Prayer to Media to Missions — browse every ministry and see how to get involved.',
    image: '/images/bg-ministries.jpg',
    imageSizes: STANDARD_TILE_SIZES,
  },
  {
    href: '/events',
    eyebrow: 'What\u2019s On',
    title: 'Weekly services',
    text: 'See the weekly service schedule and the latest flyers.',
    image: '/images/hero-bg-2.jpg',
    imageSizes: STANDARD_TILE_SIZES,
  },
  {
    href: '/about',
    eyebrow: 'Our Story',
    title: 'About Salem',
    text: 'The mandate, the history, the founder.',
    image: '/images/samamaga.jpg',
    imageSizes: STANDARD_TILE_SIZES,
  },
  {
    href: '/vision',
    eyebrow: 'The Blueprint',
    title: 'Vision & mandate',
    text: 'Our message, priorities and goals.',
    gradient: 'from-ink to-black',
    icon: <Compass size={26} strokeWidth={1.6} />,
  },
  {
    href: '/leadership',
    eyebrow: 'Our Covering',
    title: 'Leadership',
    text: 'Meet the team.',
    image: '/images/bishopenobong.jpg',
    imageSizes: STANDARD_TILE_SIZES,
  },
  {
    href: '/churches',
    eyebrow: '37 Locations',
    title: 'Find a church',
    text: 'Search by city or country.',
    image: '/images/hero-bg-3.jpg',
    imageSizes: STANDARD_TILE_SIZES,
  },
  {
    href: '/give',
    eyebrow: 'Sow a Seed',
    title: 'Give online',
    text: 'Tithes, missions & building.',
    gradient: 'from-terracotta to-terracotta-dark',
    icon: <HandCoins size={26} strokeWidth={1.6} />,
  },
  {
    href: '/contact',
    eyebrow: 'Reach Us',
    title: 'Contact',
    text: 'Questions, prayer, counsel.',
    gradient: 'from-terracotta-dark to-black',
    icon: <Mail size={26} strokeWidth={1.6} />,
  },
  {
    href: '/media/messages',
    eyebrow: 'Watch Again',
    title: 'Sermons & media',
    text: 'Watch previous messages and explore Salem media.',
    image: '/images/hero-bg-1.jpg',
    imageSizes: STANDARD_TILE_SIZES,
  },
  {
    href: 'https://www.freshimpact.store/',
    eyebrow: 'Fresh Impact',
    title: 'Bookshop',
    text: 'Browse books and resources from the Fresh Impact Bookshop.',
    gradient: 'from-ink to-navy-700',
    icon: <BookOpen size={26} strokeWidth={1.6} />,
    external: true,
  },
];

export function ExploreGrid() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-xl text-center">
          <span className="font-label text-xs font-semibold uppercase tracking-[0.3em] text-gold-dark">
            Explore Salem Africa
          </span>
          <h2 className="mt-3 font-display text-3xl text-ink sm:text-4xl">Everything, in one place</h2>
          <p className="mt-3 text-sm leading-6 text-ink-muted">
            Tap into any part of the Salem family — the full story sits one click away.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TILES.map((tile, i) => (
            <Reveal
              key={tile.href}
              delay={i * 0.05}
              className={tile.title === 'Find where you fit' ? 'sm:col-span-2 lg:col-span-2' : ''}
            >
              <Link
                href={tile.href}
                target={tile.external ? '_blank' : undefined}
                rel={tile.external ? 'noopener noreferrer' : undefined}
                className="group relative flex h-full min-h-[180px] flex-col justify-end overflow-hidden rounded-2xl shadow-soft transition hover:shadow-hover"
              >
                {tile.image ? (
                  <>
                    <Image
                      src={tile.image}
                      alt=""
                      fill
                      className="object-cover transition duration-700 ease-out group-hover:scale-105"
                      sizes={tile.imageSizes}
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
