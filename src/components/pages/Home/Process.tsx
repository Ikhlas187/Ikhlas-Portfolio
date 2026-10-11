import { ArrowRight } from 'lucide-react'
import { PROCESS } from '@/data/process'
import { SITE } from '@/data/site'
import '@/components/pages/Home/Process.css'

/* Section process : 4 étapes numérotées et CTA. Pas encore montée dans HomePage. */
export default function Process() {
  const [firstLine, secondLine] = PROCESS.headline

  return (
    <section className="process">
      <div className="process__intro">
        <h2 className="process__headline">
          {firstLine}
          <br />
          {secondLine}
        </h2>
      </div>

      <ol className="process__steps">
        {PROCESS.steps.map((step) => (
          <li key={step.n} className="process__step">
            <span className="process__num">{step.n}</span>
            <h3 className="process__title">{step.title}</h3>
            <p className="process__text">{step.text}</p>
          </li>
        ))}
      </ol>

      <div className="process__bottom">
        <a className="process__cta" href={`mailto:${SITE.email}`}>
          <span className="dot" />
          {PROCESS.cta}
          <ArrowRight className="arrow" size={16} aria-hidden="true" />
        </a>
      </div>
    </section>
  )
}
