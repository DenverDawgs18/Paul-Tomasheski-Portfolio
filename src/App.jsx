import { useEffect, useRef, useState } from 'react';
import { createField, measure } from './field/engine.js';

const EMAIL = 'pautomas55@gmail.com';
const REPO = 'https://github.com/DenverDawgs18/Paul-Tomasheski-Portfolio';
const PAPER_URL =
  'https://drive.google.com/file/d/1p-HqkymJCDcFCCcJTsqqqrPePywgtsz-/view?usp=drive_link';

// Injected at build time by vite.config.js (git rev-parse).
const hash = typeof __COMMIT_HASH__ === 'string' ? __COMMIT_HASH__ : 'dev';

/**
 * One entry per arrangement of the points. `shape` names a generator in
 * field/shapes.js; `side` is where the text sits (the figure takes the
 * other side). `fig` is the caption shown in the corner.
 */
const SCENES = [
  { id: 'top', shape: 'name', side: 'center', nav: 'Paul Tomasheski', fig: 'arranged as a name' },
  {
    id: 'about',
    shape: 'hopf',
    side: 'left',
    nav: 'About',
    fig: 'the Hopf fibration: every circle here links every other exactly once',
    kicker: 'About',
    title: 'Self-taught, then kept going.',
    body: (
      <>
        <p>
          I worked through every lesson of The Odin Project, where I now
          volunteer as a tutor and hold Club 40 distinction, given to roughly
          0.3% of members in a community 180,000 strong.
        </p>
        <p>
          I’m a first-year at Ohio State and a junior by credits, taking
          Honors Combinatorics, Honors Abstract Algebra I, and Spanish III
          this semester.
        </p>
      </>
    ),
    facts: [
      [
        'Before college',
        'Calculus I-III, ODEs, Analysis I-II, Abstract Algebra I-II, linear algebra, deep learning',
      ],
    ],
  },
  {
    id: 'mailmind',
    shape: 'envelope',
    side: 'right',
    nav: 'MailMind',
    fig: 'an envelope, and the list that was inside it',
    kicker: 'Work · 01',
    title: 'MailMind',
    lede: 'Your inbox, as a to-do list.',
    body: (
      <p>
        MailMind finds and classifies every action item in your email, so the
        inbox becomes a to-do list in under five minutes.
      </p>
    ),
    facts: [
      ['Built with', 'Django'],
      ['Status', 'Live'],
    ],
    link: ['Open MailMind', 'https://mailmind.fly.dev/'],
  },
  {
    id: 'chronicle',
    shape: 'barbell',
    side: 'left',
    nav: 'Chronicle',
    fig: 'a barbell, and the path it travelled',
    kicker: 'Work · 02',
    title: 'Chronicle',
    lede: 'Bar speed, from a phone camera.',
    body: (
      <p>
        Velocity-based training from nothing but a phone camera. No wearables
        and no sensors on the bar.
      </p>
    ),
    facts: [['Status', 'Shipped and running']],
    link: ['Open Chronicle', 'https://chronicle-icy-darkness-422.fly.dev/'],
  },
  {
    id: 'fm',
    shape: 'building',
    side: 'right',
    nav: 'FM Standards Checker',
    fig: 'a building model with three bays flagged',
    kicker: 'Work · 03',
    title: 'FM Standards Checker',
    lede: 'A list of issues instead of a blank page.',
    body: (
      <p>
        It audits IFC and JSON building models against FM Global’s property
        loss prevention data sheets, so a fire protection engineer starts
        from what’s wrong.
      </p>
    ),
    facts: [['Reads', 'IFC and JSON building models']],
    link: ['Try the checker', 'https://fm-standards-checker.fly.dev/'],
  },
  {
    id: 'storybook',
    shape: 'book',
    side: 'left',
    nav: 'StoryBook',
    fig: 'a book, read aloud',
    kicker: 'Work · 04',
    title: 'StoryBook',
    lede: 'Put the lights out and listen.',
    body: (
      <p>
        Public-domain classics performed with a synthesized voice for every
        character and a soundscape built from scratch for each tale.
      </p>
    ),
    facts: [['Source', 'Public-domain classics']],
    link: ['Listen', 'https://storybook-audio.fly.dev/'],
  },
  {
    id: 'research',
    shape: 'emails',
    side: 'right',
    nav: 'Research',
    fig: '1,500 emails, one square each',
    kicker: 'Research',
    title: 'Teaching machines to read email.',
    body: (
      <>
        <p>
          <cite>
            Automatic Action Item Extraction from Emails with Classification
          </cite>
        </p>
        <p>
          I hand-labeled 1,500 emails from the Enron corpus and fine-tuned a
          single language model to classify and summarize action items in one
          pass, beating the multi-step LSTM pipelines that came before it.
        </p>
      </>
    ),
    facts: [
      ['Labeled by hand', '1,500 emails'],
      ['Classification precision', '0.94'],
    ],
    link: ['Read the paper', PAPER_URL],
  },
  { id: 'contact', shape: 'hello', side: 'center', nav: 'Contact', fig: 'the same points, saying hello' },
];

