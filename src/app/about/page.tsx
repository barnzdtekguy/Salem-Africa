import type { Metadata } from 'next';
import Image from 'next/image';
import { PageShell } from '@/components/page-shell';
import { PageHero } from '@/components/page-hero';
import { Reveal } from '@/components/reveal';
import { ReadMore } from '@/components/read-more';
import { SectionTexture } from '@/components/section-texture';
import { Flame, Globe2, GraduationCap, Landmark } from 'lucide-react';

export const metadata: Metadata = { title: 'About Us | Salem Africa' };

const TIMELINE = [
  {
    icon: Flame,
    year: 'The Inception',
    title: 'The Call of God',
    text: 'The foundation of the ministry was laid following a specific divine instruction to save, heal, and make mighty.',
  },
  {
    icon: Globe2,
    year: 'Global Expansion',
    title: 'Reaching The Nations',
    text: 'Establishment of major church branches across strategic cities in Africa, Europe, and America.',
  },
  {
    icon: GraduationCap,
    year: 'Educational Mandate',
    title: 'Raising The Next Generation',
    text: 'The launch of educational institutions and leadership academies to ground the youth in faith and excellence.',
  },
  {
    icon: Landmark,
    year: 'Present Day',
    title: 'A Continental Beacon',
    text: 'Continuing the legacy of impactful conventions, crusades, and community development across Africa.',
  },
];

export default function AboutPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Our Story"
        title="A Divine Mandate"
        subtitle="The genesis of a call to save, heal and make many mighty — and what it's grown into since."
        image="/images/hero-bg-1.jpg"
      />

      <section className="py-20 sm:py-28">
        <div className="mx-auto grid max-w-container items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <Reveal>
            <Image
              src="/images/samamaga.jpg"
              alt="Archbishop Dr Sam Amaga"
              width={520}
              height={640}
              className="mx-auto h-[560px] w-full max-w-md rounded-2xl object-cover shadow-panel"
            />
          </Reveal>

          <Reveal delay={0.1}>
            <span className="font-label text-xs font-semibold uppercase tracking-[0.3em] text-terracotta">Founder &amp; Visionary</span>
            <h2 className="mt-3 font-display text-3xl text-ink sm:text-4xl">Archbishop Dr Sam Amaga</h2>

            <ReadMore
              preview={
                <div className="mt-5 space-y-4 text-sm leading-7 text-ink-muted">
                  <p>
                    Dr. Sam Amaga is the founder of Salem International Christian Centre (SICC), Abuja,
                    Nigeria. He is also the presiding Archbishop of Foundation Faith Church Worldwide.
                    For almost 30 years in ministry, he has brought the raw, undiluted Word to his
                    generation and taught principles that have reflected in his leadership and added to
                    the posterity and integrity of the ministry.
                  </p>
                  <p>
                    He received the call into full-time ministry while heading the management of a
                    leading pharmaceutical company in Nigeria, in July 1982. A graduate of Microbiology,
                    he also holds a C.Th. (Counsellor of Theology) from the Freelandia Institute
                    (Evangelical College &amp; Seminary), 1988.
                  </p>
                </div>
              }
            >
              <div className="space-y-4">
                <p>
                  He was honoured in 1992 with a Doctor of Theology from Evangel Christian University of
                  America. In 1994, he and his wife were honoured with Doctor of Divinity from the All
                  Nations for Christ Bible Institute, Benin City, Nigeria.
                </p>
                <h3 className="font-display text-lg text-ink">Apostolic Networking</h3>
                <p>
                  Dr. Sam Amaga is the President of Salem Pastoral and Missions College (SPAMIC), an
                  institute committed to raising men of excellence in life and ministry.
                </p>
                <p>
                  He is the International President of the International Covenant Ministerial Council
                  (ICMC), presently focused on raising strong and effective leadership for a network of
                  churches and ministries across the globe — over 1,000 churches, ministries, and
                  ministers strong.
                </p>
                <p>
                  He is a member of the National Executive Council of the Pentecostal Fellowship of
                  Nigeria (PFN), the International Communion of Charismatic Churches (ICCC), and one of
                  the founding members of the Trans Atlantic and Pacific Alliance of Churches (TAPAC).
                </p>
                <p>
                  Archbishop Sam Amaga currently serves as National President of the Pentecostal
                  Bishops&apos; Communion of Nigeria (PEBICON), and as Chancellor and Visioneer of Salem
                  University, Lokoja. He has since established the Salem International Leadership
                  Centre, raising leaders who are change agents.
                </p>
              </div>
            </ReadMore>
          </Reveal>
        </div>
      </section>

      <section className="relative overflow-hidden bg-black py-20 sm:py-28">
        <SectionTexture />
        <div className="relative mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <Reveal className="mx-auto max-w-xl text-center">
            <span className="font-label text-xs font-semibold uppercase tracking-[0.3em] text-gold">Journey Through Time</span>
            <h2 className="mt-3 font-display text-3xl text-white sm:text-4xl">History Timeline</h2>
          </Reveal>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {TIMELINE.map(({ icon: Icon, year, title, text }, i) => (
              <Reveal key={title} delay={i * 0.08}>
                <div className="h-full rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gold/15 text-gold">
                    <Icon size={20} strokeWidth={1.8} />
                  </div>
                  <p className="mt-4 font-label text-xs font-semibold uppercase tracking-wider text-gold">{year}</p>
                  <h3 className="mt-1.5 font-display text-lg text-white">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/60">{text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
