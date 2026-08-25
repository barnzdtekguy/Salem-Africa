'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';

export interface AccordionItem {
  icon: React.ReactNode;
  title: string;
  content: React.ReactNode;
}

export function Accordion({ items }: { items: AccordionItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-4">
      {items.map((item, i) => {
        const open = openIndex === i;
        return (
          <div
            key={item.title}
            className={`overflow-hidden rounded-2xl border bg-white shadow-soft transition ${
              open ? 'border-terracotta/25' : 'border-ink/[0.07]'
            }`}
          >
            <button
              type="button"
              onClick={() => setOpenIndex(open ? null : i)}
              className={`flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition sm:px-7 sm:py-5 ${
                open ? 'bg-terracotta-soft' : 'hover:bg-sand'
              }`}
            >
              <span className="flex min-w-0 items-center gap-3.5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink/[0.06] text-terracotta">
                  {item.icon}
                </span>
                <span className="font-display text-base text-ink sm:text-lg">{item.title}</span>
              </span>
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-terracotta/25 text-terracotta transition-transform duration-300 ${
                  open ? 'rotate-45' : ''
                }`}
              >
                <Plus size={16} />
              </span>
            </button>

            <div
              className={`grid transition-all duration-400 ease-out ${
                open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
              }`}
            >
              <div className="overflow-hidden">
                <div className="px-5 pb-6 pt-1 text-sm leading-7 text-ink-muted sm:px-7 sm:pl-[4.75rem]">
                  {item.content}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
