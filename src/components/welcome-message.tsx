'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronDown } from 'lucide-react';
import { Reveal } from '@/components/reveal';

export function WelcomeMessage() {
  const [expanded, setExpanded] = useState(false);

  return (
    <section className="bg-sand py-20 sm:py-28">
      <div className="mx-auto grid max-w-container items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <Reveal>
          <div className="relative mx-auto max-w-sm">
            <div className="absolute -inset-3 -z-10 rounded-2xl border border-gold/40" />
            <Image
              src="/images/bishop.png"
              alt="Bishop Enobong Etteh"
              width={480}
              height={600}
              className="h-[540px] w-full rounded-2xl object-cover object-top shadow-panel"
            />
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <span className="font-label text-xs font-semibold uppercase tracking-[0.3em] text-terracotta">A Word for You</span>
          <h2 className="mt-3 font-display text-3xl text-ink sm:text-4xl">
            A Welcome from Our Continental Bishop Africa
          </h2>
          <p className="mt-5 leading-7 text-ink-muted">
            Calvary greetings to you in the wonderful name of our Lord Jesus Christ! We give all glory
            to God our Heavenly Father for His unconditional love and the precious gift of life. On
            behalf of the entire Salem Africa family, I am truly honored to welcome you to our digital
            home.
          </p>

          <div
            className={`grid transition-all duration-500 ease-out ${
              expanded ? 'mt-5 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
            }`}
          >
            <div className="overflow-hidden">
              <h3 className="font-display text-lg text-ink">Our Spiritual Identity</h3>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-ink-muted">
                <li>
                  <strong className="text-ink">A Heritage Built on Christ:</strong> Salem represents
                  peace and righteousness. We take deep pride in this Jesus-centered foundation.
                </li>
                <li>
                  <strong className="text-ink">A Shared Purpose:</strong> This platform is a
                  gathering space to connect, share testimonies, and find divine inspiration.
                </li>
                <li>
                  <strong className="text-ink">Our Core Mission:</strong> We are wholly committed to
                  raising a generation that champions a lifestyle of true peace and holiness.
                </li>
              </ul>
              <p className="mt-4 text-sm leading-7 text-ink-muted">
                God has not overlooked Africa. Amidst our trials, He is raising up a Harvest Army —
                noble envoys who shall hasten towards Him with hands outstretched in love, surrender,
                and power. As the Passion Translation so vividly declares in Psalm 68:31: &ldquo;Africa
                will send her noble envoys to you, O God. They will come running, stretching out their
                hands in love to you.&rdquo;
              </p>
              <p className="mt-4 text-sm leading-7 text-ink-muted">
                This is the heart of our Africa Mission mandate: no longer to await revival from
                distant shores, but to rise as senders of revival to the nations. Thank you for
                visiting us today. May the Lord bless you abundantly as you explore our community.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setExpanded((e) => !e)}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-terracotta px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-terracotta-dark"
          >
            {expanded ? 'Read Less' : 'Read More'}
            <ChevronDown size={16} className={`transition-transform ${expanded ? 'rotate-180' : ''}`} />
          </button>
        </Reveal>
      </div>
    </section>
  );
}
