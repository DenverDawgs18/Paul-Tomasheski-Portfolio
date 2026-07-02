const REPO = 'https://github.com/DenverDawgs18/Paul-Tomasheski-Portfolio';

// Injected at build time by vite.config.js (git rev-parse); 'dev' locally
// when git is unavailable.
const hash = typeof __COMMIT_HASH__ === 'string' ? __COMMIT_HASH__ : 'dev';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <span>
          © {new Date().getFullYear()} Paul Tomasheski ·{' '}
          {hash !== 'dev' ? (
            <a
              className="footer-rev"
              href={`${REPO}/commit/${hash}`}
              target="_blank"
              rel="noreferrer noopener"
              title="Deployed commit"
            >
              rev {hash}
            </a>
          ) : (
            <span className="footer-rev">rev dev</span>
          )}
        </span>
        <span>
          Built with React + Vite ·{' '}
          <a href={REPO} target="_blank" rel="noreferrer noopener">
            source
          </a>{' '}
          · <a href="#top">↑ top</a>
        </span>
      </div>
    </footer>
  );
}
