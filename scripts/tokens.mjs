/**
 * Token generator + WCAG contrast verifier.
 *
 * Single source of truth for the colour ramps. Run with `node scripts/tokens.mjs`
 * to (a) print the ramps as channel-only CSS custom properties, and (b) assert
 * every text/surface pair the site actually uses clears WCAG AA.
 *
 * Channel-only is not a style choice: Tailwind's `<alpha-value>` opacity
 * modifiers (`bg-ink/10`, `border-gold/30` — 68 call sites) only work when the
 * variable holds "R G B" and the utility wraps it in `rgb(... / <alpha-value>)`.
 */

/* ------------------------------------------------------------------ helpers */

const hex = (h) => {
  const n = parseInt(h.replace('#', ''), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

const toHex = ([r, g, b]) =>
  '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('').toUpperCase();

const lum = ([r, g, b]) => {
  const f = (v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};

const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
};

/* -------------------------------------------------------------------- ramps */
/*
 * The palette follows Salem's refreshed editorial direction: charcoal ink,
 * a bright but accessible red, warm paper neutrals, and muted rose neutrals.
 * The dark red remains legible on light surfaces while the brighter steps
 * carry the visual energy of the reference design.
 */

const RAMPS = {
  // Cool dark family. Carries text and every dark surface.
  navy: {
    50: hex('#F5F5F4'),
    100: hex('#E7E5E4'),
    200: hex('#D6D3D1'),
    300: hex('#B7B3B0'),
    400: hex('#8B8784'),
    500: hex('#686562'),
    600: hex('#4B4847'),
    700: hex('#353334'),
    800: hex('#242323'),
    900: hex('#171719'), // brand charcoal
    950: hex('#0C0C0D'),
  },

  // Primary red accent for links, highlights, and high-contrast actions.
  red: {
    50: hex('#FBECEE'),
    100: hex('#F7D7DA'),
    200: hex('#F2B6BC'),
    300: hex('#EB8992'),
    400: hex('#E45764'),
    500: hex('#E03441'),
    600: hex('#D41C29'), // vivid, accessible Salem red
    700: hex('#B41722'),
    800: hex('#8E121B'),
    900: hex('#671018'),
    950: hex('#440A10'),
  },

  // Muted Salem blue for utility actions, focus states, and quiet details.
  blue: {
    50: hex('#EFF5FC'),
    100: hex('#DFEBF8'),
    200: hex('#C2D8EF'),
    300: hex('#94B9DF'),
    400: hex('#5F91C5'),
    500: hex('#356FA7'),
    600: hex('#245B96'), // logo-inspired, high-contrast blue
    700: hex('#1E4A7B'),
    800: hex('#1A3B61'),
    900: hex('#142E49'),
    950: hex('#0C1E31'),
  },

  // Salem's gold identity remains as the secondary accent on dark surfaces.
  gold: {
    50: hex('#FBF6EA'),
    100: hex('#F6E9CA'),
    200: hex('#F0D69D'),
    300: hex('#EBC26F'),
    400: hex('#E7B04B'),
    500: hex('#D99426'),
    600: hex('#B8751E'),
    700: hex('#975917'),
    800: hex('#794311'),
    900: hex('#5D320E'),
    950: hex('#3A1D09'),
  },

  // Warm neutral surfaces. Gives the light theme its layered depth.
  sand: {
    50: hex('#FCFBFA'),
    100: hex('#F8F7F5'),
    200: hex('#F0EEEB'),
    300: hex('#E0DFDC'),
    400: hex('#CDCAC6'),
    500: hex('#AEAAA5'),
    600: hex('#85817D'),
    700: hex('#6B6763'),
    800: hex('#514E4B'),
    900: hex('#393735'),
    950: hex('#262524'),
  },
};

/* --------------------------------------------------------- semantic aliases */

const SEMANTIC = {
  paper: hex('#FFFFFF'),
  ink: hex('#171719'), // primary charcoal text
  'ink-deep': RAMPS.navy[900],
  'ink-muted': hex('#64615E'),
  'ink-faint': hex('#6B6865'),
  sand: RAMPS.sand[200],
  'sand-line': RAMPS.sand[300],

  /*
   * The light-theme depth ladder. The page base is warm paper so that cards
   * can rise to pure white and read as elevated — "never pure #fff on #fff".
   *   surface (base)  #F8F7F5  <  surface-alt  <  surface-sunken
   *   surface-elevated  #FFFFFF  — cards, panels, popovers
   */
  surface: hex('#F8F7F5'),
  'surface-alt': RAMPS.sand[200],
  'surface-sunken': RAMPS.sand[300],
  'surface-elevated': hex('#FFFFFF'),
  shadow: hex('#171719'), // charcoal, drives every box-shadow layer
};

/* ------------------------------------------------------- contrast assertions */
/*
 * Only pairs the site actually renders. `large` = ≥24px, or ≥18.66px bold,
 * which WCAG lets clear 3:1 instead of 4.5:1.
 */

const SURFACES = {
  paper: SEMANTIC.paper,
  surface: SEMANTIC.surface,
  'surface-alt': SEMANTIC['surface-alt'],
  'surface-sunken': SEMANTIC['surface-sunken'],
  sand: SEMANTIC.sand,
  navy: RAMPS.navy[900],
  'navy-950': RAMPS.navy[950],
  'navy-800': RAMPS.navy[800],
  'red-600': RAMPS.red[600],
  'red-50': RAMPS.red[50],
  'blue-600': RAMPS.blue[600],
  'blue-700': RAMPS.blue[700],
  'blue-50': RAMPS.blue[50],
  'gold-50': RAMPS.gold[50],
};

const LIGHT = ['paper', 'surface', 'surface-alt', 'surface-sunken', 'sand'];

const CHECKS = [
  // body text on every light surface in the ladder
  ['ink', SEMANTIC.ink, LIGHT, 4.5],
  ['ink-muted', SEMANTIC['ink-muted'], [...LIGHT, 'red-50', 'gold-50'], 4.5],
  ['ink-faint', SEMANTIC['ink-faint'], LIGHT, 4.5],
  // the accent as text on light surfaces (links, eyebrows, prices)
  ['red-600', RAMPS.red[600], [...LIGHT, 'red-50'], 4.5],
  ['red-700', RAMPS.red[700], [...LIGHT, 'red-50'], 4.5],
  ['red-800', RAMPS.red[800], [...LIGHT, 'red-50', 'gold-50'], 4.5],
  // Blue is reserved for utility actions and focus states, with white labels.
  ['blue-600', RAMPS.blue[600], [...LIGHT, 'blue-50'], 4.5],
  ['blue-700', RAMPS.blue[700], [...LIGHT, 'blue-50'], 4.5],
  // gold as text on light surfaces — only the deep end may be used
  ['gold-800', RAMPS.gold[800], [...LIGHT, 'gold-50'], 4.5],
  ['gold-900', RAMPS.gold[900], [...LIGHT, 'gold-50'], 4.5],
  // dark-surface text
  ['paper', SEMANTIC.paper, ['navy', 'navy-950', 'navy-800', 'red-600'], 4.5],
  ['paper', SEMANTIC.paper, ['blue-600', 'blue-700'], 4.5],
  ['navy-100', RAMPS.navy[100], ['navy', 'navy-950'], 4.5],
  ['navy-200', RAMPS.navy[200], ['navy', 'navy-950'], 4.5],
  ['navy-300', RAMPS.navy[300], ['navy', 'navy-950'], 4.5],
  // Salem gold remains legible as the secondary accent on charcoal surfaces.
  ['gold-400', RAMPS.gold[400], ['navy', 'navy-950', 'navy-800'], 4.5],
  ['gold-300', RAMPS.gold[300], ['navy', 'navy-950'], 4.5],
  ['gold-200', RAMPS.gold[200], ['navy', 'navy-950'], 4.5],
];

/* ------------------------------------------------------------------- output */

const mode = process.argv[2] ?? 'verify';

if (mode === 'css') {
  const lines = [];
  for (const [name, ramp] of Object.entries(RAMPS)) {
    lines.push(`    /* ${name} */`);
    for (const [step, rgb] of Object.entries(ramp)) {
      lines.push(`    --${name}-${step}: ${rgb.join(' ')}; /* ${toHex(rgb)} */`);
    }
  }
  lines.push('    /* semantic */');
  for (const [name, rgb] of Object.entries(SEMANTIC)) {
    lines.push(`    --${name}: ${rgb.join(' ')}; /* ${toHex(rgb)} */`);
  }
  console.log(lines.join('\n'));
} else {
  let fails = 0;
  let checked = 0;
  const rows = [];

  for (const [label, fg, surfaces, min] of CHECKS) {
    for (const s of surfaces) {
      const r = ratio(fg, SURFACES[s]);
      checked++;
      const ok = r >= min;
      const large = r >= 3;
      if (!ok) fails++;
      rows.push(
        `${ok ? 'PASS' : large ? 'LARGE-ONLY' : 'FAIL'}  ${r.toFixed(2).padStart(6)}:1  ` +
          `${label} (${toHex(fg)}) on ${s} (${toHex(SURFACES[s])})`
      );
    }
  }

  console.log(rows.filter((r) => !r.startsWith('PASS')).join('\n') || '(no failures)');
  console.log(`\n${checked - fails}/${checked} pairs clear 4.5:1.`);

  // Regression guards: the three failures found in the audit must be gone.
  const before = [
    ['stat number on charcoal', RAMPS.red[300], RAMPS.navy[900], 3],
    ['accent on charcoal', RAMPS.gold[400], RAMPS.navy[900], 4.5],
    ['footer copyright on paper', SEMANTIC['ink-faint'], SEMANTIC.sand, 4.5],
  ];
  console.log('\nAudit regressions:');
  for (const [what, fg, bg, min] of before) {
    const r = ratio(fg, bg);
    console.log(`  ${r >= min ? 'FIXED' : 'STILL FAILING'}  ${r.toFixed(2)}:1 (needs ${min})  ${what}`);
  }

  process.exit(fails > 0 ? 1 : 0);
}
