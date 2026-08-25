import type { Metadata } from 'next';
import { PageShell } from '@/components/page-shell';
import { PageHero } from '@/components/page-hero';
import { MediaTabs } from '@/components/media-tabs';
import { Reveal } from '@/components/reveal';
import { ImageWithFallback } from '@/components/image-with-fallback';
import { Camera } from 'lucide-react';

export const metadata: Metadata = { title: 'Service Pictures | Salem Africa' };

/**
 * Service galleries. Each entry points at /public/images/gallery/<file> —
 * until the real photo is dropped in under that exact name, ImageWithFallback
 * renders a branded placeholder tile instead of a broken image.
 */
const GALLERY: Array<{ caption: string; image: string }> = [
  { caption: 'Sunday Celebration', image: '/images/gallery/sunday-celebration.jpg' },
  { caption: 'Word Encounter', image: '/images/gallery/word-encounter.jpg' },
  { caption: 'Prayer & Intercession', image: '/images/gallery/prayer-intercession.jpg' },
  { caption: 'Worship Team', image: '/images/gallery/worship-team.jpg' },
  { caption: 'Children’s Church', image: '/images/gallery/childrens-church.jpg' },
  { caption: 'Baptism Service', image: '/images/gallery/baptism-service.jpg' },
  { caption: 'Outreach & Missions', image: '/images/gallery/outreach-missions.jpg' },
  { caption: 'Youth Gathering', image: '/images/gallery/youth-gathering.jpg' },
];

export default function PicturesPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Gallery"
        title="Service Pictures"
        subtitle="Moments of worship, fellowship and community from across Salem Africa."
        image="/images/hero-bg-4.jpg"
      />
      <MediaTabs />

      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <Reveal className="mx-auto max-w-2xl text-center">
            <span className="font-label text-xs font-semibold uppercase tracking-[0.3em] text-terracotta">
              Photo Gallery
            </span>
            <h2 className="mt-3 font-display text-3xl text-ink sm:text-4xl">Life in the house</h2>
            <p className="mt-4 text-sm leading-7 text-ink-muted">
              A look at our gatherings — from Sunday celebration to outreach in the community.
            </p>
          </Reveal>

          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {GALLERY.map(({ caption, image }, i) => (
              <Reveal key={caption} delay={i * 0.05}>
                <figure className="group overflow-hidden rounded-2xl border border-ink/[0.07] bg-white shadow-soft transition hover:-translate-y-1 hover:shadow-hover">
                  <ImageWithFallback
                    src={image}
                    alt={caption}
                    label={caption}
                    className="aspect-[4/3] w-full"
                    imgClassName="object-cover transition duration-500 group-hover:scale-105"
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  />
                  <figcaption className="p-4 text-sm font-semibold text-ink">{caption}</figcaption>
                </figure>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.15} className="mx-auto mt-14 max-w-xl">
            <div className="flex items-start gap-4 rounded-2xl border border-gold/30 bg-gold-soft p-6">
              <Camera size={22} className="mt-0.5 shrink-0 text-gold-dark" />
              <div>
                <h3 className="font-display text-base text-ink">Photos coming soon</h3>
                <p className="mt-1.5 text-sm leading-6 text-ink-muted">
                  These tiles are placeholders. Drop real photos into{' '}
                  <code className="rounded bg-white/70 px-1.5 py-0.5 text-xs">
                    public/images/gallery/
                  </code>{' '}
                  using the filenames listed in the page source and they will render automatically.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </PageShell>
  );
}
