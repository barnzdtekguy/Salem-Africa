'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const SLIDES = [
  {
    src: '/images/hero-bg-1.jpg',
    kicker: 'Salem Family · 37 Locations',
    title: 'SAVING, HEALING, MAKING MANY MIGHTY.',
    href: '/churches',
    cta: 'Find a Church Near You',
  },
  {
    src: '/images/hero-bg-2.jpg',
    kicker: 'This Season',
    title: 'RAISING GOD AN ARMY.',
    href: '/vision',
    cta: 'See Our Mandate',
  },
  {
    src: '/images/hero-bg-3.jpg',
    kicker: 'One Family, Five Nations',
    title: 'STRONG IN FAITH, EMPOWERED BY WISDOM.',
    href: '/about',
    cta: 'Our Story',
  },
  {
    src: '/images/hero-bg-4.jpg',
    kicker: "What's On",
    title: 'JOIN US THIS SUNDAY.',
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
    <section className="relative h-screen min-h-[600px] w-full overflow-hidden bg-black text-white">
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
          <div className="absolute inset-0 bg-black/45" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-black/40" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 pb-24 pt-32 text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="kicker text-base text-white sm:text-lg">{slide.kicker}</p>
            <h1 className="mx-auto mt-6 max-w-4xl text-[2.75rem] leading-[1.02] text-white sm:text-6xl lg:text-[5.5rem]">
              {slide.title}
            </h1>
            <Link
              href={slide.href}
              className="mt-10 inline-flex items-center justify-center rounded-full bg-terracotta px-9 py-4 text-xs font-bold uppercase tracking-[0.16em] text-white transition hover:bg-terracotta-dark"
            >
              {slide.cta}
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="absolute inset-x-0 bottom-8 z-10 flex items-center justify-center gap-6">
        <button
          type="button"
          aria-label="Previous slide"
          onClick={() => setIndex((i) => (i - 1 + SLIDES.length) % SLIDES.length)}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25 text-white transition hover:bg-white/10"
        >
          <ChevronLeft size={16} />
        </button>
        <span className="font-sans text-xs tracking-[0.2em] text-white/70">
          {String(index + 1).padStart(2, '0')} / {String(SLIDES.length).padStart(2, '0')}
        </span>
        <button
          type="button"
          aria-label="Next slide"
          onClick={() => setIndex((i) => (i + 1) % SLIDES.length)}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25 text-white transition hover:bg-white/10"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </section>
  );
}
