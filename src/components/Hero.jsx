export default function Hero() {
  return (
    <section id="top" className="section hero">
      <div className="container hero-inner">
        <span className="hero-eyebrow">// portfolio · v1</span>
        <h1 className="hero-name">Paul Tomasheski</h1>
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
          <span className="hero-meta">shipping · researching · learning</span>
        </div>
      </div>
    </section>
  );
}
