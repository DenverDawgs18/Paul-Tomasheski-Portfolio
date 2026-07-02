import ProjectCard from './ProjectCard.jsx';

const projects = [
  {
    title: 'MailMind',
    oneLiner: 'Turns your inbox into a to-do list in under 5 minutes.',
    description:
      'AI-powered email triage tool that automatically extracts and classifies action items across your inbox, so you can spend your morning doing work instead of finding it.',
    stack: ['Django', 'HTML', 'CSS', 'JavaScript'],
    link: 'https://mailmind.fly.dev/',
    status: { variant: 'live', label: 'Live — actively refactoring' },
  },
  {
    title: 'Chronicle',
    oneLiner: 'Velocity-based training from your phone camera.',
    description:
      'A software-only VBT system — no wearables or sensors required. Point your phone at the bar and Chronicle measures lift velocity in real time.',
    // PLACEHOLDER: Chronicle stack not confirmed — reusing MailMind's stack as a guess.
    // Paul: please confirm and update if this differs (e.g. Python/OpenCV, React Native, etc.).
    stack: ['Django', 'HTML', 'CSS', 'JavaScript'],
    link: 'https://chronicle-icy-darkness-422.fly.dev/',
    status: { variant: 'shipped', label: 'Shipped' },
  },
];

export default function Work() {
  return (
    <section id="work" className="section">
      <div className="container">
        <div className="section-header">
          <span className="section-index">01</span>
          <h2 className="section-title">Work</h2>
          <span className="section-rule" aria-hidden="true" />
        </div>

        <div className="work-grid">
          {projects.map((p) => (
            <ProjectCard key={p.title} {...p} />
          ))}

          <article className="card card-mini">
            <h3 className="card-title">Freelance web development</h3>
            <p className="card-body">
              Ran a small web development business in high school —
              built sites for local clients and generated four figures in revenue
              before college.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
