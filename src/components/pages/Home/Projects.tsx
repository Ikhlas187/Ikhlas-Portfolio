import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'
import { useGSAP } from '@gsap/react'
import Interlude from '@/components/pages/Home/Interlude'
import ProjectBoard from '@/components/pages/Home/ProjectBoard'
import { PROJECTS } from '@/data/projects'
import { padIndex } from '@/logic/padIndex/padIndex'
import '@/components/pages/Home/Projects.css'

gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin, useGSAP)

/* Section projets (réf. galerie Behance de Sebastian Baldeon), recolorée dans la charte du site. */
export default function Projects() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia(root)

      // L'ellipse se redessine en boucle, en pause hors de l'écran.
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap
          .timeline({
            repeat: -1,
            repeatDelay: 1.2,
            scrollTrigger: {
              trigger: '.bd-interlude',
              start: 'top 75%',
              end: 'bottom 25%',
              toggleActions: 'play pause resume pause',
            },
          })
          .fromTo(
            '.bd-interlude__path',
            { drawSVG: '0%', autoAlpha: 1 },
            { drawSVG: '100%', duration: 2.5, ease: 'power2.inOut' },
          )
          .to('.bd-interlude__path', { autoAlpha: 0, duration: 0.5 }, '+=1.6')
      })

      // Pile de planches épinglée, 1 écran de scroll par planche. Sous 900px : flux vertical.
      mm.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
        const track = root.current!.querySelector('.bd-track')
        const boards = gsap.utils.toArray<HTMLElement>('.bd-board', track)
        const counterEl = root.current!.querySelector('.bd-counter__current')
        let counterIdx = 0

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: '.bd-horizontal',
            start: 'top top',
            end: () => `+=${(boards.length - 1) * window.innerHeight}`,
            pin: true,
            scrub: 0.7,
            anticipatePin: 1,
            onUpdate: (self) => {
              const idx = Math.round(self.progress * (boards.length - 1))
              if (idx === counterIdx || !counterEl) return
              counterIdx = idx
              counterEl.textContent = padIndex(idx + 1)
              gsap.fromTo(
                counterEl,
                { yPercent: 60, autoAlpha: 0 },
                { yPercent: 0, autoAlpha: 1, duration: 0.35, ease: 'power2.out' },
              )
            },
          },
        })

        // La dernière planche reste droite, quel que soit le nombre de projets.
        const restTilt = (i: number) => (i === boards.length - 1 ? 0 : i % 2 ? -1.6 : 1.4)

        boards.forEach((board, i) => {
          const side = i % 2 ? 1 : -1

          // Un seul gsap.set par planche : un double fromTo corrompt le cache de transformations GSAP.
          gsap.set(board, {
            zIndex: i + 1,
            transformOrigin: 'center 75%',
            xPercent: i === 0 ? 0 : 112,
            yPercent: i === 0 ? 0 : 7,
            rotation: i === 0 ? 0 : 7 * side,
          })
          if (i === 0) return

          tl.to(board, { xPercent: 0, yPercent: 0, rotation: restTilt(i), duration: 1, ease: 'power2.out' }, i - 1).to(
            boards[i - 1],
            { xPercent: -13, rotation: -2.4 * side, scale: 0.955, duration: 1, ease: 'power1.inOut' },
            i - 1,
          )
        })
      })
    },
    { scope: root },
  )

  return (
    <section className="bd" ref={root}>
      <Interlude />
      <div className="bd-horizontal">
        <div className="bd-track">
          {PROJECTS.map((project) => (
            <ProjectBoard key={project.name} project={project} />
          ))}
        </div>
        <p className="bd-counter" aria-hidden="true">
          <span className="bd-counter__mask">
            <span className="bd-counter__current">{padIndex(1)}</span>
          </span>
          {' / '}
          {padIndex(PROJECTS.length)}
        </p>
      </div>
    </section>
  )
}
