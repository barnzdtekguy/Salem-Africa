'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export function ReadMore({ children, preview }: { children: React.ReactNode; preview: React.ReactNode }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div>
      {preview}

      <div
        className={`grid transition-all duration-500 ease-out ${
          expanded ? 'mt-4 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">{children}</div>
      </div>

      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        className="mt-5 inline-flex items-center gap-2 rounded-full bg-terracotta px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-terracotta-dark"
      >
        {expanded ? 'Read Less' : 'Read More'}
        <ChevronDown size={16} className={`transition-transform ${expanded ? 'rotate-180' : ''}`} />
      </button>
    </div>
  );
}
