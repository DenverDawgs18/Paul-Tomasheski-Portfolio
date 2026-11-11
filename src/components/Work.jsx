import ProjectCard from './ProjectCard.jsx';
import Reveal from './Reveal.jsx';
import SectionHeader from './SectionHeader.jsx';

const projects = [
  {
    title: 'MailMind',
    oneLiner: 'Turns your inbox into a to-do list in under 5 minutes.',
    description:
      'AI-powered email triage tool that automatically extracts and classifies action items across your inbox, so you can spend your morning doing work instead of finding it.',
    stack: ['Django', 'HTML', 'CSS', 'JavaScript'],
    link: 'https://mailmind.fly.dev/',
    status: { variant: 'live', label: 'Live · actively refactoring' },
  },
  {
    title: 'Chronicle',
    oneLiner: 'Velocity-based training from your phone camera.',
    description:
      'A software-only VBT system with no wearables or sensors required. Point your phone at the bar and Chronicle measures lift velocity in real time.',
    // PLACEHOLDER: Chronicle stack not confirmed, reusing MailMind's stack as a guess.
    // Paul: please confirm and update if this differs (e.g. Python/OpenCV, React Native, etc.).
    stack: ['Django', 'HTML', 'CSS', 'JavaScript'],
    link: 'https://chronicle-icy-darkness-422.fly.dev/',
    status: { variant: 'shipped', label: 'Shipped' },
  },
  {
    title: 'FM Standards Checker',
    oneLiner: 'Audits a building model against FM loss-prevention standards.',
    description:
      'Drop in a BIM model (IFC) or JSON and it checks spaces, fire ratings, sprinkler coverage, roof ratings and transformers against a simplified encoding of FM Global Property Loss Prevention Data Sheets, surfacing issues for a fire protection engineer to review.',
    // PLACEHOLDER: stack inferred from the live app (IFC/JSON import, in-browser checks).
    // Paul: confirm the framework and any backend.
    stack: ['IFC / BIM', 'JavaScript'],
    link: 'https://fm-standards-checker.fly.dev/',
    status: { variant: 'shipped', label: 'Shipped' },
  },
  {
    title: 'StoryBook',
    oneLiner: 'Old stories, performed aloud in the dark.',
    description:
      'Turns public-domain stories from Project Gutenberg into full audio performances: a distinct synthesized voice per character, over a soundscape and score built from scratch for each tale. Bring your own manuscript in the Studio, or just put the lights out and listen.',
    // PLACEHOLDER: Kokoro-82M (TTS) and Web Audio are named on the site; the
    // generation backend (Python?) is a guess. Paul: confirm the pipeline language.
    stack: ['Kokoro-82M', 'Web Audio', 'Python'],
    link: 'https://storybook-audio.fly.dev/',
    linkLabel: 'listen',
    status: { variant: 'live', label: 'Live · adding stories' },
  },
  {
    title: 'Freelance Web Development',
    oneLiner: 'A revenue-generating business, running since high school.',
    description:
      "An independent web development business I started in high school and still run today, designing and shipping sites for real clients. It has been profitable since the start, and I'm currently open to new work.",
    // PLACEHOLDER: freelance stack is a reasonable guess. Paul: update with what
    // flyingstarship.com (and your other client sites) are actually built on.
    stack: ['HTML', 'CSS', 'JavaScript'],
    link: 'https://flyingstarship.com/',
    linkLabel: 'flyingstarship.com',
    status: { variant: 'open', label: 'Open to new clients' },
  },
];

export default function Work() {
  return (
    <section id="work" className="section">
      <div className="container">
        <SectionHeader index="01" title="Work" />

        <div className="work-grid">
          {projects.map((p, i) => (
            <Reveal key={p.title} delay={i * 110}>
              <ProjectCard index={`00${i + 1}`} {...p} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
