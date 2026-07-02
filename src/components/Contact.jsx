const links = [
  {
    label: 'Email',
    value: 'pautomas55@gmail.com',
    href: 'mailto:pautomas55@gmail.com',
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
  return (
    <section id="contact" className="section">
      <div className="container">
        <div className="section-header">
          <span className="section-index">04</span>
          <h2 className="section-title">Contact</h2>
          <span className="section-rule" aria-hidden="true" />
        </div>

        <p className="contact-lede">
          Working on something interesting, or want to talk about email triage,
          VBT, or LLM fine-tuning? My inbox is open.
        </p>

        <ul className="contact-links">
          {links.map((l) => {
            const external = l.href.startsWith('http');
            return (
              <li key={l.label}>
                <a
                  href={l.href}
                  {...(external ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
                >
                  <span className="contact-label">{l.label}</span>
                  <span className="contact-value">{l.value}</span>
                  <span className="contact-arrow" aria-hidden="true">→</span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
