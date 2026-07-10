import './Process.css';

const STEPS = [
  {
    n: '01',
    title: 'Schedule your call',
    text: 'A quick, honest conversation — no pitch decks, no fluff.',
  },
  {
    n: '02',
    title: 'Subscribe to the plan',
    text: 'Pick a plan that fits where you are today. No lock-in.',
  },
  {
    n: '03',
    title: 'We ship in iterations',
    text: 'Weekly cycles, tight feedback loops.',
  },
  {
    n: '04',
    title: 'Repeat',
    text: "The longer we're in, the sharper we get.",
  },
];

export default function Process() {
  return (
    <section className="process">
      <div className="process__intro">
        <h2 className="process__headline">
          We don&rsquo;t work for your team
          <br />
          — we become part of it.
        </h2>
      </div>

      <ol className="process__steps">
        {STEPS.map((step) => (
          <li key={step.n} className="process__step">
            <span className="process__num">{step.n}</span>
            <h3 className="process__title">{step.title}</h3>
            <p className="process__text">{step.text}</p>
          </li>
        ))}
      </ol>

      <div className="process__bottom">
        <a
          className="process__cta"
          href="https://cal.com/verteal/15min"
          target="_blank"
          rel="noreferrer"
        >
          <span className="dot" />
          Schedule your call
          <span className="arrow" aria-hidden="true">→</span>
        </a>
      </div>
    </section>
  );
}
