import { useEffect, useRef, useState } from 'react';
import useInView from '../hooks/useInView.js';
import { prefersReducedMotion } from '../lib/motion.js';

const easeOutExpo = (t) => (t >= 1 ? 1 : 1 - 2 ** (-10 * t));

/**
 * Animates a number from 0 to `to` when scrolled into view.
 * `format` controls presentation (decimals, suffixes). Screen readers
 * only see the final formatted value.
 */
export default function CountUp({
  to,
  format = (v) => String(v),
  duration = 1600,
  className = '',
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { threshold: 0.5 });
  // On the server (prerender) render the final value so the static HTML
  // shows real numbers; in the browser this is unchanged (counts up from 0).
  const [value, setValue] = useState(() => (typeof window === 'undefined' ? to : 0));

  useEffect(() => {
    if (!inView) return undefined;
    if (prefersReducedMotion()) {
      setValue(to);
      return undefined;
    }
    let raf;
    let start;
    const tick = (now) => {
      if (start === undefined) start = now;
      const t = Math.min(1, (now - start) / duration);
      setValue(easeOutExpo(t) * to);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration]);

  return (
    <span ref={ref} className={className}>
      <span aria-hidden="true">{format(value)}</span>
      <span className="sr-only">{format(to)}</span>
    </span>
  );
}
