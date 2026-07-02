import { useEffect, useState } from 'react';

const links = [
  { href: '#work', label: 'Work', index: '01' },
  { href: '#research', label: 'Research', index: '02' },
  { href: '#about', label: 'About', index: '03' },
  { href: '#contact', label: 'Contact', index: '04' },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`nav ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="container nav-inner">
        <a href="#top" className="nav-brand" aria-label="Paul Tomasheski — home">
          <span className="nav-brand-mark">$</span>
          <span>paul-tomasheski</span>
        </a>
        <nav aria-label="Primary">
          <ul className="nav-links">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="nav-link">
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
