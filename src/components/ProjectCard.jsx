import useSpotlight from '../hooks/useSpotlight.js';

function Badge({ variant, children }) {
  const cls =
    variant === 'live' ? 'badge badge-live'
    : variant === 'shipped' ? 'badge badge-shipped'
    : 'badge';
  return (
    <span className={cls}>
      <span className="badge-dot" aria-hidden="true" />
      {children}
    </span>
  );
}

export default function ProjectCard({
  index,
  title,
  oneLiner,
  description,
  stack,
  link,
  status,
}) {
  const spotlight = useSpotlight();

  return (
    <article
      className="card"
      ref={spotlight.ref}
      onPointerMove={spotlight.onPointerMove}
    >
      {index && (
        <span className="card-index" aria-hidden="true">{index}</span>
      )}
      <div className="card-head">
        <h3 className="card-title">
          {link ? (
            <a href={link} target="_blank" rel="noreferrer noopener">
              {title}
            </a>
          ) : (
            title
          )}
        </h3>
        {status && <Badge variant={status.variant}>{status.label}</Badge>}
      </div>
      <p className="card-oneliner">{oneLiner}</p>
      <p className="card-body">{description}</p>
      <div className="card-foot">
        <div className="card-stack">
          {stack.map((s) => (
            <span key={s} className="stack-tag">{s}</span>
          ))}
        </div>
        {link && (
          <a
            className="card-link"
            href={link}
            target="_blank"
            rel="noreferrer noopener"
          >
            <span>visit site</span>
            <svg
              className="card-link-arrow"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="7" y1="17" x2="17" y2="7" />
              <polyline points="7 7 17 7 17 17" />
            </svg>
          </a>
        )}
      </div>
    </article>
  );
}
