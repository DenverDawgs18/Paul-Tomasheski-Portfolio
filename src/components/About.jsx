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
        <div className="section-header">
          <span className="section-index">03</span>
          <h2 className="section-title">About</h2>
          <span className="section-rule" aria-hidden="true" />
        </div>

        <div className="about-grid">
          <div className="about-body">
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
          </div>

          <div className="coursework">
            <div className="coursework-title">Coursework completed</div>
            <ul className="coursework-list">
              {coursework.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
