'use client';

import { useId, useState } from 'react';
import Image from 'next/image';

const PALETTES: Array<[string, string]> = [
  ['#B82E2C', '#8a2221'], // terracotta brand red
  ['#8a2221', '#0B1B33'], // dark red into deep navy
  ['#0B1B33', '#1a2942'], // deep navy with a lighter navy edge
];

function paletteFor(seed: string): [string, string] {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  return PALETTES[hash % PALETTES.length];
}

/**
 * Drop-in replacement for next/image that renders a branded, on-theme
 * placeholder whenever the given `src` isn't present on disk yet. This is
 * how the asset pipeline works: data files point at conventional paths
 * under /public/assets/..., and until a real photo with that exact
 * filename is dropped in, this renders a designed placeholder instead of
 * a broken-image icon. No code changes are needed once the real file
 * exists — it just starts rendering automatically.
 */
export function ImageWithFallback({
  src,
  alt,
  label,
  seed,
  className = '',
  imgClassName = 'object-cover',
  sizes,
  priority,
}: {
  src: string;
  alt: string;
  label?: string;
  seed?: string;
  className?: string;
  imgClassName?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const patternId = useId();
  const [c1, c2] = paletteFor(seed ?? label ?? alt ?? src);
  const initial = (label ?? alt ?? '?').trim().charAt(0).toUpperCase() || '?';

  if (failed) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${c1} 0%, ${c2} 100%)` }} />
        <svg className="absolute inset-0 h-full w-full opacity-[0.15]" preserveAspectRatio="xMidYMid slice" aria-hidden>
          <pattern id={patternId} width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.6" fill="white" />
          </pattern>
          <rect width="100%" height="100%" fill={`url(#${patternId})`} />
        </svg>
        <div className="relative flex h-full w-full flex-col items-center justify-center gap-2 p-6 text-center">
          <span className="font-display text-3xl text-white/85">{initial}</span>
          {label && (
            <span className="max-w-[18ch] text-[10px] font-semibold uppercase tracking-[0.14em] text-white/65">
              {label}
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes ?? '100vw'}
        priority={priority}
        className={imgClassName}
        onError={() => setFailed(true)}
      />
    </div>
  );
}
