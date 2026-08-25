import Image from 'next/image';
import Link from 'next/link';

/**
 * Full-bleed feature banner — the site's second homepage beat, echoing
 * thispresenthouse.org's video-hero section (dark overlay, one huge
 * centered headline, one pill CTA). Uses a still image in place of video.
 */
export function FeatureBanner() {
  return (
    <section className="relative flex h-[70vh] min-h-[480px] items-center justify-center overflow-hidden bg-black text-center text-white">
      <Image src="/images/bg-ministries.jpg" alt="" fill className="object-cover opacity-60" />
      <div className="absolute inset-0 bg-black/35" />

      <div className="relative z-10 mx-auto max-w-3xl px-6">
        <h2 className="text-4xl leading-[1.05] text-white sm:text-6xl">COME AS YOU ARE. FIND YOUR PLACE.</h2>
        <Link
          href="/contact"
          className="mt-9 inline-flex items-center justify-center rounded-full bg-white px-9 py-4 text-xs font-bold uppercase tracking-[0.16em] text-ink transition hover:bg-terracotta-soft"
        >
          Plan Your Visit
        </Link>
      </div>
    </section>
  );
}
