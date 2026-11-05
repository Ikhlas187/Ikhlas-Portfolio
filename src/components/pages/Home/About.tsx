import { useLocale } from '@/lib/LocaleProvider'
import { ABOUT, type AboutSegment } from '@/data/about'
import '@/components/pages/Home/About.css'

function renderSegment(segment: AboutSegment, key: number) {
  if (typeof segment === 'string') return segment
  if ('highlight' in segment) return segment.highlight
  if ('link' in segment) {
    return (
      <a key={key} href={segment.href} target="_blank" rel="noopener noreferrer">
        {segment.link}
      </a>
    )
  }
  return <em key={key}>{segment.quote}</em>
}

/* Section About (réf. abhijitrout.in/#about) : planche claire, récit poussé à gauche, texte seul sans animation. */
export default function About() {
  const { locale } = useLocale()
  const about = ABOUT[locale]

  return (
    <section className="about" id="about">
      <p className="about__kicker">{about.kicker}</p>

      <div className="about__row">
        <p className="about__label">{about.label}</p>

        <div className="about__body">
          {about.paragraphs.map((paragraph, i) => (
            <p key={i}>{paragraph.map(renderSegment)}</p>
          ))}
        </div>
      </div>
    </section>
  )
}
