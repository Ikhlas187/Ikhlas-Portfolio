import { Fragment, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { SERVICES, SERVICES_SECTION, type Service } from '@/data/services'
import { unsplashPhotoUrl } from '@/logic/unsplashPhotoUrl/unsplashPhotoUrl'
import '@/components/pages/Home/Services.css'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const PHOTO_WIDTH = 910
const INK_SCALE = 70
const INK_BLUR = 10

type ServicesProps = {
  title?: string
  label?: string
  scrollText?: string
  items?: Service[]
}

/* Section services (réf. kaiseisadatoki-v4) : les titres se condensent hors d'une tache d'encre (filtre SVG). */
export default function Services({
  title = SERVICES_SECTION.title,
  label = SERVICES_SECTION.label,
  scrollText = SERVICES_SECTION.scrollText,
  items = SERVICES,
}: ServicesProps) {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia(root)
      const el = (sel: string) => root.current!.querySelector<HTMLElement>(sel)
      const all = (sel: string) => root.current!.querySelectorAll<HTMLElement>(sel)

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const disp = el('#svInkDisp')
        const blur = el('#svInkBlur')
        const triggers: ScrollTrigger[] = []

        // Filtre partagé : si une résorption est en vol, la nouvelle cible s'y accroche au lieu de la relancer.
        let unwind: gsap.core.Tween | null = null
        let filtered: HTMLElement[] = []

        const inkReveal = (nodes: HTMLElement[]) => {
          if (!nodes.length) return

          nodes.forEach((node) => {
            node.style.filter = 'url(#svInkFilter)'
          })
          filtered.push(...nodes)

          gsap.to(nodes, { opacity: 1, duration: 0.2 })

          if (unwind && unwind.isActive()) return

          const state = { scale: INK_SCALE, blur: INK_BLUR }
          disp?.setAttribute('scale', String(INK_SCALE))
          blur?.setAttribute('stdDeviation', String(INK_BLUR))

          unwind = gsap.to(state, {
            scale: 0,
            blur: 0,
            duration: 1.8,
            ease: 'power3.out',
            onUpdate() {
              disp?.setAttribute('scale', String(state.scale))
              blur?.setAttribute('stdDeviation', String(state.blur))
            },
            onComplete() {
              filtered.forEach((node) => {
                node.style.filter = 'none'
              })
              filtered = []
            },
          })
        }

        const inks = gsap.utils.toArray<HTMLElement>(all('.ink-anim'))
        gsap.set(inks, { opacity: 0 })

        triggers.push(
          ScrollTrigger.create({
            trigger: root.current!,
            start: 'top 80%',
            once: true,
            onEnter: () => inkReveal(inks),
          }),
        )

        const rowInks: HTMLElement[] = []

        gsap.utils.toArray<HTMLElement>(all('.p-service-list__item')).forEach((row) => {
          const targets = gsap.utils.toArray<HTMLElement>(
            row.querySelectorAll('.p-service-list__item-num, .p-service-list__item-title'),
          )
          rowInks.push(...targets)
          gsap.set(targets, { opacity: 0 })

          triggers.push(
            ScrollTrigger.create({
              trigger: row,
              start: 'top 80%',
              once: true,
              onEnter: () => inkReveal(targets),
            }),
          )
        })

        gsap.utils.toArray<HTMLElement>(all('.p-service-list__rule')).forEach((rule) => {
          gsap.from(rule, {
            scaleX: 0,
            duration: 0.7,
            ease: 'power4.out',
            scrollTrigger: { trigger: rule, start: 'top 92%', once: true },
          })
        })

        const cue = el('.js-scroll-text')
        const cueClone = el('.js-scroll-text-clone')

        gsap.set(cue, { y: 0 })
        gsap.set(cueClone, { y: '-100%' })

        gsap
          .timeline()
          .to(cue, { y: '100%', duration: 2, repeat: -1, ease: 'power2.inOut' })
          .to(
            cueClone,
            {
              y: 0,
              duration: 2,
              repeat: -1,
              ease: 'power2.inOut',
              onComplete: () => {
                gsap.set(cue, { y: 0 })
                gsap.set(cueClone, { y: '-100%' })
              },
            },
            '<',
          )

        return () => {
          triggers.forEach((trigger) => trigger.kill())
          ;[...inks, ...rowInks].forEach((node) => {
            node.style.filter = ''
          })
        }
      })
    },
    { scope: root },
  )

  return (
    <div className="sv" ref={root}>
      <svg className="sv__ink-defs" aria-hidden="true">
        <defs>
          <filter id="svInkFilter" x="-25%" y="-50%" width="150%" height="200%">
            <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="4" seed="5" result="n" />
            <feDisplacementMap
              id="svInkDisp"
              in="SourceGraphic"
              in2="n"
              scale={INK_SCALE}
              xChannelSelector="R"
              yChannelSelector="G"
              result="d"
            />
            <feGaussianBlur id="svInkBlur" in="d" stdDeviation={INK_BLUR} />
          </filter>
        </defs>
      </svg>

      <div className="page-header">
        <div className="page-header__wrapper l-wrapper">
          <h2 className="text-6xl page-header__title ink-anim">{title}</h2>
          <p className="page-header__label text-lg ink-anim">{label}</p>

          <div className="page-header__scroll">
            <span className="text-sm page-header__scroll-text ink-anim js-scroll-text">{scrollText}</span>
            <span
              className="text-sm page-header__scroll-text ink-anim page-header__scroll-text--clone js-scroll-text-clone"
              aria-hidden="true"
            >
              {scrollText}
            </span>
          </div>

          <div className="page-header__border" />
        </div>
      </div>

      <section className="p-service-list">
        <div className="p-service-list__wrapper l-wrapper">
          {items.map((item, i) => (
            <Fragment key={item.title}>
              {/* La 1re rangée n'a pas de filet : celui de l'entête en tient lieu. */}
              {i > 0 && <div className="p-service-list__rule" aria-hidden="true" />}

              <article className="p-service-list__item">
                <div className="p-service-list__item-num text-3xl" aria-hidden="true">
                  {item.num}
                </div>
                <h3 className="p-service-list__item-title text-3xl">{item.title}</h3>

                <div className="p-service-list__item-content">
                  <div className="p-service-list__item-img">
                    <img src={unsplashPhotoUrl(item.photo, PHOTO_WIDTH)} alt={item.alt} loading="lazy" />
                  </div>
                  <p className="p-service-list__item-desc text-base">{item.desc}</p>
                </div>
              </article>
            </Fragment>
          ))}
        </div>
      </section>
    </div>
  )
}
