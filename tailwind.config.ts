import type { Config } from 'tailwindcss';

/**
 * Every colour resolves through a CSS custom property that holds **channels
 * only** ("184 46 44", not "#B82E2C"). That is what lets Tailwind's opacity
 * modifiers keep working — `border-ink/[0.07]`, `bg-gold/15`, `via-black/60`
 * and 76 other call sites compile to `rgb(var(--ink) / 0.07)`. Storing a hex
 * in the variable would silently break all of them.
 *
 * The ramps themselves are generated and contrast-verified by
 * `scripts/tokens.mjs` — run `npm run tokens` to re-check every text/surface
 * pair against WCAG AA before shipping a palette change.
 */
const c = (v: string) => `rgb(var(${v}) / <alpha-value>)`;

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        /* ---------------------------------------------------------- ramps */
        navy: {
          50: c('--navy-50'),
          100: c('--navy-100'),
          200: c('--navy-200'),
          300: c('--navy-300'),
          400: c('--navy-400'),
          500: c('--navy-500'),
          600: c('--navy-600'),
          700: c('--navy-700'),
          800: c('--navy-800'),
          900: c('--navy-900'),
          950: c('--navy-950'),
          DEFAULT: c('--navy-900'),
        },
        red: {
          50: c('--red-50'),
          100: c('--red-100'),
          200: c('--red-200'),
          300: c('--red-300'),
          400: c('--red-400'),
          500: c('--red-500'),
          600: c('--red-600'),
          700: c('--red-700'),
          800: c('--red-800'),
          900: c('--red-900'),
          950: c('--red-950'),
          DEFAULT: c('--red-600'),
        },
        gold: {
          50: c('--gold-50'),
          100: c('--gold-100'),
          200: c('--gold-200'),
          300: c('--gold-300'),
          400: c('--gold-400'),
          500: c('--gold-500'),
          600: c('--gold-600'),
          700: c('--gold-700'),
          800: c('--gold-800'),
          900: c('--gold-900'),
          950: c('--gold-950'),
          // `text-gold` used to be the brand red wearing a gold name, which is
          // why every eyebrow on the navy measured 2.84:1. It is now a real
          // gold: 8.79:1 on navy-900.
          DEFAULT: c('--gold-400'),
          dark: c('--gold-800'), // the only gold safe as text on light surfaces
          soft: c('--gold-50'),
        },
        sand: {
          50: c('--sand-50'),
          100: c('--sand-100'),
          200: c('--sand-200'),
          300: c('--sand-300'),
          400: c('--sand-400'),
          500: c('--sand-500'),
          600: c('--sand-600'),
          700: c('--sand-700'),
          800: c('--sand-800'),
          900: c('--sand-900'),
          950: c('--sand-950'),
          DEFAULT: c('--sand-100'),
          line: c('--sand-300'),
        },

        /* ------------------------------------------ existing token names */
        // Kept so no component has to change. They now point into the ramps.
        terracotta: {
          DEFAULT: c('--red-600'),
          dark: c('--red-800'),
          soft: c('--red-50'),
        },
        ink: {
          DEFAULT: c('--ink'),
          deep: c('--ink-deep'),
          muted: c('--ink-muted'),
          faint: c('--ink-faint'),
        },
        paper: c('--paper'),
        black: c('--navy-900'), // deliberate override: `bg-black` is the brand navy

        /* ------------------------------------------------------ semantic */
        surface: {
          DEFAULT: c('--surface'),
          alt: c('--surface-alt'),
          sunken: c('--surface-sunken'),
          elevated: c('--surface-elevated'),
          deep: c('--navy-900'),
          deepest: c('--navy-950'),
        },
        accent: {
          DEFAULT: c('--red-600'),
          hover: c('--red-700'),
          soft: c('--red-50'),
          'on-dark': c('--gold-400'),
        },
      },

      // Semantic aliases scoped to one utility each, so they read as
      // `text-primary` / `border-subtle` rather than `text-text-primary`.
      textColor: {
        primary: c('--ink'),
        muted: c('--ink-muted'),
        faint: c('--ink-faint'),
        inverse: c('--paper'),
        'on-accent': c('--paper'),
        'on-dark': c('--navy-200'),
        'on-dark-muted': c('--navy-300'),
      },
      borderColor: {
        subtle: 'rgb(var(--ink) / 0.07)',
        hairline: 'rgb(var(--ink) / 0.1)',
        strong: 'rgb(var(--ink) / 0.16)',
        'on-dark': 'rgb(var(--paper) / 0.1)',
        'on-dark-strong': 'rgb(var(--paper) / 0.2)',
      },

      fontFamily: {
        // Both faces are self-hosted through next/font/local, which injects
        // these variables and the fallback metric overrides. Faces themselves
        // are the originals: Bebas Neue display, Jost UI.
        display: ['var(--font-display)', 'Arial Narrow', 'Impact', 'sans-serif'],
        sans: ['var(--font-sans)', 'system-ui', '-apple-system', '"Segoe UI"', 'sans-serif'],
        // Eyebrows/labels were using `font-mono`, which resolved to Jost — a
        // geometric sans, not a monospace. Renamed to what it actually is; the
        // rendered face is identical to before.
        label: ['var(--font-sans)', 'system-ui', '-apple-system', '"Segoe UI"', 'sans-serif'],
      },

      // Additive: Tailwind's own scale is untouched so no existing heading
      // resizes. Sections opt into the fluid display scale as they are built.
      // Tracking is positive throughout — Bebas Neue is set in all caps, and
      // caps need opening up, not tightening.
      fontSize: {
        'display-2xl': ['clamp(3.25rem, 1.35rem + 7.6vw, 7rem)', { lineHeight: '0.92', letterSpacing: '0.02em' }],
        'display-xl': ['clamp(2.75rem, 1.45rem + 5.2vw, 5.25rem)', { lineHeight: '0.96', letterSpacing: '0.022em' }],
        'display-lg': ['clamp(2.25rem, 1.35rem + 3.6vw, 4rem)', { lineHeight: '1', letterSpacing: '0.024em' }],
        'display-md': ['clamp(1.875rem, 1.3rem + 2.3vw, 3rem)', { lineHeight: '1.04', letterSpacing: '0.026em' }],
        'display-sm': ['clamp(1.5rem, 1.15rem + 1.4vw, 2.25rem)', { lineHeight: '1.12', letterSpacing: '0.028em' }],
        'display-xs': ['clamp(1.25rem, 1.08rem + 0.7vw, 1.625rem)', { lineHeight: '1.24', letterSpacing: '0.03em' }],
        // Body copy at the measure and leading the brief calls for.
        'body-lg': ['1.0625rem', { lineHeight: '1.7' }],
        'body-md': ['1rem', { lineHeight: '1.65' }],
        'body-sm': ['0.9375rem', { lineHeight: '1.65' }],
        eyebrow: ['0.75rem', { lineHeight: '1.2', letterSpacing: '0.22em' }],
      },

      letterSpacing: {
        display: '0.025em',
        'display-open': '0.04em',
        eyebrow: '0.22em',
      },

      maxWidth: {
        container: '1240px',
        measure: '68ch', // 65–75 character body measure
        'measure-tight': '58ch',
      },

      backgroundImage: {
        // Same grain as `.grain-layer`; use whichever composes better.
        grain: 'var(--noise-svg)',
      },

      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },

      // Multi-layer, low-opacity. A single hard box-shadow is the fastest way
      // to look cheap; real depth needs a contact shadow plus diffuse falloff.
      boxShadow: {
        hairline: '0 0 0 1px rgb(var(--shadow) / 0.06)',
        soft: [
          '0 1px 2px rgb(var(--shadow) / 0.04)',
          '0 4px 8px -2px rgb(var(--shadow) / 0.05)',
          '0 12px 28px -8px rgb(var(--shadow) / 0.08)',
        ].join(', '),
        hover: [
          '0 2px 4px rgb(var(--shadow) / 0.05)',
          '0 8px 16px -4px rgb(var(--shadow) / 0.07)',
          '0 24px 48px -12px rgb(var(--shadow) / 0.13)',
        ].join(', '),
        lift: [
          '0 3px 6px rgb(var(--shadow) / 0.06)',
          '0 12px 24px -6px rgb(var(--shadow) / 0.09)',
          '0 32px 64px -16px rgb(var(--shadow) / 0.17)',
        ].join(', '),
        panel: [
          '0 4px 8px rgb(var(--shadow) / 0.06)',
          '0 16px 32px -8px rgb(var(--shadow) / 0.1)',
          '0 40px 80px -24px rgb(var(--shadow) / 0.24)',
        ].join(', '),
        pop: '0 2px 0 rgb(var(--shadow) / 0.12)', // deliberate hard offset
        'glow-accent': '0 0 0 1px rgb(var(--red-600) / 0.3), 0 8px 32px -8px rgb(var(--red-600) / 0.28)',
        'glow-gold': '0 0 0 1px rgb(var(--gold-400) / 0.35), 0 8px 32px -8px rgb(var(--gold-400) / 0.25)',
      },

      transitionTimingFunction: {
        // The two curves the whole site uses. `linear` and the browser default
        // `ease` are never correct here.
        entrance: 'cubic-bezier(0.22, 1, 0.36, 1)',
        state: 'cubic-bezier(0.65, 0, 0.35, 1)',
        exit: 'cubic-bezier(0.4, 0, 1, 1)',
      },

      // Tailwind's duration scale jumps 300 → 500, so `duration-400` in
      // accordion.tsx emitted nothing and that transition never ran.
      transitionDuration: {
        250: '250ms',
        400: '400ms',
        600: '600ms',
        700: '700ms',
        800: '800ms',
        900: '900ms',
      },

      keyframes: {
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
        'marquee-reverse': {
          from: { transform: 'translateX(-50%)' },
          to: { transform: 'translateX(0)' },
        },
        shimmer: {
          from: { transform: 'translateX(-100%)' },
          to: { transform: 'translateX(100%)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.35' },
          '50%': { opacity: '0.6' },
        },
      },
      animation: {
        // Single source for the marquee timings — globals.css used to redeclare
        // `.animate-marquee` at 42s and quietly win over this one.
        marquee: 'marquee 46s linear infinite',
        'marquee-slow': 'marquee 68s linear infinite',
        'marquee-fast': 'marquee 34s linear infinite',
        'marquee-reverse': 'marquee-reverse 150s linear infinite',
        shimmer: 'shimmer 1.8s cubic-bezier(0.4, 0, 0.2, 1) infinite',
        'pulse-glow': 'pulse-glow 7s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};

export default config;
