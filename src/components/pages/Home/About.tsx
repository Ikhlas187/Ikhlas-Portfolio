import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { useGSAP } from '@gsap/react'
import CallWidget from '@/components/pages/Home/CallWidget'
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

      SplitText.create('.about__body p', {
        type: 'lines',
        mask: 'lines',
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(self.lines, {
            yPercent: 110,
            duration: 0.9,
            ease: 'power4.out',
            stagger: 0.06,
            scrollTrigger: { trigger: '.about__row', start: 'top 75%', once: true },
          }),
      })

      gsap
        .timeline({ scrollTrigger: { trigger: '.about__row', start: 'top 75%', once: true } })
        .from('.about__call-wrap', { x: 90, autoAlpha: 0, duration: 0.9, ease: 'back.out(1.6)' }, 1.2)

      gsap.to('.about__hl', {
        backgroundSize: '100% 88%',
        duration: 0.7,
        ease: 'power2.out',
        stagger: 0.45,
        delay: 0.8,
        scrollTrigger: { trigger: '.about__row', start: 'top 60%', once: true },
      })
    },
    { scope: root },
  )

  return (
    <section className="about" id="about" ref={root}>
      <p className="about__kicker">{ABOUT.kicker}</p>

      <div className="about__row">
        <p className="about__label">{ABOUT.label}</p>

        <div className="about__body">
          {ABOUT.paragraphs.map((paragraph, i) => (
            <p key={i}>{paragraph.map(renderSegment)}</p>
          ))}
        </div>

        <div className="about__call-wrap">
          <CallWidget />
        </div>
      </div>
    </section>
  )
}
