'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, Menu, X } from 'lucide-react';

interface MegaItem {
  href: string;
  title: string;
  text: string;
}

interface NavEntry {
  label: string;
  href?: string;
  items?: MegaItem[];
}

const NAV: NavEntry[] = [
  { label: 'Home', href: '/' },
  {
    label: 'About',
    items: [
      { href: '/about', title: 'Who We Are', text: 'The history and heart of Salem Africa.' },
      { href: '/vision', title: 'Vision & Mandate', text: 'The blueprint guiding our global impact.' },
      { href: '/leadership', title: 'Our Leadership', text: 'Meet our bishops, pastors and leaders.' },
      { href: '/churches', title: 'Our Churches', text: '37 locations across 5 nations.' },
    ],
  },
  {
    label: 'Ministries',
    items: [
      { href: '/ministries', title: 'All Ministries', text: '35 ministry arms — find where you fit.' },
      { href: '/ministries', title: 'Missions', text: 'Sharing Christ across nations.' },
      { href: '/ministries', title: 'Welfare', text: 'Care for all.' },
      { href: '/ministries', title: 'Training', text: 'Raising the next generation.' },
    ],
  },
  {
    label: 'Media',
    items: [
      { href: '/media/live', title: 'Live', text: 'Join the service as it happens.' },
      { href: '/media/messages', title: 'Previous Messages', text: 'Watch past sermons on demand.' },
      { href: '/media/audio', title: 'Audio', text: 'Listen to messages on the go.' },
      { href: '/media/pictures', title: 'Service Pictures', text: 'Moments from our gatherings.' },
    ],
  },
  { label: 'Events', href: '/events' },
  { label: 'Contact', href: '/contact' },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileGroup, setMobileGroup] = useState<string | null>(null);
  // The mobile panel is portalled, which can only happen after mount. `open` is
  // false on the server anyway, so nothing visible is missing from the SSR
  // output and there is no hydration mismatch.
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // Escape closes the menu — otherwise a keyboard user has to tab all the way
  // through 18 links to reach the close button.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  /*
   * Rendered through a portal into <body>, not inside <header>.
   *
   * The header carries `backdrop-blur`, and a non-none `backdrop-filter` makes
   * an element a containing block for its `position: fixed` descendants. Left
   * as a child of the header, this panel's `inset-0` resolved against the
   * header's 80px-tall box instead of the viewport: the nav collapsed to 0px
   * under `overflow-y-auto` and only the Give button — which overflowed below
   * the box — stayed visible. Portalling to <body> puts the panel back in the
   * viewport's containing block.
   *
   * `invisible` when closed also takes all 18 links out of the tab order.
   * `visibility` is animatable and stays visible for the duration of a
   * transition, so the slide-out still plays before it hides.
   */
  const mobileMenu = (
    <div
      id="mobile-menu"
      // `bg-ink-deep/95` compiles to an escaped class the stylesheet's dark
      // selectors can't match, so the surface declares itself: this swaps the
      // focus ring to gold (8.79:1 here, vs. red's failing 2.84:1) and darkens
      // the scrollbar the nav now shows.
      data-surface="dark"
      className={`fixed inset-0 z-[60] bg-ink-deep/95 backdrop-blur-xl transition-[transform,visibility] duration-500 ease-entrance lg:hidden ${
        open ? 'visible translate-x-0' : 'invisible translate-x-full'
      }`}
    >
      <div className="flex h-full flex-col p-8">
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="flex h-10 w-10 items-center justify-center text-white"
          >
            <X size={28} strokeWidth={1.8} />
          </button>
        </div>

        <nav className="mt-6 flex flex-1 flex-col gap-1 overflow-y-auto">
          {NAV.map((entry) =>
            entry.items ? (
              <div key={entry.label} className="border-b border-white/10 py-3">
                <button
                  type="button"
                  onClick={() => setMobileGroup((g) => (g === entry.label ? null : entry.label))}
                  aria-expanded={mobileGroup === entry.label}
                  aria-controls={`mobile-group-${entry.label}`}
                  className="flex w-full items-center justify-between text-left text-2xl font-bold text-white"
                >
                  {entry.label}
                  <ChevronDown
                    size={20}
                    className={`transition-transform ${mobileGroup === entry.label ? 'rotate-180' : ''}`}
                  />
                </button>
                <div
                  id={`mobile-group-${entry.label}`}
                  className={`grid transition-all duration-300 ease-entrance ${
                    mobileGroup === entry.label ? 'mt-3 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="flex flex-col gap-1 overflow-hidden pl-1">
                    {entry.items.map((item) => (
                      <Link
                        key={item.title}
                        href={item.href}
                        // Collapsed sub-items must leave the tab order too, or
                        // focus disappears into a zero-height row.
                        tabIndex={mobileGroup === entry.label ? undefined : -1}
                        aria-hidden={mobileGroup !== entry.label}
                        className="py-2 text-base font-medium text-white/70"
                      >
                        {item.title}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={entry.label}
                href={entry.href!}
                className="border-b border-white/10 py-3 text-2xl font-bold text-white"
              >
                {entry.label}
              </Link>
            )
          )}
        </nav>

        <Link
          href="/give"
          className="mt-6 flex shrink-0 items-center justify-center rounded-full bg-terracotta px-5 py-4 text-sm font-bold uppercase tracking-[0.1em] text-white"
        >
          Give Online
        </Link>
      </div>
    </div>
  );

  return (
    <header
      data-surface="dark"
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-ink-deep/90 backdrop-blur-md' : 'bg-black/15 backdrop-blur-sm'
      }`}
    >
      <div className="mx-auto flex h-20 max-w-container items-center justify-between border-b border-white/10 px-4 sm:px-6 lg:h-24 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-3">
          <Image src="/images/logo.png" alt="Salem Africa" width={44} height={44} className="h-9 w-9 object-contain sm:h-10 sm:w-10" />
          <span className="hidden text-sm font-semibold leading-tight text-white sm:block">
            Salem Int&apos;l Christian Centre
            <span className="block text-xs font-normal text-white/60">Lekki, Lagos</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {NAV.map((entry) =>
            entry.items ? (
              <div key={entry.label} className="group relative py-8">
                <button
                  type="button"
                  className="flex items-center gap-1 text-sm font-medium tracking-wide text-white/75 transition hover:text-white"
                >
                  {entry.label}
                  <ChevronDown size={13} className="transition-transform duration-300 group-hover:rotate-180" />
                </button>

                <div className="pointer-events-none absolute left-1/2 top-full w-[440px] -translate-x-1/2 translate-y-2 pt-2 opacity-0 transition-all duration-300 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100">
                  <div className="grid grid-cols-2 gap-3 rounded-2xl border border-black/5 bg-white p-5 shadow-panel">
                    {entry.items.map((item) => (
                      <Link
                        key={item.title}
                        href={item.href}
                        className="group/item rounded-xl p-3 text-left transition hover:bg-terracotta-soft"
                      >
                        <p className="text-sm font-bold text-ink transition group-hover/item:text-terracotta">{item.title}</p>
                        <p className="mt-1 text-xs text-ink-muted">{item.text}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={entry.label}
                href={entry.href!}
                className={`text-sm font-medium tracking-wide transition hover:text-white ${
                  pathname === entry.href ? 'text-white' : 'text-white/75'
                }`}
              >
                {entry.label}
              </Link>
            )
          )}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/give"
            className="hidden rounded-full bg-white px-7 py-3 text-xs font-bold uppercase tracking-[0.1em] text-ink transition hover:bg-terracotta-soft lg:inline-block"
          >
            Give
          </Link>

          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="flex h-10 w-10 items-center justify-center text-white lg:hidden"
          >
            <Menu size={26} strokeWidth={1.8} />
          </button>
        </div>
      </div>

      {mounted ? createPortal(mobileMenu, document.body) : null}
    </header>
  );
}
