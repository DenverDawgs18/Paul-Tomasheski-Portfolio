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
