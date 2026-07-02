import CountUp from './CountUp.jsx';
import Reveal from './Reveal.jsx';
import ScrambleText from './ScrambleText.jsx';
import SectionHeader from './SectionHeader.jsx';
import useSpotlight from '../hooks/useSpotlight.js';

const PAPER_URL =
  'https://drive.google.com/file/d/1p-HqkymJCDcFCCcJTsqqqrPePywgtsz-/view?usp=drive_link';

export default function Research() {
  const spotlight = useSpotlight();

  return (
    <section id="research" className="section research">
      <div className="container">
        <SectionHeader index="02" title="Research" />

        <Reveal>
          <article
            className="research-card"
            ref={spotlight.ref}
            onPointerMove={spotlight.onPointerMove}
          >
            <div>
              <div className="research-label">Independent research · Paper</div>
              <h3 className="research-title">
                Automatic Action Item Extraction from Emails with Classification
              </h3>
              <div className="research-role">Author · sole contributor</div>
              <p className="research-summary">
                I hand-labeled a novel dataset of <strong>1,500 emails</strong> drawn
                from the Enron corpus and fine-tuned an LLM to
                <strong> jointly classify and summarize action items in a single pass</strong>.
                On realistic inbox data — a mix of actionable and non-actionable
                messages — the model beats traditional multi-step LSTM pipelines
                across the metrics that matter for real users.
              </p>
            </div>

            <div className="research-metrics" role="list" aria-label="Key results">
              <div className="metric" role="listitem">
                <span className="metric-value">
                  <CountUp to={0.94} format={(v) => v.toFixed(2)} />
                </span>
                <span className="metric-label">Precision · classification</span>
              </div>
              <div className="metric" role="listitem">
                <span className="metric-value">
                  <CountUp to={0.76} format={(v) => v.toFixed(2)} />
                </span>
                <span className="metric-label">F1 · classification</span>
              </div>
              <div className="metric" role="listitem">
                <ScrambleText
                  className="metric-value"
                  text="SOTA"
                  startOnVisible
                />
                <span className="metric-label">vs prior LSTM summarization</span>
              </div>
              <div className="metric" role="listitem">
                <span className="metric-value">
                  <CountUp to={1.5} format={(v) => `${v.toFixed(1)}k`} />
                </span>
                <span className="metric-label">Hand-labeled emails</span>
              </div>
            </div>

            <div className="research-actions">
              <a
                className="button-primary"
                href={PAPER_URL}
                target="_blank"
                rel="noreferrer noopener"
              >
                Read the paper
                <svg
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
              <a className="button-ghost" href="#contact">
                Discuss the work
              </a>
            </div>
          </article>
        </Reveal>
      </div>
    </section>
  );
}
