# Salem International Christian Centre — Website

A full redesign and rebuild of the Salem Africa site (Next.js 14, App
Router, TypeScript, Tailwind). Verified clean: `npx tsc --noEmit`,
`npm run build`, and `npx next lint` all pass with zero errors or
warnings, all 9 pages statically generated.

## Design system

Inspired by mixlr.com's confidence — bold display type, generous white
space, a clean sticky nav, big data-driven stat callouts — recolored
around a palette that's actually African rather than the generic
"church website" crimson/navy/gold, or the cream-and-terracotta combo
every AI tool defaults to:

| Token | Hex | Used for |
|---|---|---|
| `terracotta` | `#C1440E` | Primary accent, CTAs (laterite/burnt clay) |
| `gold` | `#C6912E` | Secondary accent, stat numbers (savanna) |
| `forest` | `#4C6B45` | Tertiary accent, used sparingly (acacia) |
| `indigo` | `#2B3A55` | Cool contrast note (adire dye) |
| `ink` / `ink-deep` | `#221A14` / `#140D09` | Text & dark sections (warm, not cold navy) |
| `paper` / `sand` | `#FBFAF6` / `#F1E9DA` | Backgrounds |

**Type**: Fraunces (display serif) + Manrope (body) + JetBrains Mono
(stat numbers, eyebrows, dates) — self-hosted via `@fontsource` so
fonts load reliably without depending on Google's CDN.

**Signature motif**: the "kente seam" — a small woven triangle pattern
(pure CSS, see `.kente-seam` in `globals.css`) used at every section
boundary instead of a generic curve, and echoed in card corners and
image placeholders. Component: `src/components/kente-divider.tsx`.

## What's new, feature by feature

### Landing page — every section, one tap away
`src/components/explore-grid.tsx` is a bento grid linking to all 8
inner pages (About, Vision, Leadership, Churches, Ministries, Events,
Give, Contact) directly from the homepage, alongside a Mixlr-style
stat strip (`stat-strip.tsx`) pulling real counts from your data files
— so "37 churches / 5 nations / 35 ministries" updates itself if you
add or remove entries, never needs manual editing.

### Ministries page — auto-scrolling, image-backed
`src/components/ministries-marquee.tsx` splits all 35 ministries into
three rows that scroll continuously right-to-left at slightly
different speeds (pure CSS animation, pauses on hover/tap, respects
`prefers-reduced-motion`). Tap any card to open a modal with a full
photo, description, and sub-ministries. Typing in the search box swaps
the marquee for a static filtered grid.

### Events page — real calendar + Add to Calendar
`src/components/event-calendar.tsx` is an interactive month calendar —
days with events are highlighted, tap a day to filter the list below,
navigate months with the arrows. Every event card and detail modal has
an **Add to Calendar** button (`add-to-calendar.tsx`) offering Google
Calendar, Outlook, and a downloadable `.ics` file that works with
Apple Calendar and everything else — all generated client-side in
`src/lib/calendar.ts`, no backend required.

### Photo pipeline — placeholders that fill themselves in
`src/components/image-with-fallback.tsx` tries to load the real photo
first; if it's not there yet, it renders a designed placeholder (brand
gradient + icon + label) instead of a broken image. **Drop a real
photo into `public/assets/` with the exact filename and it appears
automatically — no code changes.** Full filename-to-entry mapping is
in `public/assets/README.md` (35 ministries, 37 churches, 9 events).

## Pages

- `/` — Home: hero, stat strip, welcome message, explore grid, vision highlights, leadership preview
- `/about` — Founder bio (expandable) + history timeline
- `/vision` — 7-item accordion (mandate, message, priorities, platforms, goals, values, passion)
- `/leadership` — 4 full leader profiles with jump-nav
- `/churches` — searchable directory of all 37 church locations, with live map + photo thumbnails
- `/ministries` — all 35 ministries, auto-scrolling marquee + detail modal
- `/events` — calendar + image-backed event cards + Add to Calendar
- `/give` — giving categories
- `/contact` — contact info, map, working contact form, FAQ

## Honest gaps (carried over, not hidden)

- **Give page**: no real bank/payment details exist yet, so the page
  says that plainly rather than showing fake account numbers. Update
  `src/app/give/page.tsx` once finance has the details.
- **Contact page phone/email**: still placeholder text
  (`+234 (0) XXX XXX XXXX`, `info@salemafrica.placeholder.org`) —
  swap in the real details in `src/app/contact/page.tsx`.
- **Contact form**: opens the visitor's email client with the message
  pre-filled (`mailto:`) — zero backend needed. Swapping this for a
  real inbox/database submission is a small, separate upgrade.
- **Ministry/church/event photos**: none exist yet on either the old
  site or this one — see the Photo pipeline section above for how to
  add them without touching any code.

## Setup

```bash
npm install
npm run dev
```

## Project structure

```
src/
  app/
    page.tsx, about/, vision/, leadership/, churches/,
    ministries/, events/, give/, contact/
  components/
    header.tsx, footer.tsx, page-shell.tsx, page-hero.tsx
    hero-slider.tsx, welcome-gate.tsx, welcome-message.tsx, wind-transition.tsx
    stat-strip.tsx, explore-grid.tsx, vision-highlights.tsx, leadership-marquee.tsx
    ministries-marquee.tsx, church-locator.tsx
    event-calendar.tsx, events-directory.tsx, add-to-calendar.tsx
    image-with-fallback.tsx, kente-divider.tsx, section-texture.tsx
    accordion.tsx, read-more.tsx, contact-form.tsx, reveal.tsx
  data/
    churches.ts / .json     — all 37 churches
    ministries.ts / .json   — all 35 ministries
    events.ts / .json       — upcoming events
  lib/
    calendar.ts              — .ics / Google / Outlook calendar links
public/
  images/                   — original site photography (leaders, hero backgrounds, logo)
  assets/
    README.md                — exact filename → entry mapping
    images/                   — drop ministry & church photos here
    events/                   — drop event photos here
```
