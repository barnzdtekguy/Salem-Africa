'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowUp, HandCoins } from 'lucide-react';

export function HomeQuickAccess() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById('home-hero');
    if (!hero) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { rootMargin: '-80px 0px 0px 0px' }
    );

    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  if (!visible) return null;

  return (
    <>
      <Link
        href="/give"
        className="fixed bottom-[calc(16px_+_env(safe-area-inset-bottom))] right-20 z-40 inline-flex min-h-12 items-center gap-2 rounded-full bg-terracotta px-4 text-sm font-semibold text-white shadow-panel transition hover:bg-terracotta-dark sm:bottom-[calc(24px_+_env(safe-area-inset-bottom))] sm:right-24"
      >
        <HandCoins size={17} aria-hidden="true" />
        Give
      </Link>
      <button
        type="button"
        onClick={() =>
          window.scrollTo({
            top: 0,
            behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
          })
        }
        aria-label="Back to top"
        className="fixed bottom-[calc(84px_+_env(safe-area-inset-bottom))] right-4 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-ink/10 bg-white text-ink shadow-soft transition hover:border-gold/50 hover:text-gold-dark sm:bottom-[calc(96px_+_env(safe-area-inset-bottom))] sm:right-6"
      >
        <ArrowUp size={18} aria-hidden="true" />
      </button>
    </>
  );
}
