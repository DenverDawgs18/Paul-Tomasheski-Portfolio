import { useRef } from 'react';
import ScrambleText, { ScrambleCycle } from './ScrambleText.jsx';

const NAME = 'Paul Tomasheski';

function AnimatedName({ text }) {
  const words = text.split(' ');
  return (
    <h1 className="hero-name" aria-label={text}>
      {words.map((word, w) => {
        const offset = words.slice(0, w).reduce((n, x) => n + x.length, 0);
        return (
          <span className="hero-word" key={word} aria-hidden="true">
            {[...word].map((ch, i) => (
              <span
                className="hero-letter"
                style={{ '--i': offset + i }}
                key={`${ch}-${i}`}
              >
                {ch}
              </span>
            ))}
          </span>
        );
      })}
    </h1>
  );
}

export default function Hero() {
  const spotRef = useRef(null);

  // Amber dot-grid spotlight that follows the cursor (hidden on touch).
  const onPointerMove = (e) => {
    const el = spotRef.current;
    if (!el) return;
    const rect = e.currentTarget.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    el.style.setProperty('--my', `${e.clientY - rect.top}px`);
    el.style.opacity = '1';
  };
  const onPointerLeave = () => {
    if (spotRef.current) spotRef.current.style.opacity = '0';
  };

  return (
    <section
      id="top"
      className="section hero"
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      <div className="hero-grid" aria-hidden="true" />
      <div className="hero-grid hero-grid-spot" ref={spotRef} aria-hidden="true" />

      <div className="container hero-inner">
        <div className="hero-eyebrow-row">
          <ScrambleText className="hero-eyebrow" text="// portfolio · v2" />
          <span className="type-cursor" aria-hidden="true" />
        </div>

        <AnimatedName text={NAME} />

        <p className="hero-tagline">
          <strong>Self-taught developer</strong> building AI-first tools
          for everyday work.
        </p>

        <div className="hero-cta-row">
          <a href="#work" className="hero-cta" aria-label="Scroll to Work">
            <span>See selected work</span>
            <svg
              className="hero-cta-arrow"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <polyline points="19 12 12 19 5 12" />
            </svg>
          </a>
          <span className="hero-meta">
            {'// currently '}
            <ScrambleCycle
              words={['shipping', 'researching', 'learning']}
              className="hero-meta-word"
            />
          </span>
        </div>
      </div>
    </section>
  );
}
