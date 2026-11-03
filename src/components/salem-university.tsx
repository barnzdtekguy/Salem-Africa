import Link from 'next/link';
import { ArrowUpRight, BookOpenCheck, GraduationCap, Sparkles } from 'lucide-react';

const UNIVERSITY_URL = 'https://salemuniversity.edu.ng/';

const VALUES = ['Godliness', 'Integrity', 'Diligence', 'Teamwork'];

export function SalemUniversity() {
  return (
    <section className="university-section" aria-labelledby="salem-university-heading">
      <div className="university-inner">
        <div className="university-copy">
          <p className="university-eyebrow">
            Salem University, Lokoja
          </p>
          <h2 id="salem-university-heading">
            Knowledge with <em>character.</em>
          </h2>
          <p className="university-description">
            Discover a values-led learning community committed to personal growth, ethical
            responsibility, and holistic development.
          </p>
          <Link
            href={UNIVERSITY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="university-link"
          >
            Explore Salem University
            <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
        </div>

        <div className="university-visual" aria-hidden="true">
          <div className="university-orbit university-orbit--outer" />
          <div className="university-orbit university-orbit--inner" />
          <div className="university-emblem">
            <GraduationCap size={43} strokeWidth={1.3} />
            <span>LEARN · GROW · SERVE</span>
          </div>
          <div className="university-values">
            {VALUES.map((value, index) => (
              <span key={value}>
                {index === 0 ? <Sparkles size={13} /> : <BookOpenCheck size={13} />}
                {value}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
