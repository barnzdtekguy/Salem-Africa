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

const hsl = (h, s, l) => {
  s /= 100;
  l /= 100;
  const k = (n) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [f(0), f(8), f(4)].map((v) => Math.round(v * 255));
};

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
 * Brand anchors are pinned to their exact existing values so the site's
 * identity is untouched and no current component shifts colour:
 *   navy.900 #0B1B33  (ink-deep / black)      red.600 #B82E2C  (terracotta)
 *   navy.950 …deeper   red.800 #8A2221 (terracotta-dark)  red.50 #FCE8EA (soft)
 * Everything else is generated so the ramp reads as one deliberate family.
 */

const RAMPS = {
  // Cool dark family. Carries text and every dark surface.
  navy: {
    50: hsl(210, 40, 98),
    100: hsl(211, 42, 94),
    200: hsl(212, 40, 87),
    300: hsl(213, 34, 75),
    400: hsl(214, 28, 58),
    500: hsl(215, 26, 44),
    600: hsl(215, 30, 33),
    700: hsl(215, 38, 25),
    800: hsl(216, 48, 18),
    900: hex('#0B1B33'), // brand navy — pinned
    950: hsl(217, 62, 7),
  },

  // The scarce accent. Light surfaces only.
  red: {
    50: hex('#FCE8EA'), // terracotta-soft — pinned
    100: hsl(357, 78, 90),
    200: hsl(357, 74, 82),
    300: hsl(358, 70, 71),
    400: hsl(359, 65, 59),
    500: hsl(0, 60, 51),
    600: hex('#B82E2C'), // terracotta — pinned
    700: hsl(1, 62, 39),
    800: hex('#8A2221'), // terracotta-dark — pinned
    900: hsl(1, 58, 25),
    950: hsl(2, 58, 16),
  },

  // The dark-surface accent. Replaces the fake `gold` alias of red.
  gold: {
    50: hsl(42, 68, 95),
    100: hsl(42, 72, 88),
    200: hsl(41, 74, 78),
    300: hsl(40, 76, 68),
    400: hsl(39, 76, 60), // primary accent on navy
    500: hsl(37, 70, 50),
    600: hsl(34, 72, 42),
    700: hsl(31, 74, 34),
    800: hsl(29, 76, 27),
    900: hsl(27, 74, 21),
    950: hsl(25, 74, 13),
  },

  // Warm neutral surfaces. Gives the light theme its layered depth.
  sand: {
    50: hsl(40, 60, 99),
    100: hex('#FAF7F2'), // existing sand — pinned exactly
    200: hsl(36, 34, 92),
    300: hex('#ECE6DC'), // existing sand-line - pinned exactly
    400: hsl(33, 22, 80),
    500: hsl(32, 16, 66),
    600: hsl(30, 12, 52),
    700: hsl(28, 12, 40),
    800: hsl(26, 13, 28),
    900: hsl(24, 15, 18),
    950: hsl(22, 18, 11),
  },
};

/* --------------------------------------------------------- semantic aliases */

const SEMANTIC = {
  paper: hex('#FFFFFF'),
  ink: hex('#0F172A'), // pinned — `text-ink` is the site's default heading colour
  'ink-deep': RAMPS.navy[900],
  'ink-muted': hex('#475569'), // pinned — 7.4:1 on white, already compliant
  // was #94A3B8 → 2.40:1 on sand. Darkened to clear 4.5:1 on the warmest surface.
  'ink-faint': hsl(215, 18, 42),
  sand: RAMPS.sand[100],
  'sand-line': RAMPS.sand[300],

  /*
   * The light-theme depth ladder. The page base is a warm off-white rather
   * than #FFFFFF so that cards can rise to pure white and actually read as
   * elevated — "never pure #fff on #fff".
   *   surface (base)  #FDFBF7  <  surface-alt  <  surface-sunken
   *   surface-elevated  #FFFFFF  — cards, panels, popovers
   */
  surface: hex('#FDFBF7'),
  'surface-alt': RAMPS.sand[100],
  'surface-sunken': RAMPS.sand[200],
  'surface-elevated': hex('#FFFFFF'),
  shadow: hex('#221A14'), // warm dark, drives every box-shadow layer
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
  // gold as text on light surfaces — only the deep end may be used
  ['gold-800', RAMPS.gold[800], [...LIGHT, 'gold-50'], 4.5],
  ['gold-900', RAMPS.gold[900], [...LIGHT, 'gold-50'], 4.5],
  // dark-surface text
  ['paper', SEMANTIC.paper, ['navy', 'navy-950', 'navy-800', 'red-600'], 4.5],
  ['navy-100', RAMPS.navy[100], ['navy', 'navy-950'], 4.5],
  ['navy-200', RAMPS.navy[200], ['navy', 'navy-950'], 4.5],
  ['navy-300', RAMPS.navy[300], ['navy', 'navy-950'], 4.5],
  // the whole point of the gold: an accent that survives the navy
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
    ['stat number on navy', RAMPS.gold[400], RAMPS.navy[900], 3],
    ['eyebrow on navy', RAMPS.gold[400], RAMPS.navy[900], 4.5],
    ['footer copyright on sand', SEMANTIC['ink-faint'], SEMANTIC.sand, 4.5],
  ];
  console.log('\nAudit regressions:');
  for (const [what, fg, bg, min] of before) {
    const r = ratio(fg, bg);
    console.log(`  ${r >= min ? 'FIXED' : 'STILL FAILING'}  ${r.toFixed(2)}:1 (needs ${min})  ${what}`);
  }

  process.exit(fails > 0 ? 1 : 0);
}
