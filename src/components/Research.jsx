const PAPER_URL =
  'https://drive.google.com/file/d/1p-HqkymJCDcFCCcJTsqqqrPePywgtsz-/view?usp=drive_link';

export default function Research() {
  return (
    <section id="research" className="section research">
      <div className="container">
        <div className="section-header">
          <span className="section-index">02</span>
          <h2 className="section-title">Research</h2>
          <span className="section-rule" aria-hidden="true" />
        </div>

        <article className="research-card">
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
              <span className="metric-value">0.94</span>
              <span className="metric-label">Precision · classification</span>
            </div>
            <div className="metric" role="listitem">
              <span className="metric-value">0.76</span>
              <span className="metric-label">F1 · classification</span>
            </div>
            <div className="metric" role="listitem">
              <span className="metric-value">SOTA</span>
              <span className="metric-label">vs prior LSTM summarization</span>
            </div>
            <div className="metric" role="listitem">
              <span className="metric-value">1.5k</span>
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
      </div>
    </section>
  );
}
