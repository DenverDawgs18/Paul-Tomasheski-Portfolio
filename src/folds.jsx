import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

/**
 * Stretchtext engine. The whole site is one paragraph; any phrase wrapped
 * in <Fold> can unfold its own text inline, and folds nest. Which folds are
 * open lives in the URL hash (#mailmind+paper), so every reader's version
 * of the page is shareable.
 */

const FoldContext = createContext(null);

// Section anchors from the previous site map onto the folds that now hold
// that content, so old links still land somewhere sensible.
const LEGACY = {
  work: ['software'],
  research: ['paper'],
  about: ['self-taught', 'ohio-state'],
  contact: ['anything'],
};

function readHash() {
  if (typeof window === 'undefined') return [];
  let raw = '';
  try {
    raw = decodeURIComponent(window.location.hash.slice(1));
  } catch {
    return [];
  }
  if (!raw) return [];
  return raw
    .split('+')
    .flatMap((id) => LEGACY[id] ?? [id])
    .filter((id) => /^[a-z0-9-]+$/.test(id));
}

export function FoldProvider({ children }) {
  const [open, setOpen] = useState(() => new Set(readHash()));
  // Folds opened by the reader just now; they get the ink-in animation.
  const [fresh, setFresh] = useState(() => new Set());

  // Mirror open folds into the URL without adding history entries.
  useEffect(() => {
    const ids = [...open];
    const { pathname, search } = window.location;
    const url = pathname + search + (ids.length ? `#${ids.join('+')}` : '');
    window.history.replaceState(null, '', url);
  }, [open]);

  // #everything unfolds the whole page. The fold ids live in the rendered
  // paragraph, so swap the keyword for them once the DOM exists.
  useEffect(() => {
    if (!open.has('everything')) return;
    const ids = [...document.querySelectorAll('.stretch .term')].map(
      (t) => t.dataset.fold
    );
    setOpen(new Set(ids));
  }, [open]);

  // A hash pasted into the address bar of an open tab.
  useEffect(() => {
    const onHash = () => {
      setFresh(new Set());
      setOpen(new Set(readHash()));
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const toggle = useCallback((id) => {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    setFresh(new Set([id]));
  }, []);

  const openMany = useCallback((ids) => {
    setOpen((prev) => new Set([...prev, ...ids]));
    setFresh(new Set(ids));
  }, []);

  const closeAll = useCallback(() => {
    setFresh(new Set());
    setOpen(new Set());
  }, []);

  const settle = useCallback((id) => {
    setFresh((prev) => {
      if (!prev.has(id)) return prev;
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ open, fresh, toggle, openMany, closeAll, settle }),
    [open, fresh, toggle, openMany, closeAll, settle]
  );

  return <FoldContext.Provider value={value}>{children}</FoldContext.Provider>;
}

export function useFolds() {
  return useContext(FoldContext);
}

/**
 * A phrase that unfolds. The term stays put; its text appears right after
 * it, inside the same sentence. Closed folds are `hidden`, so the prerendered
 * HTML still carries every word for crawlers, and no-JS readers see it all
 * (see the .no-js rule in global.css).
 */
export function Fold({ id, term, children }) {
  const { open, fresh, toggle, settle } = useFolds();
  const isOpen = open.has(id);
  const bodyId = `fold-${id}`;

  // A <span role="button"> rather than a <button>: browsers lay buttons out as
  // atomic boxes that can't break across lines, and a phrase in a sentence
  // has to wrap like the words around it.
  const onKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggle(id);
    }
  };

  return (
    <>
      <span
        role="button"
        tabIndex={0}
        className="term"
        data-fold={id}
        aria-expanded={isOpen}
        aria-controls={bodyId}
        onClick={() => toggle(id)}
        onKeyDown={onKeyDown}
      >
        <span className="term-text">{term}</span>
      </span>
      <span
        id={bodyId}
        className={`fold${isOpen && fresh.has(id) ? ' is-new' : ''}`}
        hidden={!isOpen}
        onAnimationEnd={(e) => {
          if (e.target === e.currentTarget) settle(id);
        }}
      >
        {children}
      </span>
    </>
  );
}
