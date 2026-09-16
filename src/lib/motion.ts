/**
 * Shared motion constants.
 *
 * Components import from here rather than inlining numbers, so the whole site
 * can be retuned from one place and two sections never disagree about what
 * "a reveal" means.
 */

type Bezier = [number, number, number, number];

/**
 * `entrance` decelerates hard — things arrive and settle.
 * `state` is symmetric, for toggles and hovers that may reverse mid-flight.
 */
export const EASE: { entrance: Bezier; state: Bezier; exit: Bezier } = {
  entrance: [0.22, 1, 0.36, 1],
  state: [0.65, 0, 0.35, 1],
  exit: [0.4, 0, 1, 1],
};

/** Seconds. Micro-interactions stay snappy; reveals get room to breathe. */
export const DURATION = {
  micro: 0.25,
  state: 0.4,
  reveal: 0.7,
  section: 0.9,
  count: 1.6,
} as const;

/** Delay between staggered children. */
export const STAGGER = 0.07;

/**
 * Shared scroll-trigger margin. Negative top inset means an element animates
 * once it is properly on screen rather than the instant it clips the edge.
 */
export const VIEWPORT_MARGIN = '-80px';
