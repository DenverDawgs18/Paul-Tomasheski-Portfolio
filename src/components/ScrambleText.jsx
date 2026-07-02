import { useEffect, useRef, useState } from 'react';
import useInView from '../hooks/useInView.js';
import { prefersReducedMotion } from '../lib/motion.js';

const GLYPHS = '!<>-_\\/[]{}=+*^?#$%&';

const randomGlyph = () => GLYPHS[(Math.random() * GLYPHS.length) | 0];

const scrambleAll = (text) =>
  text
    .split('')
    .map((c) => (c === ' ' ? ' ' : randomGlyph()))
    .join('');

/**
 * Terminal-style decode effect: renders the target string at full length
 * from the first frame (no layout shift), resolving characters left to
 * right out of random glyphs. Screen readers only ever see the real text.
 */
export default function ScrambleText({
  text,
  as: Tag = 'span',
  className = '',
  startOnVisible = false,
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { threshold: 0.4 });
  const play = startOnVisible ? inView : true;
  const [display, setDisplay] = useState(() =>
    prefersReducedMotion() ? text : scrambleAll(text)
  );
  const doneRef = useRef(false);

  useEffect(() => {
    if (!play || doneRef.current) return undefined;
    if (prefersReducedMotion()) {
      setDisplay(text);
      doneRef.current = true;
      return undefined;
    }
    let raf;
    let start;
    const duration = 420 + text.length * 26;
    const tick = (now) => {
      if (start === undefined) start = now;
      const t = Math.min(1, (now - start) / duration);
      const resolved = Math.floor(t * text.length);
      let next = text.slice(0, resolved);
      for (let i = resolved; i < text.length; i += 1) {
        next += text[i] === ' ' ? ' ' : randomGlyph();
      }
      setDisplay(next);
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        doneRef.current = true;
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [play, text]);

  return (
    <Tag ref={ref} className={className}>
      <span aria-hidden="true">{display}</span>
      <span className="sr-only">{text}</span>
    </Tag>
  );
}

/**
 * Cycles through words, re-scrambling on each change. Reserves the width
 * of the longest word so the surrounding line never jitters.
 */
export function ScrambleCycle({ words, interval = 2800, className = '' }) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion()) return undefined;
    const id = setInterval(() => setIdx((i) => (i + 1) % words.length), interval);
    return () => clearInterval(id);
  }, [words, interval]);

  const longest = Math.max(...words.map((w) => w.length));

  return (
    <span className="scramble-cycle" style={{ minWidth: `${longest}ch` }}>
      <ScrambleText key={words[idx]} text={words[idx]} className={className} />
    </span>
  );
}
