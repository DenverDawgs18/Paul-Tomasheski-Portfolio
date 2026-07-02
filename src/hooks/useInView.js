import { useEffect, useState } from 'react';

/**
 * Tracks whether an element has entered the viewport.
 * `once` (default) latches true after the first intersection.
 */
export default function useInView(
  ref,
  { once = true, rootMargin = '0px 0px -10% 0px', threshold = 0.08 } = {}
) {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return undefined;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) io.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { rootMargin, threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, once, rootMargin, threshold]);

  return inView;
}
