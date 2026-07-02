import { useRef } from 'react';
import useInView from '../hooks/useInView.js';

/**
 * Fade-and-rise on first scroll into view. Purely additive: renders a
 * plain element with the `reveal` class; CSS handles the motion (and
 * prefers-reduced-motion collapses it to an instant show).
 */
export default function Reveal({
  as: Tag = 'div',
  delay = 0,
  className = '',
  children,
  ...rest
}) {
  const ref = useRef(null);
  const inView = useInView(ref);

  return (
    <Tag
      ref={ref}
      className={`reveal${inView ? ' is-visible' : ''}${className ? ` ${className}` : ''}`}
      style={{ '--reveal-delay': `${delay}ms` }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
