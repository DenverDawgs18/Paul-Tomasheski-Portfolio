import Reveal from './Reveal.jsx';
import SectionHeader from './SectionHeader.jsx';

const coursework = [
  'Calculus I–III',
  'Ordinary Differential Equations',
  'Intro to Analysis I–II',
  'Intro to Abstract Algebra I–II',
  'Linear Algebra',
  'Deep Learning',
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
              Alongside my projects, I've picked up the math and CS coursework
              I'd want in a formal program — most of it completed while still
              in high school. I also volunteer with <strong>Club 40</strong>.
            </p>
          </Reveal>

          <Reveal className="coursework" delay={140}>
            <div className="coursework-title">Coursework completed</div>
            <ul className="coursework-list">
              {coursework.map((c, i) => (
                <li key={c} style={{ '--i': i }}>{c}</li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
