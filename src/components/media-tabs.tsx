'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Radio, PlayCircle, Headphones, Images, type LucideIcon } from 'lucide-react';

const TABS: Array<{ href: string; label: string; icon: LucideIcon }> = [
  { href: '/media/live', label: 'Live', icon: Radio },
  { href: '/media/messages', label: 'Previous Messages', icon: PlayCircle },
  { href: '/media/audio', label: 'Audio', icon: Headphones },
  { href: '/media/pictures', label: 'Service Pictures', icon: Images },
];

export function MediaTabs() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-sand-line bg-sand">
      <div className="mx-auto flex max-w-container gap-2 overflow-x-auto px-4 py-4 sm:px-6 lg:px-8">
        {TABS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? 'page' : undefined}
              className={`inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.08em] transition ${
                active
                  ? 'bg-terracotta text-white'
                  : 'border border-ink/10 bg-white text-ink-muted hover:border-terracotta/30 hover:text-terracotta'
              }`}
            >
              <Icon size={15} strokeWidth={1.9} />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
