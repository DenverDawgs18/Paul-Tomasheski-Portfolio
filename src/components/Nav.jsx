import { useEffect, useRef, useState } from 'react';

const links = [
  { href: '#work', label: 'Work', index: '01' },
  { href: '#research', label: 'Research', index: '02' },
  { href: '#about', label: 'About', index: '03' },
  { href: '#contact', label: 'Contact', index: '04' },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('');
  const barRef = useRef(null);

  // Scroll-linked reading progress + backdrop border, throttled to rAF.
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      if (barRef.current) {
        const p = max > 0 ? Math.min(1, doc.scrollTop / max) : 0;
        barRef.current.style.transform = `scaleX(${p})`;
      }
      setScrolled(doc.scrollTop > 12);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Scrollspy: highlight the section currently in the middle of the viewport.
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return undefined;
    const targets = ['top', ...links.map((l) => l.href.slice(1))]
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id === 'top' ? '' : `#${entry.target.id}`);
          }
        });
      },
      { rootMargin: '-35% 0px -55% 0px' }
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);

  return (
    <header className={`nav ${scrolled ? 'is-scrolled' : ''}`}>
      <span ref={barRef} className="nav-progress" aria-hidden="true" />
      <div className="container nav-inner">
        <a href="#top" className="nav-brand" aria-label="Paul Tomasheski — home">
          <span className="nav-brand-mark">$</span>
          <span className="nav-brand-name">paul-tomasheski</span>
          <span className="brand-cursor" aria-hidden="true" />
        </a>
        <nav aria-label="Primary">
          <ul className="nav-links">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className={`nav-link${active === l.href ? ' is-active' : ''}`}
                >
                  <span className="nav-link-index">{l.index}</span>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
