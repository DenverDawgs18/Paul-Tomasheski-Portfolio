import { useCallback, useRef } from 'react';

/**
 * Cursor-tracking spotlight: writes --mx/--my (px, element-local) as CSS
 * custom properties so a ::before radial gradient can follow the pointer.
 * Writes styles directly on the node to avoid re-rendering on every move.
 */
export default function useSpotlight() {
  const ref = useRef(null);

  const onPointerMove = useCallback((e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    el.style.setProperty('--my', `${e.clientY - rect.top}px`);
  }, []);

  return { ref, onPointerMove };
}
