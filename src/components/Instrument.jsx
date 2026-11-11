import { useEffect, useRef, useState } from 'react';
import { useFolds } from '../folds.jsx';

const wordsIn = (s) =>
  s.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;

// Walk the paragraph's text: everything counts toward the total, only text
// outside closed folds counts as visible. The copy button is UI, not prose.
function measure(root) {
  let visible = 0;
  let total = 0;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    const el = n.parentElement;
    if (!el || el.closest('.copy')) continue;
    const w = wordsIn(n.data);
    total += w;
    if (!el.closest('[hidden]')) visible += w;
  }
  return { visible, total };
}

const reachable = (t) => t.getClientRects().length > 0;

/**
 * The page measures itself: how long it currently is, how long it could
 * be, and how much of it the reader has unfolded. Rendered client-side only
 * (it needs the live DOM), so the prerendered HTML stays pure prose.
 */
export default function Instrument() {
  const { open, toggle, openMany, closeAll } = useFolds();
  const [m, setM] = useState(null);
  const [copied, setCopied] = useState(false);
  const baseTitle = useRef(null);

  useEffect(() => {
    const root = document.querySelector('.stretch');
    if (!root) return;
    if (baseTitle.current === null) baseTitle.current = document.title;
    const terms = [...root.querySelectorAll('.term')];
    const { visible, total } = measure(root);
    setM({
      visible,
      total,
      folds: terms.length,
      opened: terms.filter((t) => t.getAttribute('aria-expanded') === 'true').length,
      remaining: terms.filter(
        (t) => t.getAttribute('aria-expanded') === 'false' && reachable(t)
      ).length,
    });
    document.title = open.size
      ? `Paul Tomasheski · ${visible} words`
      : baseTitle.current;
  }, [open]);

  if (!m) return null;

  const readOn = () => {
    const root = document.querySelector('.stretch');
    const next = [...root.querySelectorAll('.term[aria-expanded="false"]')].find(reachable);
    if (!next) return;
    toggle(next.dataset.fold);
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    requestAnimationFrame(() => {
      next.scrollIntoView({ block: 'center', behavior: reduce ? 'auto' : 'smooth' });
      next.focus({ preventScroll: true });
    });
  };

  const unfoldAll = () => {
    const root = document.querySelector('.stretch');
    openMany([...root.querySelectorAll('.term')].map((t) => t.dataset.fold));
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard unavailable; the address bar already holds the link.
    }
  };

  const allOpen = m.opened === m.folds;

  return (
    <aside
      className="instrument"
      aria-label="Page controls"
      style={{ '--p': m.total ? m.visible / m.total : 0 }}
    >
      <span className="instrument-bar" aria-hidden="true" />
      <p className="readout" aria-live="polite">
        <strong>{m.visible}</strong>
        <span className="readout-of"> of {m.total} words</span>
        <span className="readout-folds">
          {' · '}
          {m.opened}/{m.folds} unfolded
        </span>
      </p>
      <div className="instrument-actions">
        <button type="button" onClick={readOn} disabled={m.remaining === 0}>
          Read on <span aria-hidden="true">→</span>
        </button>
        {allOpen ? (
          <button type="button" onClick={closeAll}>
            Fold all
          </button>
        ) : (
          <button type="button" onClick={unfoldAll}>
            Unfold all
          </button>
        )}
        <button
          type="button"
          onClick={copyLink}
          disabled={open.size === 0}
          title="Copy a link to the page exactly as you have unfolded it"
        >
          {copied ? 'Copied' : 'Share this version'}
        </button>
      </div>
    </aside>
  );
}
