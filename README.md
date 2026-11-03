# Salem Africa

A responsive website for Salem International Christian Centre, retaining the original church, ministry, event, leadership and contact content.

## Run locally

Use Node.js 22.13 or later.

```bash
npm ci
npm run dev
```

Open the local URL shown in the terminal. The project retains the Next.js App Router and React components and uses Vinext/Vite for Cloudflare Workers hosting.

```bash
npm run typecheck
npm run build
```

`npm run start` runs the built Worker locally with Wrangler. The original Next.js configuration remains available for a conventional Next.js deployment; run `npx next dev` or `npx next build` for that target.

## What's included

- Fourteen supplied hero photographs, with automatic rotation, manual navigation and a persistent pause control.
- A responsive Salem Lagos photo carousel; every card links to the full Lagos album.
- A photo library at `/media/pictures`, with 46 Lagos photos, 25 unique SAOC files and 14 hero images. Album links are shareable through `?album=lagos`, `?album=saoc` and `?album=hero`.
- Full-screen photographs with previous/next controls, arrow-key navigation, Escape to close and downloads.
- The supplied city texture at 4.5% opacity behind light sections.
- Optimized WebP photos and separate thumbnails. WordPress size variants and exact duplicate exports are mapped in `src/data/asset-manifest.json`; the gallery uses the largest supplied version of each unique image.
- Original routes, church directory and maps, ministry directory, event details, live-stream links, sermon-feed integration, contact and giving pages.
- Keyboard navigation, a mobile menu focus loop, reduced-motion support and local fonts.

## Main files

- `src/app/page.tsx`: landing-page structure.
- `src/components/hero-slider.tsx`: hero slideshow.
- `src/components/salem-moments-carousel.tsx`: homepage photo carousel.
- `src/components/photo-gallery.tsx`: album filtering and photograph viewer.
- `src/data/gallery.json`: photo metadata.
- `src/data/asset-manifest.json`: source-to-web-image mapping.
- `src/app/globals.css`: shared styling and responsive layouts.
- `src/data/`: original church, ministry, event and contact records.

## Updating photographs

Put a full-size optimized photograph and a small thumbnail in the relevant `public/images/` album folder. Add its metadata to `src/data/gallery.json` following an existing record. Keep the `album` value as `lagos`, `saoc` or `hero`.

## Verification and external services

TypeScript and the production build pass. Browser checks covered hero navigation, the Lagos carousel-to-library route, album filters, loading all Lagos photographs, full-screen next/previous navigation and the mobile homepage/menu.

YouTube feeds, livestreams, Google Maps, social links, WhatsApp and email depend on their external services. The existing contact form uses the visitor's mail application; it is not a new hosted submission service. Giving/payment and audio availability retain the original project's behavior and content.