function Arrow() {
  return (
    <span className="arrow" aria-hidden="true">
      ↗
    </span>
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
    <button type="button" className="copy" onClick={copy} aria-label="Copy email address">
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}

function Panel({ scene }) {
  return (
    <div className="panel">
      <p className="kicker">{scene.kicker}</p>
      <h2>{scene.title}</h2>
      {scene.lede && <p className="lede">{scene.lede}</p>}
      <div className="body">{scene.body}</div>
      {scene.facts && (
        <dl className="facts">
          {scene.facts.map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      )}
      {scene.link && (
        <a className="cta" href={scene.link[1]} target="_blank" rel="noreferrer noopener">
          {scene.link[0]}
          <Arrow />
        </a>
      )}
    </div>
  );
}

export default function App() {
  const canvasRef = useRef(null);
  const [active, setActive] = useState(0);
  const [count, setCount] = useState(60000);

  useEffect(() => {
    const sections = [...document.querySelectorAll('[data-shape]')];
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let field = null;
    let dead = false;

    createField(canvasRef.current, sections, { reduced })
      .then((f) => {
        if (dead) return f?.destroy();
        field = f;
        if (f) {
          setCount(f.count);
          document.documentElement.classList.add('gl');
        }
      })
      .catch(() => {});

    let queued = false;
    const update = () => {
      queued = false;
      setActive(Math.round(measure(sections)));
    };
    const onScroll = () => {
      if (!queued) {
        queued = true;
        requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      dead = true;
      field?.destroy();
      document.documentElement.classList.remove('gl');
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const points = count.toLocaleString('en-US');
  const cls = (i, extra = '') =>
    `scene scene-${SCENES[i].side}${active === i ? ' is-active' : ''}${extra}`;

  return (
    <>
      <canvas ref={canvasRef} className="field" aria-hidden="true" />

      <header className="bar">
        <a className="bar-name" href="#top">
          Paul Tomasheski
        </a>
        <a className="bar-status" href="#contact">
          <span className="dot" aria-hidden="true" />
          Taking new clients
        </a>
      </header>

      <nav className="rail" aria-label="Sections">
        {SCENES.map((s, i) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className={active === i ? 'is-active' : ''}
            aria-current={active === i ? 'true' : undefined}
          >
            <span className="rail-label">{s.nav}</span>
            <span className="rail-tick" aria-hidden="true" />
          </a>
        ))}
      </nav>

      <p className="fig" aria-hidden="true">
        <span className="fig-n">
          {String(active + 1).padStart(2, '0')} / {String(SCENES.length).padStart(2, '0')}
        </span>
        <span className="fig-text" key={active}>
          {points} points, {SCENES[active].fig}
        </span>
      </p>

      <main>
        <section id="top" data-shape="name" data-side="center" className={cls(0, ' hero')}>
          <h1>Paul Tomasheski</h1>
          <div className="hero-copy">
            <p className="hero-line">
              Self-taught developer and math student, building software
              people actually use.
            </p>
            <p className="hero-note">
              Everything on this page is drawn with the same {points} points.
              Scroll and they rearrange.
            </p>
          </div>
          <span className="cue" aria-hidden="true" />
        </section>

        {SCENES.slice(1, -1).map((s, k) => (
          <section
            key={s.id}
            id={s.id}
            data-shape={s.shape}
            data-side={s.side}
            className={cls(k + 1)}
          >
            <Panel scene={s} />
          </section>
        ))}

        <section
          id="contact"
          data-shape="hello"
          data-side="center"
          className={cls(SCENES.length - 1, ' contact')}
        >
          <div className="contact-copy">
            <h2>Say hello.</h2>
            <p className="body">
              Write to me about math, AI, something niche in any of the above,
              or a site you need built. I’ve run a small web business since
              high school, building sites for clients like{' '}
              <a href="https://flyingstarship.com/" target="_blank" rel="noreferrer noopener">
                flyingstarship.com
              </a>
              , and <strong>I’m taking new clients</strong>.
            </p>
            <p className="mail">
              <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
              <CopyEmail />
            </p>
            <p className="links">
              <a href="https://github.com/DenverDawgs18" target="_blank" rel="noreferrer noopener">
                GitHub
                <Arrow />
              </a>
              <a
                href="https://www.linkedin.com/in/paul-tomasheski-8bab292a6/"
                target="_blank"
                rel="noreferrer noopener"
              >
                LinkedIn
                <Arrow />
              </a>
            </p>
          </div>
          <footer className="colophon">
            <span>{points} points, one draw call, no libraries</span>
            <span>
              {hash === 'dev' ? (
                'rev dev'
              ) : (
                <a href={`${REPO}/commit/${hash}`} target="_blank" rel="noreferrer noopener">
                  rev {hash}
                </a>
              )}
              {' · '}
              <a href={REPO} target="_blank" rel="noreferrer noopener">
                source
              </a>
            </span>
          </footer>
        </section>
      </main>
    </>
  );
}
