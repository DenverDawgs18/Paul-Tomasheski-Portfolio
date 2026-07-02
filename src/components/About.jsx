import Reveal from './Reveal.jsx';
import SectionHeader from './SectionHeader.jsx';

const coursework = [
  'Calculus I-III',
  'Ordinary Differential Equations',
  'Intro to Analysis I-II',
  'Intro to Abstract Algebra I-II',
  'Linear Algebra',
  'Deep Learning',
];

const upcoming = [
  'Honors Combinatorics',
  'Honors Abstract Algebra I',
  'Spanish III',
];

export default function About() {
  return (
    <section id="about" className="section">
      <div className="container">
        <SectionHeader index="03" title="About" />

        <div className="about-grid">
          <Reveal className="about-body">
            <p>
              I'm a <strong>self-taught developer</strong> who worked through
              The Odin Project's full curriculum end-to-end, then kept going.
              These days I spend most of my time shipping small AI-first tools
              and doing independent research.
            </p>
            <p>
              Everything on the coursework list I completed while still in high
              school, alongside running an independent, revenue-generating
              web development business that I still operate today. This fall I
              start as a <strong>first-year student at Ohio State</strong>, a
              junior by credit hours, taking Honors Combinatorics, Honors
              Abstract Algebra I, and Spanish III.
            </p>
            <p>
              I continue to give back to The Odin Project as a volunteer tutor,
              and I've earned <strong>Club 40 distinction</strong> within the
              organization, a recognition given to roughly 0.3% of members in a
              community 180,000 strong.
            </p>
          </Reveal>

          <Reveal className="coursework" delay={140}>
            <div className="coursework-title">Completed in high school</div>
            <ul className="coursework-list">
              {coursework.map((c, i) => (
                <li key={c} style={{ '--i': i }}>{c}</li>
              ))}
            </ul>

            <div className="coursework-divider" aria-hidden="true" />

            <div className="coursework-title">Fall 2026 · Ohio State</div>
            <ul className="coursework-list">
              {upcoming.map((c, i) => (
                <li key={c} style={{ '--i': coursework.length + i }}>{c}</li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
