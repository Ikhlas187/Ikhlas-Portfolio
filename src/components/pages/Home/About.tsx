import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { useGSAP } from '@gsap/react'
import { useLocale } from '@/lib/LocaleProvider'
import { ABOUT, type AboutSegment } from '@/data/about'
import '@/components/pages/Home/About.css'

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP)

function renderSegment(segment: AboutSegment, key: number) {
  if (typeof segment === 'string') return segment
  if ('highlight' in segment)
    return (
      <mark key={key} className="about__hl">
        {segment.highlight}
      </mark>
    )
  if ('link' in segment) {
    return (
      <a key={key} href={segment.href} target="_blank" rel="noopener noreferrer">
        {segment.link}
      </a>
    )
  }
  return <em key={key}>{segment.quote}</em>
}

/* Section About (réf. abhijitrout.in/#about) : planche claire, récit poussé à gauche, widget d'appel à droite. */
export default function About() {
  const root = useRef<HTMLElement>(null)
  const { locale } = useLocale()
  const about = ABOUT[locale]

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

      // autoSplit redécoupe au chargement des polices et au resize, et recrée l'animation rendue par onSplit.
      SplitText.create('.about__kicker', {
        type: 'chars',
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(self.chars, {
            autoAlpha: 0,
            duration: 0.02,
            ease: 'none',
            stagger: 0.045,
            scrollTrigger: { trigger: '.about__kicker', start: 'top 85%', once: true },
          }),
      })

      const section = root.current!
      const palette = getComputedStyle(section)
      const unreadColor = palette.getPropertyValue('--color-gray-500').trim()
      const readColor = palette.getPropertyValue('--color-black').trim()
      let reading: gsap.core.Timeline | undefined

      // autoSplit redécoupe au resize : la lecture au scroll est reconstruite sur les nouvelles lignes.
      SplitText.create('.about__body p', {
        type: 'lines',
        mask: 'lines',
        autoSplit: true,
        onSplit: (self) => {
          reading?.revert()
          const highlights = section.querySelectorAll<HTMLElement>('.about__hl')

          // Chaque ligne passe du gris au noir au fil du scroll, les mots surlignés se colorent en dernier.
          reading = gsap
            .timeline({
              scrollTrigger: {
                trigger: section.querySelector('.about__body'),
                start: 'top 70%',
                end: 'bottom 45%',
                scrub: 0.6,
              },
            })
            .fromTo(self.lines, { color: unreadColor }, { color: readColor, duration: 1, stagger: 1, ease: 'none' })
            .fromTo(
              highlights,
              { color: unreadColor, backgroundSize: '0% 88%' },
              { color: readColor, backgroundSize: '100% 88%', duration: 1.5, stagger: 0.75, ease: 'power1.out' },
            )

          return gsap.from(self.lines, {
            yPercent: 110,
            duration: 0.9,
            ease: 'power4.out',
            stagger: 0.06,
            scrollTrigger: { trigger: '.about__row', start: 'top 75%', once: true },
          })
        },
      })

      return () => reading?.revert()
    },
    { scope: root },
  )

  return (
    <section className="about" id="about" ref={root}>
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
