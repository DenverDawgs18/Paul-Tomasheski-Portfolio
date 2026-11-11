const REPO = 'https://github.com/DenverDawgs18/Paul-Tomasheski-Portfolio';

// Injected at build time by vite.config.js (git rev-parse).
const hash = typeof __COMMIT_HASH__ === 'string' ? __COMMIT_HASH__ : 'dev';

export default function Colophon() {
  return (
    <footer className="colophon">
      <p>
        This site is one paragraph. It borrows Ted Nelson’s StretchText
        (1967): text that grows in place, to whatever depth the reader wants,
        instead of sending them off to another page. The web went with pages.
        Whatever you unfold is kept in the address bar, so the version you
        share is the version they read.
      </p>
      <p className="colophon-meta">
        Set in Instrument Serif and Inter · React and Vite, prerendered to
        static HTML ·{' '}
        {hash === 'dev' ? (
          <span>rev dev</span>
        ) : (
          <a href={`${REPO}/commit/${hash}`} target="_blank" rel="noreferrer noopener">
            rev {hash}
          </a>
        )}{' '}
        ·{' '}
        <a href={REPO} target="_blank" rel="noreferrer noopener">
          source
        </a>
      </p>
    </footer>
  );
}
