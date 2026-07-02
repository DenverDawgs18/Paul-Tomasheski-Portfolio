import { useState } from 'react';
import Reveal from './Reveal.jsx';
import SectionHeader from './SectionHeader.jsx';

const EMAIL = 'pautomas55@gmail.com';

const links = [
  {
    label: 'Email',
    value: EMAIL,
    href: `mailto:${EMAIL}`,
    copy: true,
  },
  {
    label: 'GitHub',
    value: 'github.com/DenverDawgs18',
    href: 'https://github.com/DenverDawgs18',
  },
  {
    label: 'LinkedIn',
    value: 'linkedin.com/in/paul-tomasheski',
    href: 'https://www.linkedin.com/in/paul-tomasheski-8bab292a6/',
  },
];

export default function Contact() {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard unavailable (e.g. insecure context) — mailto link still works.
    }
  };

  return (
    <section id="contact" className="section">
      <div className="container">
        <SectionHeader index="04" title="Contact" />

        <Reveal as="p" className="contact-lede">
          Working on something interesting, or want to talk about email triage,
          VBT, or LLM fine-tuning? My inbox is open.
        </Reveal>

        <ul className="contact-links">
          {links.map((l, i) => {
            const external = l.href.startsWith('http');
            return (
              <Reveal as="li" key={l.label} delay={i * 90}>
                <a
                  href={l.href}
                  {...(external
                    ? { target: '_blank', rel: 'noreferrer noopener' }
                    : {})}
                >
                  <span className="contact-label">{l.label}</span>
                  <span className="contact-value">{l.value}</span>
                  <span className="contact-arrow" aria-hidden="true">→</span>
                </a>
                {l.copy && (
                  <button
                    type="button"
                    className={`copy-btn${copied ? ' is-copied' : ''}`}
                    onClick={copyEmail}
                    aria-label="Copy email address"
                  >
                    {copied ? 'copied ✓' : 'copy'}
                  </button>
                )}
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
