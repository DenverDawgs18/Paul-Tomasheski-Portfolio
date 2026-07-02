export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <span>© {new Date().getFullYear()} Paul Tomasheski</span>
        <span>
          Built with React + Vite ·{' '}
          <a
            href="https://github.com/DenverDawgs18"
            target="_blank"
            rel="noreferrer noopener"
          >
            source
          </a>
        </span>
      </div>
    </footer>
  );
}
