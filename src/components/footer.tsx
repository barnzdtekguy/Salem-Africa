import Image from 'next/image';
import Link from 'next/link';
import { Facebook, Instagram, Youtube, MapPin, Phone, Mail } from 'lucide-react';
import { EVENTS } from '@/data/events';
import { CONTACT_EMAIL } from '@/data/contact';

const QUICK_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About Us' },
  { href: '/events', label: 'Events' },
  { href: '/give', label: 'Give Online' },
  { href: '/contact', label: 'Contact Us' },
  { href: '/ministries', label: 'Ministries' },
  { href: '/churches', label: 'Our Churches' },
];

export function Footer() {
  return (
    <footer className="bg-sand text-ink">
      <div className="mx-auto max-w-container px-4 pb-12 pt-20 sm:px-6 sm:pt-24 lg:px-8">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-3">
              <Image src="/images/logo.png" alt="Salem Africa" width={56} height={56} className="h-12 w-12 object-contain" />
              <span className="text-sm font-semibold leading-tight text-ink">
                Salem Int&apos;l Christian Centre
              </span>
            </Link>
            <p className="mt-6 max-w-xs text-sm leading-6 text-ink-muted">
              Where God is Saving, Healing and Making Many Mighty — raising an army strong in faith,
              empowered by wisdom, across Africa and beyond.
            </p>
            <div className="mt-6 flex gap-3">
              {[
                { Icon: Facebook, href: 'https://www.facebook.com/SalemLagosLive', label: 'Salem Africa on Facebook' },
                { Icon: Instagram, href: 'https://www.instagram.com/SalemLagosLive', label: 'Salem Africa on Instagram' },
                { Icon: Youtube, href: 'https://www.youtube.com/@SalemLagosLive', label: 'Salem Africa on YouTube' },
              ].map(({ Icon, href, label }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-black/5 text-ink transition hover:bg-blue-soft hover:text-blue-dark"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-lg font-black">Quick Links</h4>
            <ul className="mt-7 space-y-4">
              {QUICK_LINKS.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm text-ink-muted transition hover:text-ink">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-black">Weekly Services</h4>
            <div className="mt-7 space-y-5">
              {EVENTS.map((event) => (
                <div key={event.slug}>
                  <p className="text-sm font-black text-terracotta">{event.title}</p>
                  <p className="mt-1 text-sm leading-5 text-ink-muted">{event.frequency} · {event.schedule}</p>
                  {event.location && <p className="mt-1 text-xs leading-5 text-ink-muted">{event.location}</p>}
                </div>
              ))}
              <div>
                <p className="text-sm font-black text-terracotta">Office Hours</p>
                <p className="mt-1 text-sm text-ink-muted">Mon&ndash;Fri: 9am &ndash; 5pm</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-black">Contact</h4>
            <ul className="mt-7 space-y-6">
              <li className="flex items-start gap-4">
                <MapPin size={20} className="mt-0.5 shrink-0 text-terracotta" />
                <p className="text-sm leading-6 text-ink-muted">
                  By Total Filling Station, Lekki-Epe Expressway, Lekki Peninsula II, Lagos, Nigeria
                </p>
              </li>
              <li className="flex items-start gap-4">
                <Phone size={20} className="mt-0.5 shrink-0 text-blue-dark" />
                <a href="tel:+2348181706865" className="text-sm leading-6 text-ink-muted transition hover:text-blue-dark">
                  +234 (0) 818 170 6865
                </a>
              </li>
              <li className="flex items-start gap-4">
                <Mail size={20} className="mt-0.5 shrink-0 text-blue-dark" />
                <a href={`mailto:${CONTACT_EMAIL}`} className="text-sm leading-6 text-ink-muted transition hover:text-blue-dark">
                  {CONTACT_EMAIL}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-black/10 pt-10 sm:flex-row">
          <p className="text-sm text-ink-faint">© {new Date().getFullYear()} Salem Africa. All rights reserved.</p>
          <div className="flex gap-8 text-sm text-ink-faint">
            <span>Raising God an Army, Making Many Mighty.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
