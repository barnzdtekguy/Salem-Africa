import Link from 'next/link';
import {
  ArrowRight,
  Headphones,
  Images,
  PlayCircle,
  Radio,
  type LucideIcon,
} from 'lucide-react';
import { Reveal } from '@/components/reveal';

const MEDIA_LINKS: Array<{
  href: string;
  title: string;
  text: string;
  icon: LucideIcon;
}> = [
  {
    href: '/media/live',
    title: 'Watch live',
    text: 'Join a Salem service stream from wherever you are.',
    icon: Radio,
  },
  {
    href: '/media/messages',
    title: 'Previous messages',
    text: 'Return to services and messages in the video library.',
    icon: PlayCircle,
  },
  {
    href: '/media/audio',
    title: 'Audio messages',
    text: 'The audio archive is being prepared for listening.',
    icon: Headphones,
  },
  {
    href: '/media/pictures',
    title: 'Service pictures',
    text: 'See the gallery page for moments from Salem gatherings.',
    icon: Images,
  },
];

export function HomeMediaPreview() {
  return (
    <section aria-labelledby="home-media-heading" className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="font-label text-xs font-semibold uppercase tracking-[0.3em] text-gold-dark">
            Watch, listen, connect
          </p>
          <h2 id="home-media-heading" className="mt-3 font-display text-3xl text-ink sm:text-4xl">
            Salem, wherever you are
          </h2>
          <p className="mt-3 text-sm leading-6 text-ink-muted">
            Join live, revisit a message, or explore the media library.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {MEDIA_LINKS.map(({ href, title, text, icon: Icon }, index) => (
            <Reveal key={href} delay={index * 0.06}>
              <Link
                href={href}
                className="group flex h-full min-h-56 flex-col rounded-2xl border border-ink/[0.07] bg-surface p-6 shadow-soft transition duration-300 hover:-translate-y-1 hover:border-gold/50 hover:bg-white hover:shadow-hover"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/15 text-gold-dark">
                  <Icon size={22} strokeWidth={1.8} aria-hidden="true" />
                </span>
                <h3 className="mt-5 font-display text-lg text-ink">{title}</h3>
                <p className="mt-2 flex-1 text-sm leading-6 text-ink-muted">{text}</p>
                <span className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-ink transition group-hover:text-gold-dark">
                  Explore
                  <ArrowRight
                    size={15}
                    className="transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
