import Link from 'next/link';

/**
 * The black, glowing CTA box thispresenthouse.org closes its homepage
 * with — two soft red blurs behind a centered headline and one pill CTA.
 */
export function CtaBox() {
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="relative mx-auto max-w-container overflow-hidden rounded-3xl bg-black px-6 py-20 text-center sm:py-28">
        <div
          className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(184,46,44,0.45) 0%, rgba(184,46,44,0) 70%)' }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-32 -right-16 h-96 w-96 rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(138,34,33,0.4) 0%, rgba(138,34,33,0) 70%)' }}
          aria-hidden
        />

        <div className="relative z-10">
          <h2 className="mx-auto max-w-xl text-4xl leading-[1.05] text-white sm:text-6xl">
            Your Journey
            <br />
            Starts Here.
          </h2>
          <p className="mx-auto mt-6 max-w-md text-sm leading-7 text-white/70 sm:text-base">
            Whether you&apos;re looking for answers, searching for community, or ready to serve, there&apos;s
            a place for you in the Salem family.
          </p>
          <Link
            href="/contact"
            className="mt-9 inline-flex items-center justify-center rounded-full bg-terracotta px-9 py-4 text-xs font-bold uppercase tracking-[0.16em] text-white transition hover:bg-terracotta-dark"
          >
            Visit Us
          </Link>
        </div>
      </div>
    </section>
  );
}
