import type { Metadata } from 'next';
import Image from 'next/image';
import { PageShell } from '@/components/page-shell';
import { PageHero } from '@/components/page-hero';
import { Reveal } from '@/components/reveal';
import { ReadMore } from '@/components/read-more';

export const metadata: Metadata = { title: 'Leadership | Salem Africa' };

const LEADERS = [
  {
    id: 'sam-amaga',
    img: '/images/samamaga.jpg',
    role: 'Founder & Presiding Archbishop',
    name: 'Archbishop Dr Sam Amaga',
    preview:
      'Dr. Sam Amaga is the founder of Salem International Christian Centre (SICC), Abuja, Nigeria, and presiding Archbishop of Foundation Faith Church Worldwide. For almost 30 years in ministry, he has brought the raw, undiluted Word to his generation.',
    body: [
      'Dr. Sam Amaga received the call into full-time ministry while heading the management of a leading pharmaceutical company in Nigeria, in July 1982. He is a graduate of Microbiology and holds a C.Th. (Counsellor of Theology) from the Freelandia Institute, Evangelical College & Seminary, 1988.',
      'He was honoured in 1992 with a Doctor of Theology from Evangel Christian University of America, and in 1994 he and his wife were honoured with Doctor of Divinity from the All Nations for Christ Bible Institute, Benin City, Nigeria.',
      'He is President of Salem Pastoral and Missions College (SPAMIC), International President of the International Covenant Ministerial Council (ICMC) — a network of over 1,000 churches, ministries, and ministers — and a founding member of the Trans Atlantic and Pacific Alliance of Churches (TAPAC).',
      "Archbishop Sam Amaga is National President of the Pentecostal Bishops' Communion of Nigeria (PEBICON), Chancellor and Visioneer of Salem University, Lokoja, and founder of the Salem International Leadership Centre, raising leaders who are change agents.",
    ],
  },
  {
    id: 'love-amaga',
    img: '/images/bishoplove.jpg',
    role: 'Co-Founder',
    name: 'Bishop Dr Love Sam Amaga',
    preview:
      'A pillar of strength, profound teacher, and passionate intercessor. Bishop Dr Love Sam Amaga champions the cause of women and the vulnerable through extensive philanthropic and ministerial efforts.',
    body: [
      'President of Salem Women International.',
      'Renowned for impactful teaching on marriage and family dynamics.',
      'A trusted voice in the Salem Family, strengthening homes, ministers, and communities through the Word.',
    ],
  },
  {
    id: 'enobong-etteh',
    img: '/images/bishopenobong.jpg',
    role: 'Continental Bishop Africa',
    name: 'Bishop Enobong Etteh',
    preview:
      'Spearheading the Salem mission across the African continent, Bishop Enobong Etteh provides spiritual and administrative leadership for the expansion of the Salem mandate across nations.',
    body: [
      "Known for dynamic administrative grace, powerful prophetic utterances, and unyielding dedication to the vision of expanding the church's footprint across Africa and beyond.",
      'Leads the continental mission expression of Salem Africa.',
      'Provides structure, pastoral direction, and apostolic oversight for ministry growth.',
    ],
  },
  {
    id: 'catherine-etteh',
    img: '/images/catherine.jpg',
    role: 'Senior Minister',
    name: 'Rev. Catherine Etteh',
    preview:
      'An exceptional administrator, compassionate leader, and anointed minister of the gospel. Rev. Catherine partners in driving the continental mandate forward.',
    body: [
      'Provides profound pastoral care and structural leadership to various ministry arms, helping strengthen people, systems, and the mission of Salem Africa.',
      'Supports pastoral care and leadership development across ministry expressions.',
      'Serves with a heart for order, compassion, and spiritual growth.',
    ],
  },
];

export default function LeadershipPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Our Covering"
        title="Our Leadership"
        subtitle="Guided by grace, wisdom, and apostolic authority."
        image="/images/hero-bg-3.jpg"
      />

      <section className="border-b border-ink/[0.06] py-8">
        <div className="mx-auto flex max-w-container flex-wrap items-center justify-center gap-3 px-4 sm:px-6 lg:px-8">
          {LEADERS.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              className="rounded-full border border-ink/10 px-4 py-2 text-xs font-semibold text-ink transition hover:border-terracotta hover:text-terracotta"
            >
              {l.name}
            </a>
          ))}
        </div>
      </section>

      {LEADERS.map((leader, i) => (
        <section key={leader.id} id={leader.id} className={`py-20 sm:py-24 ${i % 2 === 1 ? 'bg-sand' : ''}`}>
          <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
            <div className={`grid items-center gap-12 lg:grid-cols-2 ${i % 2 === 1 ? 'lg:[&>*:first-child]:order-2' : ''}`}>
              <Reveal>
                <Image
                  src={leader.img}
                  alt={leader.name}
                  width={480}
                  height={580}
                  className="mx-auto h-[500px] w-full max-w-sm rounded-2xl object-cover shadow-panel"
                />
              </Reveal>

              <Reveal delay={0.1}>
                <span className="font-label text-xs font-semibold uppercase tracking-[0.3em] text-terracotta">{leader.role}</span>
                <h2 className="mt-3 font-display text-3xl text-ink sm:text-4xl">{leader.name}</h2>

                <ReadMore preview={<p className="mt-5 text-sm leading-7 text-ink-muted">{leader.preview}</p>}>
                  <div className="space-y-3 text-sm leading-7 text-ink-muted">
                    {leader.body.map((p, idx) => (
                      <p key={idx}>{p}</p>
                    ))}
                  </div>
                </ReadMore>
              </Reveal>
            </div>
          </div>
        </section>
      ))}
    </PageShell>
  );
}
