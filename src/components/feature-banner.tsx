import Image from 'next/image';
import Link from 'next/link';

/** Full-bleed feature banner that pairs Salem photography with a clear invitation. */
export function FeatureBanner() {
  return (
    <section className="relative flex h-[70vh] min-h-[480px] items-center justify-center overflow-hidden bg-black text-center text-white">
      <Image src="/images/bg-ministries.jpg" alt="" fill sizes="100vw" className="object-cover opacity-60" />
      <div className="absolute inset-0 bg-black/35" />

      <div className="relative z-10 mx-auto max-w-3xl px-6">
        <h2 className="text-4xl leading-[1.05] tracking-[-0.05em] text-white sm:text-6xl">
          Come as you are.<br />Find your <em className="font-serif font-normal">place.</em>
        </h2>
        <Link
          href="/contact"
          className="mt-9 inline-flex items-center justify-center rounded-[3px] bg-white px-7 py-4 text-xs font-semibold text-ink transition hover:bg-terracotta-soft"
        >
          Plan Your Visit
        </Link>
      </div>
    </section>
  );
}
