import type { Metadata } from 'next';
import { PageShell } from '@/components/page-shell';
import { PageHero } from '@/components/page-hero';
import { Reveal } from '@/components/reveal';
import { ContactForm } from '@/components/contact-form';
import { Accordion, type AccordionItem } from '@/components/accordion';
import { MapPin, Phone, Mail, ExternalLink, HelpCircle } from 'lucide-react';

export const metadata: Metadata = { title: 'Contact Us | Salem Africa' };

const FAQS: AccordionItem[] = [
  {
    icon: <HelpCircle size={18} strokeWidth={1.8} />,
    title: 'What are your service times?',
    content: (
      <p>
        Service times vary by branch. Please visit our{' '}
        <a href="/churches" className="text-terracotta underline underline-offset-2">Churches</a> page to
        find the exact service times for a location near you. Our Headquarters holds services at 8:00
        AM and 10:00 AM on Sundays.
      </p>
    ),
  },
  {
    icon: <HelpCircle size={18} strokeWidth={1.8} />,
    title: 'How can I submit a prayer request?',
    content: (
      <p>
        You can submit a prayer request by selecting &ldquo;Prayer Request&rdquo; in the contact form
        above, or by calling our dedicated prayer lines.
      </p>
    ),
  },
  {
    icon: <HelpCircle size={18} strokeWidth={1.8} />,
    title: 'Do you have online services?',
    content: (
      <p>
        Yes, our main services and conventions are streamed live across our official YouTube and
        Facebook platforms.
      </p>
    ),
  },
];

export default function ContactPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Reach Us"
        title="Get In Touch"
        subtitle="We would love to hear from you. Send us a message or visit our headquarters."
        image="/images/hero-bg-1.jpg"
      />

      <section className="py-20 sm:py-28">
        <div className="mx-auto grid max-w-container gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <Reveal>
            <span className="font-label text-xs font-semibold uppercase tracking-[0.3em] text-terracotta">Reach Us</span>
            <h2 className="mt-3 font-display text-3xl text-ink sm:text-4xl">Contact Information</h2>
            <p className="mt-4 text-sm leading-7 text-ink-muted">
              Our administrative team is always ready to assist you with inquiries, prayers, or
              counseling needs.
            </p>

            <div className="mt-8 space-y-6">
              <div className="flex gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-terracotta-soft text-terracotta">
                  <MapPin size={19} strokeWidth={1.8} />
                </div>
                <div>
                  <h3 className="font-display text-sm text-ink">Headquarters Address</h3>
                  <p className="mt-1 text-sm leading-6 text-ink-muted">
                    By Total Filling Station, Lekki-Epe Expressway, behind Nicon Town Road, Lekki
                    Peninsula II, Lekki, Lagos
                  </p>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Salem+International+Christian+Centre+Lekki+Lagos"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1.5 inline-flex items-center gap-1.5 text-xs font-semibold text-terracotta hover:text-terracotta-dark"
                  >
                    Open in Google Maps <ExternalLink size={12} />
                  </a>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-terracotta-soft text-terracotta">
                  <Phone size={19} strokeWidth={1.8} />
                </div>
                <div>
                  <h3 className="font-display text-sm text-ink">Phone Numbers</h3>
                  <p className="mt-1 text-sm leading-6 text-ink-muted">
                    +234 (0) XXX XXX XXXX<br />+234 (0) YYY YYY YYYY
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-terracotta-soft text-terracotta">
                  <Mail size={19} strokeWidth={1.8} />
                </div>
                <div>
                  <h3 className="font-display text-sm text-ink">Email Address</h3>
                  <p className="mt-1 text-sm leading-6 text-ink-muted">info@salemafrica.placeholder.org</p>
                </div>
              </div>
            </div>

            <div className="mt-8 h-64 overflow-hidden rounded-2xl border border-ink/[0.07] shadow-soft">
              <iframe
                src="https://www.google.com/maps?q=Salem+International+Christian+Centre+Lekki+Lagos&output=embed"
                title="Salem Africa Headquarters"
                className="h-full w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="rounded-2xl border border-ink/[0.07] bg-white p-7 shadow-soft sm:p-8">
              <h2 className="font-display text-2xl text-ink">Send a Message</h2>
              <div className="mt-6">
                <ContactForm />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-sand py-20 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mb-10 text-center">
            <span className="font-label text-xs font-semibold uppercase tracking-[0.3em] text-terracotta">FAQ</span>
            <h2 className="mt-3 font-display text-3xl text-ink sm:text-4xl">Frequently Asked Questions</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <Accordion items={FAQS} />
          </Reveal>
        </div>
      </section>
    </PageShell>
  );
}
