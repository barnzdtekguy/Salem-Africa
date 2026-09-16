'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'framer-motion';

import { DURATION, EASE } from '@/lib/motion';

/**
 * Counts from 0 up to `value` the first time it scrolls into view.
 *
 * Deliberately not `motion.span` + `useMotionValue`: those write to the DOM
 * outside React, and this number is server-rendered, so the SSR output and the
 * first client paint must agree. Instead the final value renders immediately
 * and the animation is layered on after mount — no hydration mismatch, and the
 * real number is in the HTML for crawlers and for anyone with JS disabled.
 *
 * Reduced motion skips straight to the value: a counter is decorative, and
 * animating digits is exactly the kind of movement that setting asks us to
 * drop.
 */
export function CountUp({
  value,
  suffix = '',
  duration = DURATION.count,
  className = '',
}: {
  value: number;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const reduced = useReducedMotion();

  // Starts at the true value so SSR and first paint match. The effect knocks it
  // back to 0 and runs up only once it is safe to do so on the client.
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (reduced) {
      setDisplay(value);
      return;
    }
    if (!inView) {
      setDisplay(0);
      return;
    }

    let frame = 0;
    let start: number | null = null;
    const [c0, c1, c2, c3] = EASE.entrance;

    // Same cubic-bezier the reveals use, sampled per frame so the digits and
    // the surrounding motion share one sense of timing.
    const bezier = (t: number) => {
      const u = 1 - t;
      // y(t) for the curve's control points; x is close enough to linear at
      // these values that sampling on t directly is imperceptible here.
      return 3 * u * u * t * c1 + 3 * u * t * t * c3 + t * t * t;
    };

    const tick = (now: number) => {
      if (start === null) start = now;
      const elapsed = (now - start) / 1000;
      const t = Math.min(elapsed / duration, 1);
      setDisplay(Math.round(bezier(t) * value));
      if (t < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
    // c0/c2 are unused in the y-only sampling above; listing them would add a
    // dependency that never changes.
  }, [inView, reduced, value, duration]);

  return (
    <span ref={ref} className={`nums-tabular ${className}`.trim()}>
      {/*
        The animated digits are hidden from assistive tech — a screen reader
        should hear "37", not every intermediate number. The real value sits in
        a visually-hidden sibling instead.
      */}
      <span aria-hidden="true">
        {display}
        {suffix}
      </span>
      <span className="sr-only">
        {value}
        {suffix}
      </span>
    </span>
  );
}
