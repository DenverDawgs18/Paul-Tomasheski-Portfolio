import Reveal from './Reveal.jsx';

export default function SectionHeader({ index, title }) {
  return (
    <Reveal className="section-header">
      <span className="section-index">{index}</span>
      <h2 className="section-title">{title}</h2>
      <span className="section-rule" aria-hidden="true" />
    </Reveal>
  );
}
