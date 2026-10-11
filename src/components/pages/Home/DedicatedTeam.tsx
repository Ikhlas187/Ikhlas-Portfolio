import { useRef, useEffect, useState, type CSSProperties } from 'react'
import gsap from 'gsap'
import Draggable from 'gsap/Draggable'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { TECH } from '@/components/pages/Home/techIcons'
import { ROLES, SKILLS_SECTION, type Role } from '@/data/roles'
import '@/components/pages/Home/DedicatedTeam.css'

gsap.registerPlugin(Draggable, ScrollTrigger)

const N = ROLES.length
const STEP_ANGLE = 360 / N
const TOP_ANGLE = 270 // sommet de l'ellipse (sin = -1)
const LIGHT_MS = 650 // durée d'allumage par logo
const HOLD_MS = 600 // pause après le dernier logo
const ROTATE_S = 7.5 // durée de rotation par cran
const START_DELAY = 1300 // laisse jouer l'entrée avant de démarrer
const REPEL_RADIUS = 150
const REPEL_PUSH = 34
const FALLBACK_TECH_COLOR = '#B8BEC8'

type TeamControls = {
  manualOpen: (index: number) => void
  close: () => void
  pause: () => void
  resume: () => void
}

/* Roue elliptique des rôles d'Ikhlas (réf. verteal.com) : la pastille du sommet affiche sa stack, puis la roue tourne d'un cran. */
export default function DedicatedTeam() {
  const root = useRef<HTMLElement>(null)
  const controls = useRef<TeamControls | null>(null)
  const [openRole, setOpenRole] = useState<Role | null>(null)
  const [anchor, setAnchor] = useState({ x: 0, y: 0 })
  const [activeIdx, setActiveIdx] = useState(0)
  const [isManual, setIsManual] = useState(false)

  const closeCard = () => controls.current?.close()

  useEffect(() => {
    if (!isManual) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && closeCard()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isManual])

  useEffect(() => {
    const stage = root.current!.querySelector<HTMLElement>('.vt-team__stage')!
    const slots = gsap.utils.toArray<HTMLElement>('.vt-slot', root.current)

    let rx = 0
    let ry = 0
    const measure = () => {
      const rect = stage.getBoundingClientRect()
      rx = Math.min(rect.width * 0.4, 470)
      ry = Math.min(rect.height * 0.27, 205)
    }
    const place = (deg: number) => {
      for (let i = 0; i < N; i++) {
        const a = ((deg + STEP_ANGLE * i) * Math.PI) / 180
        gsap.set(slots[i], { x: Math.cos(a) * rx, y: Math.sin(a) * ry })
      }
    }

    measure()
    const drift = { a: TOP_ANGLE }
    place(drift.a)
    window.addEventListener('resize', measure)

    let isAutoRunning = true
    let topIdx = 0
    let timers: ReturnType<typeof setTimeout>[] = []
    let rotTween: gsap.core.Tween | null = null
    const clearTimers = () => {
      timers.forEach(clearTimeout)
      timers = []
    }

    // Ancre le tooltip au-dessus de la pastille et allume ses logos 1 par 1. Rend la durée totale.
    const showStack = (index: number) => {
      const pill = slots[index].querySelector('.vt-pill')!
      const rect = pill.getBoundingClientRect()
      setAnchor({ x: rect.left + rect.width / 2, y: rect.top })
      setActiveIdx(0)
      setOpenRole(ROLES[index])
      const count = ROLES[index].stack.length
      for (let k = 0; k < count; k++) {
        timers.push(setTimeout(() => setActiveIdx(k), k * LIGHT_MS))
      }
      return count * LIGHT_MS + HOLD_MS
    }

    const runAuto = () => {
      if (!isAutoRunning) return
      const duration = showStack(topIdx)
      timers.push(
        setTimeout(() => {
          setOpenRole(null)
          topIdx = (topIdx - 1 + N) % N
          rotTween = gsap.to(drift, {
            a: drift.a + STEP_ANGLE,
            duration: ROTATE_S,
            ease: 'power2.inOut',
            onUpdate: () => place(drift.a),
            onComplete: runAuto,
          })
        }, duration),
      )
    }

    controls.current = {
      manualOpen(index: number) {
        isAutoRunning = false
        clearTimers()
        rotTween?.kill()
        setIsManual(true)
        showStack(index)
      },
      close() {
        clearTimers()
        setIsManual(false)
        setOpenRole(null)
        if (!isAutoRunning) {
          isAutoRunning = true
          runAuto()
        }
      },
      pause() {
        isAutoRunning = false
        clearTimers()
        rotTween?.kill()
      },
      resume() {
        if (!isAutoRunning) {
          isAutoRunning = true
          runAuto()
        }
      },
    }

    const ctx = gsap.context(() => {
      gsap.from('.vt-enter', {
        opacity: 0,
        scale: 0.5,
        y: -120,
        duration: 1.1,
        ease: 'elastic.out(1, 0.6)',
        stagger: { each: 0.08, from: 'random' },
        scrollTrigger: { trigger: stage, start: 'top 70%', once: true },
      })

      ScrollTrigger.create({
        trigger: stage,
        start: 'top 70%',
        once: true,
        onEnter: () => {
          timers.push(setTimeout(runAuto, START_DELAY))
        },
      })

      gsap.utils.toArray<HTMLElement>('.vt-float').forEach((el, i) => {
        gsap.to(el, {
          y: gsap.utils.random(-8, -14),
          duration: gsap.utils.random(2.2, 3.4),
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          delay: i * 0.15,
        })
      })

      // Les pastilles s'écartent du curseur qui approche, puis reviennent sur leur orbite.
      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const enters = gsap.utils.toArray<HTMLElement>('.vt-enter')
        const qx = enters.map((el) => gsap.quickTo(el, 'x', { duration: 0.45, ease: 'power3' }))
        const qy = enters.map((el) => gsap.quickTo(el, 'y', { duration: 0.45, ease: 'power3' }))

        const repel = (e: MouseEvent) => {
          enters.forEach((el, i) => {
            const rect = el.getBoundingClientRect()
            const dx = rect.left + rect.width / 2 - e.clientX
            const dy = rect.top + rect.height / 2 - e.clientY
            const distance = Math.hypot(dx, dy)
            if (distance < REPEL_RADIUS && distance > 0.001) {
              const force = (1 - distance / REPEL_RADIUS) * REPEL_PUSH
              qx[i]((dx / distance) * force)
              qy[i]((dy / distance) * force)
            } else {
              qx[i](0)
              qy[i](0)
            }
          })
        }
        const settle = () =>
          enters.forEach((_, i) => {
            qx[i](0)
            qy[i](0)
          })

        stage.addEventListener('mousemove', repel)
        stage.addEventListener('mouseleave', settle)
        return () => {
          stage.removeEventListener('mousemove', repel)
          stage.removeEventListener('mouseleave', settle)
        }
      }

      Draggable.create('.vt-drag', {
        type: 'x,y',
        onPress() {
          controls.current?.pause()
          setIsManual(false)
          setOpenRole(null)
          gsap.set((this.target as HTMLElement).closest('.vt-slot'), { zIndex: 30 })
          gsap.to(this.target, { scale: 1.08, duration: 0.2 })
        },
        onClick() {
          const idx = slots.indexOf((this.target as HTMLElement).closest<HTMLElement>('.vt-slot')!)
          if (idx >= 0) controls.current?.manualOpen(idx)
        },
        onRelease() {
          gsap.to(this.target, { scale: 1, duration: 0.3, ease: 'back.out(2)' })
        },
        onDragEnd() {
          const slot = (this.target as HTMLElement).closest<HTMLElement>('.vt-slot')!
          gsap.to(this.target, {
            x: 0,
            y: 0,
            duration: 1,
            ease: 'power3.inOut',
            onComplete: () => {
              slot.style.zIndex = ''
            },
          })
          controls.current?.resume()
        },
      })
    }, root)

    return () => {
      clearTimers()
      rotTween?.kill()
      window.removeEventListener('resize', measure)
      ctx.revert()
    }
  }, [])

  return (
    <section className="vt-team" ref={root}>
      <div className="vt-team__stage">
        <h2 className="vt-team__title">{SKILLS_SECTION.title}</h2>

        <div className="vt-orbit">
          {ROLES.map((role) => (
            <div key={role.name} className="vt-slot">
              <div className="vt-drag" data-role={role.name}>
                <div className="vt-enter">
                  <div className="vt-float">
                    <span className="vt-pill" style={{ backgroundColor: role.color, rotate: `${role.rot}deg` }}>
                      {role.name}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {openRole && (
        <>
          {isManual && <div className="vt-cardback" onClick={closeCard} />}
          <div
            className="vt-tip"
            style={{ left: anchor.x, top: anchor.y, '--accent': openRole.color } as CSSProperties}
          >
            <div className="vt-card__stack">
              {openRole.stack.map((techName, idx) => {
                const tech = TECH[techName]
                const Icon = tech?.Icon
                return (
                  <div
                    className={`vt-tech${idx === activeIdx ? ' is-active' : ''}`}
                    key={techName}
                    style={{ '--tc': tech?.color || FALLBACK_TECH_COLOR } as CSSProperties}
                  >
                    {Icon && <Icon className="vt-tech__ico" />}
                    <span className="vt-tech__tip">{techName}</span>
                  </div>
                )
              })}
            </div>
            <span className="vt-tip__caret" />
          </div>
        </>
      )}
    </section>
  )
}
