# Salem Africa

A responsive website for Salem International Christian Centre, retaining the original church, ministry, event, leadership and contact content.

## Run locally

Use Node.js 22.13 or later. This project runs as a standard Next.js Node.js application.

```bash
npm ci
npm run dev
```

Open the local URL shown in the terminal.

```bash
npm run typecheck
npm run build
```

`npm run start` runs the production Next.js server. The app no longer uses the Vinext/Cloudflare Worker adapter.

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

## Admin content studio

The staff dashboard is at `/admin`. It uses Better Auth with MySQL/MariaDB for staff accounts and sessions, MariaDB for content, S3-compatible object storage for media, and SMTP for account recovery and staff setup emails.

### Required Hostinger services

The reported Business plan and enabled Node.js app are the intended target. Before production use, confirm the account has:

- A Node.js app using Node 22 or later, running this Next.js server continuously.
- A MariaDB/MySQL database reachable from the app. Hostinger's Node.js database setup exposes `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, and `DATABASE_URL`.
- An S3-compatible object storage endpoint and a private bucket. The storage endpoint, region, bucket, access key, and secret must be available to the app. Media is proxied through `/media/`; it does not depend on deployment-folder persistence or a public bucket.
- Working outbound SMTP credentials and a verified sender address.

The Hostinger account API did not return plan details during this implementation. The plan name, Node.js app, object-storage availability, and Hostinger SMTP/mailbox were supplied by the site owner; the storage provider's S3 compatibility, endpoint/region/bucket provisioning, SMTP host/port/sender, and backup retention still need confirmation in hPanel. This implementation does not require a separate scheduler: scheduled items become public when the database time condition is met, without an admin session or cron process.

### Local configuration

Copy `.env.example` to `.env.local` for local development. In Hostinger, enter the same values through the Node.js app's private environment-variable settings instead of uploading an env file. Never prefix database, auth, SMTP, or S3 credentials with `NEXT_PUBLIC_`, and do not commit secrets.

1. Create the database and S3-compatible bucket in Hostinger. Confirm the database credentials are assigned to the website and the storage keys have only the permissions needed for list, get, and put operations in the media bucket.
2. Run [`db/migrations/001_hostinger_admin.sql`](./db/migrations/001_hostinger_admin.sql) once against the new database using phpMyAdmin or a trusted database client. It creates Better Auth tables and content tables and seeds the current programs/events. Do not rerun it as a reset; it preserves existing rows.
3. Configure `DATABASE_URL` (or all `DB_*` values), `BETTER_AUTH_SECRET` (at least 32 random characters), `BETTER_AUTH_URL`, `NEXT_PUBLIC_SITE_URL`, `SMTP_*`, and `S3_*` as described in `.env.example`.
4. Create the first administrator from a secure terminal after the database and environment are configured:

   ```sh
   npx auth@latest create-admin --email admin@example.org --name "Salem Administrator" --role admin --config src/lib/auth-cli.ts
   ```

   Omit `--password` so the CLI prompts for it; do not put a real password in shell history. Disable public registration in the app configuration, as it is already disabled here. Administrators can create editors or administrators from the dashboard. The new staff member receives a password-setup email.
5. Deploy from the project root using Hostinger's Node.js app settings: Node 22+, install `npm ci`, build `npm run build`, start `npm run start`. Configure the app's public domain and private environment variables before starting it.
6. Verify `/`, `/events`, `/devotionals`, `/admin/login`, password recovery delivery, an Editor's denied access to user management, content publication, a media upload, and public rendering. A scheduled item should appear publicly after its Africa/Lagos publication time even if no one has the dashboard open.

### Roles, publication, and media

Administrators manage staff and all content; Editors manage content only. Protected APIs check the authenticated database-backed role server-side. Public content queries return only published items and scheduled items whose `publish_at` has passed. Drafts and future scheduled items are never returned publicly. Optimistic version checks prevent one editor from silently overwriting another's changes. Public routes are rendered dynamically and invalidated after admin changes.

Uploads accept JPEG, PNG, and WebP, validate their signatures and enforce a 10 MB server-side limit. Original uploaded image bytes are stored without browser-side resizing or lossy re-encoding. Website images are served without Next.js image re-encoding, preserving source quality; use appropriately sized, optimized source files to keep page loads fast. Uploaded objects are never deleted from the admin UI, so replacing a cover cannot break published content. Public devotional Markdown is sanitized before rendering.

### Backup and recovery

- In Hostinger hPanel, configure automatic database backups and verify their retention/restore limits. Periodically export the complete MariaDB database from phpMyAdmin or with `mysqldump`; store encrypted copies outside the hosting account.
- Back up the entire S3 bucket independently. For an S3-compatible provider, use its backup/versioning feature or `aws s3 sync` with the configured endpoint. Keep a second copy in a separate account/location and do not store access keys in the backup.
- To recover, restore the database dump into the provisioned database, restore the media bucket contents and keys, restore the private app environment variables, then restart/redeploy the Next.js app. Test the restored site, login, and a previously uploaded image.
- Keep database and object-storage backups from matching points in time; restoring one without the other may leave content referring to missing images.

### Deployment notes

The production target is standard Next.js on Hostinger Node.js, not Vinext on Cloudflare Workers. The Worker entry point and unsupported compatibility-date configuration have been removed. No live Hostinger database, object-store endpoint, or SMTP account was available to test from this workspace, so the final credentialed migration, email delivery, media durability across a real redeploy, and account-level backup restore still require verification after provisioning.
