'use client';

import { useMemo, useState } from 'react';
import { Search, Phone, ExternalLink } from 'lucide-react';
import { CHURCHES, type Church } from '@/data/churches';
import { ImageWithFallback } from '@/components/image-with-fallback';

export function ChurchLocator() {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Church>(CHURCHES[0]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return CHURCHES;
    return CHURCHES.filter((c) =>
      [c.churchName, c.country, c.state, c.city, c.fullAddress, c.pastorName]
        .join(' ')
        .toLowerCase()
        .includes(q)
    );
  }, [query]);

  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(selected.googleMapsQuery)}&output=embed`;
  const directionsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selected.googleMapsQuery)}`;

  return (
    <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
      <div className="relative mx-auto max-w-xl">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by city, state, country, or pastor..."
          className="w-full rounded-full border border-ink/10 bg-white py-3.5 pl-12 pr-5 text-sm text-ink shadow-soft placeholder:text-ink-faint focus:border-terracotta focus:outline-none"
        />
      </div>

      <p className="mt-4 text-center text-xs text-ink-muted">
        {results.length} of {CHURCHES.length} church locations
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        <div className="max-h-[640px] space-y-3 overflow-y-auto pr-1 lg:max-h-[70vh]">
          {results.map((church) => {
            const active = church.id === selected.id;
            return (
              <button
                key={church.id}
                type="button"
                onClick={() => setSelected(church)}
                className={`flex w-full gap-4 rounded-2xl border p-4 text-left transition ${
                  active
                    ? 'border-terracotta/30 bg-terracotta-soft shadow-soft'
                    : 'border-ink/[0.07] bg-white hover:border-terracotta/20 hover:shadow-soft'
                }`}
              >
                <ImageWithFallback
                  src={church.imagePlaceholder}
                  alt={church.churchName}
                  label={church.city}
                  className="h-16 w-16 shrink-0 rounded-xl"
                  sizes="64px"
                />

                <div className="min-w-0 flex-1">
                  <h3 className="font-display text-sm leading-snug text-ink">{church.churchName}</h3>
                  <p className="mt-1 text-xs text-ink-muted">{church.fullAddress}</p>
                  <p className="mt-1.5 text-xs font-semibold text-terracotta">{church.pastorName}</p>

                  {active && (
                    <div className="mt-3 flex flex-wrap gap-2 border-t border-terracotta/10 pt-3">
                      {church.pastorPhones[0] && (
                        <a
                          href={`tel:${church.pastorPhones[0]}`}
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-2 text-xs font-semibold text-ink shadow-sm transition hover:text-terracotta"
                        >
                          <Phone size={13} /> {church.pastorPhones[0]}
                        </a>
                      )}
                      <a
                        href={directionsHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1.5 rounded-full bg-terracotta px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-terracotta-dark"
                      >
                        <ExternalLink size={13} /> Directions
                      </a>
                    </div>
                  )}
                </div>
              </button>
            );
          })}

          {results.length === 0 && (
            <p className="rounded-2xl border border-ink/[0.07] bg-white p-8 text-center text-sm text-ink-muted">
              No churches match that search.
            </p>
          )}
        </div>

        <div className="h-[380px] overflow-hidden rounded-2xl border border-ink/[0.07] shadow-soft lg:sticky lg:top-24 lg:h-[70vh]">
          <iframe
            key={selected.id}
            src={mapSrc}
            title={`Map for ${selected.churchName}`}
            className="h-full w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </div>
  );
}
