'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const SLIDES = [
  {
    src: '/images/hero-bg-1.jpg',
    kicker: 'Salem Family',
    title: <>Saving. Healing.<br />Making many <em>Mighty.</em></>,
    href: '/churches',
    cta: 'Find a Church Near You',
  },
  {
    src: '/images/hero-bg-2.jpg',
    kicker: 'This Season',
    title: <>Raising God&apos;s <em>army.</em></>,
    href: '/vision',
    cta: 'See Our Mandate',
  },
  {
    src: '/images/hero-bg-3.jpg',
    kicker: 'One Family',
    title: <>Strong in faith.<br />Empowered by <em>wisdom.</em></>,
    href: '/about',
    cta: 'Our Story',
  },
  {
    src: '/images/hero-bg-4.jpg',
    kicker: "What's On",
    title: <>Join us this <em>Sunday.</em></>,
    href: '/events',
    cta: 'See Upcoming Events',
  },
];

export function HeroSlider() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), 7000);
    return () => clearInterval(id);
  }, []);

  const slide = SLIDES[index];

  return (
    <section className="relative h-[calc(100svh-5rem)] min-h-[600px] w-full overflow-hidden bg-black text-white lg:h-[calc(100svh-5.75rem)]">
      <AnimatePresence initial={false}>
        <motion.div
          key={index}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.4, ease: 'easeInOut' }}
        >
          <Image src={slide.src} alt="" fill priority={index === 0} className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/42 to-black/10" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/20" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 flex h-full flex-col items-start justify-center px-[7%] pb-24 pt-16 text-left">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="mb-6 flex items-center gap-3 font-label text-[10px] font-semibold uppercase tracking-[0.22em] text-white/90">
              <span className="h-0.5 w-6 bg-terracotta" aria-hidden="true" />
              {slide.kicker}
            </p>
            <h1 className="max-w-4xl text-5xl font-semibold leading-[1.04] tracking-[-0.055em] text-white sm:text-6xl lg:text-[clamp(4rem,6vw,6rem)] [&_em]:font-serif [&_em]:font-normal [&_em]:italic">
              {slide.title}
            </h1>
            <p className="mt-6 max-w-[42ch] text-sm leading-7 text-white/80 sm:text-base">
              A church family across 37 locations and 35 ministries, raising an army strong in faith and empowered by wisdom.
            </p>
            <Link
              href={slide.href}
              className="mt-8 inline-flex items-center gap-8 rounded-[3px] bg-terracotta px-6 py-4 text-xs font-semibold text-white transition hover:bg-terracotta-dark"
            >
              {slide.cta}
              <span className="text-lg leading-none" aria-hidden="true">
                ↗
              </span>
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="absolute inset-x-[7%] bottom-8 z-10 flex items-center justify-between gap-6">
        <p className="hidden text-[9px] font-medium uppercase tracking-[0.18em] text-white/70 sm:block">Lagos, Nigeria</p>
        <div className="flex items-center gap-5">
          <button
            type="button"
            aria-label="Previous slide"
            onClick={() => setIndex((i) => (i - 1 + SLIDES.length) % SLIDES.length)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/30 text-white transition hover:bg-white/10"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="font-sans text-[10px] tracking-[0.2em] text-white/75">
            {String(index + 1).padStart(2, '0')} / {String(SLIDES.length).padStart(2, '0')}
          </span>
          <button
            type="button"
            aria-label="Next slide"
            onClick={() => setIndex((i) => (i + 1) % SLIDES.length)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/30 text-white transition hover:bg-white/10"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}
