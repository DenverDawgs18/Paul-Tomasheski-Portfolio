import { useState } from 'react';
import { Fold } from '../folds.jsx';

const EMAIL = 'pautomas55@gmail.com';
const PAPER_URL =
  'https://drive.google.com/file/d/1p-HqkymJCDcFCCcJTsqqqrPePywgtsz-/view?usp=drive_link';

function Ext({ href, children }) {
  return (
    <a className="ext" href={href} target="_blank" rel="noreferrer noopener">
      <span className="ext-text">{children}</span>
      <span className="ext-mark" aria-hidden="true">↗</span>
    </a>
  );
}

function CopyEmail() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard unavailable; the mailto link still works.
    }
  };
  return (
    <button
      type="button"
      className={`copy${copied ? ' is-copied' : ''}`}
      onClick={copy}
      aria-label="Copy email address"
    >
      {copied ? 'copied' : 'copy'}
    </button>
  );
}

/**
 * The entire site. Every <Fold> must read grammatically whether it is open
 * or closed, and in any combination with its neighbours, so expansions are
 * written as parentheticals and appositives that slot into the sentence.
 */
export default function Paragraph() {
  return (
    <p className="stretch">
      I’m Paul Tomasheski, a{' '}
      <Fold id="self-taught" term="self-taught developer">
        {' '}(I worked through every lesson of{' '}
        <Fold id="odin" term="The Odin Project">
          , where I now volunteer as a tutor and hold{' '}
          <Fold id="club-40" term="Club 40 distinction">
            , given to roughly 0.3% of members in a community 180,000 strong
          </Fold>
        </Fold>
        , then kept going)
      </Fold>{' '}
      who builds{' '}
      <Fold id="software" term="software people actually use">
        :{' '}
        <Fold id="mailmind" term="MailMind">
          {' '}(it turns your inbox into a to-do list in under five minutes by
          finding and classifying every action item; it’s{' '}
          <Ext href="https://mailmind.fly.dev/">live</Ext>, built with Django,
          and I’m refactoring it right now)
        </Fold>
        ,{' '}
        <Fold id="chronicle" term="Chronicle">
          {/* PLACEHOLDER: Chronicle's stack is unconfirmed, so it is left out
              of the copy. Paul: add it here once confirmed. */}
          {' '}(velocity-based training from nothing but a phone camera, with no
          wearables or sensors; it’s{' '}
          <Ext href="https://chronicle-icy-darkness-422.fly.dev/">
            shipped and running
          </Ext>
          )
        </Fold>
        , the{' '}
        <Fold id="fm" term="FM Standards Checker">
          {' '}(it audits IFC and JSON building models against FM Global’s
          property loss prevention data sheets, so a fire protection engineer
          starts from a list of issues instead of a blank page;{' '}
          <Ext href="https://fm-standards-checker.fly.dev/">try it</Ext>)
        </Fold>
        , and{' '}
        <Fold id="storybook" term="StoryBook">
          {' '}(public-domain classics performed with a synthesized voice for
          every character and a soundscape built from scratch for each tale;
          put the lights out and{' '}
          <Ext href="https://storybook-audio.fly.dev/">listen</Ext>)
        </Fold>
      </Fold>
      . I wrote{' '}
      <Fold id="paper" term="a research paper">
        {' '}(
        <cite>Automatic Action Item Extraction from Emails with Classification</cite>
        : I hand-labeled 1,500 emails from the Enron corpus and fine-tuned a
        single language model to classify and summarize action items in one
        pass,{' '}
        <Fold id="results" term="beating the multi-step LSTM pipelines that came before it">
          {/* PLACEHOLDER: the ROUGE-L value (0.44) is a stand-in. Paul: replace
              it with the real score from the paper. */}
          , with 0.94 precision on classification and a ROUGE-L of 0.44 on
          summarization
        </Fold>
        ; <Ext href={PAPER_URL}>read it</Ext>)
      </Fold>{' '}
      on teaching machines to read email, I{' '}
      <Fold id="business" term="run a small web business">
        {' '}(I started it in high school, it has brought in four figures of
        revenue, and I still run it, building sites for clients like{' '}
        <Ext href="https://flyingstarship.com/">flyingstarship.com</Ext>;{' '}
        <strong>I’m taking new clients</strong>)
      </Fold>
      , and I’m{' '}
      <Fold id="ohio-state" term="a student at Ohio State">
        {' '}(a first-year, but a junior by credits, taking Honors
        Combinatorics, Honors Abstract Algebra I, and Spanish III this
        semester, after finishing{' '}
        <Fold id="hs-math" term="a lot of math in high school">
          : Calculus I-III, ordinary differential equations, Intro to Analysis
          I-II, Intro to Abstract Algebra I-II, linear algebra, and deep
          learning
        </Fold>
        )
      </Fold>
      . Write to me{' '}
      <Fold id="anything" term="about anything">
        {' '}(math, AI, something niche in one of the areas above, or a site you
        need built)
      </Fold>{' '}
      at <a href={`mailto:${EMAIL}`}>{EMAIL}</a> <CopyEmail />, or find me on{' '}
      <Ext href="https://github.com/DenverDawgs18">GitHub</Ext> and{' '}
      <Ext href="https://www.linkedin.com/in/paul-tomasheski-8bab292a6/">
        LinkedIn
      </Ext>
      .
    </p>
  );
}
