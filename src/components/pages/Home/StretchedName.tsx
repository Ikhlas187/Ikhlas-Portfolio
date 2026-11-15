import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'
import { easeOutQuint } from '@/logic/easing/easing'
import { fontBaseline } from '@/logic/nameStretch/fontBaseline/fontBaseline'
import { landingKick } from '@/logic/nameStretch/landingKick/landingKick'
import { letterTransforms } from '@/logic/nameStretch/letterTransforms/letterTransforms'
import { pointerTargets } from '@/logic/nameStretch/pointerTargets/pointerTargets'
import { stepSprings, type Spring } from '@/logic/nameStretch/springStep/springStep'

type StretchedNameProps = {
  text: string
  isVisible: boolean
}

const STRENGTH = 0.6
// Portée de la réf. (1,4 pour 10 lettres) ramenée aux 13 caractères du nom, pour garder la même portée en px.
const SPREAD = 1.82
const SQUASH = 0.35
const SPRING = { stiffness: 260, damping: 30 - 22 * 0.6 }
const MAX_STEP = 1 / 30
const INTRO_DELAY = 350
const RISE_DURATION = 1200
const RISE_KICK = 2.2 * STRENGTH
const TOUCH_RELEASE = 450
// Ratio largeur / taille de « DEX HARLAN » sur la réf. : le nom, plus long, est étiré en hauteur pour garder la hauteur de la réf.
const REF_RATIO = 4.1045

/* Nom géant de dexharlan.framer.website, dans la police du site : remplit la largeur, à la hauteur de la réf. ; au survol, la lettre sous
   le pointeur s'élargit et s'écrase pendant que les autres s'affinent et grandissent, en ressort. */
export default function StretchedName({ text, isVisible }: StretchedNameProps) {
  const shouldReduceMotion = useReducedMotion()
  const chars = useMemo(() => Array.from(text.toUpperCase()), [text])
  const root = useRef<HTMLHeadingElement>(null)
  const rise = useRef<HTMLSpanElement>(null)
  const row = useRef<HTMLSpanElement>(null)
  const measureRow = useRef<HTMLSpanElement>(null)
  const letters = useRef<(HTMLSpanElement | null)[]>([])
  const widths = useRef<number[]>([])
  const springs = useRef<Spring[]>([])
  const frame = useRef(0)
  const lastTime = useRef(0)
  const stretchY = useRef(1)

  const fontSize = () => (row.current && parseFloat(getComputedStyle(row.current).fontSize)) || 0

  const render = () => {
    if (!widths.current.length || widths.current.length !== springs.current.length) return
    const size = fontSize()
    const values = springs.current.map((spring) => spring.value)
    letterTransforms(widths.current, values, SQUASH).forEach(({ offset, scaleX, scaleY }, index) => {
      const letter = letters.current[index]
      if (letter) letter.style.transform = `translate3d(${(offset * size).toFixed(2)}px,0,0) scale(${scaleX.toFixed(4)},${(scaleY * stretchY.current).toFixed(4)})`
    })
  }

  const tick = (now: number) => {
    const dt = Math.min(MAX_STEP, (now - (lastTime.current || now)) / 1000)
    lastTime.current = now
    const step = stepSprings(springs.current, dt, SPRING)
    springs.current = step.springs
    render()
    frame.current = step.isMoving ? requestAnimationFrame(tick) : 0
  }

  const startLoop = () => {
    if (frame.current) return
    lastTime.current = 0
    frame.current = requestAnimationFrame(tick)
  }

  const setPointer = (clientX: number | null) => {
    const heading = root.current
    const size = fontSize()
    if (!heading || !widths.current.length || !size) return
    const box = heading.getBoundingClientRect()
    const zoom = heading.offsetWidth ? box.width / heading.offsetWidth : 1
    const pointer = clientX === null ? null : (clientX - box.left) / zoom / size
    const targets = pointerTargets(widths.current, chars, pointer, { spread: SPREAD, strength: STRENGTH })
    springs.current = springs.current.map((spring, index) => ({ ...spring, target: targets[index] }))
    startLoop()
  }

  const kick = (amount: number) => {
    const pushes = landingKick(chars, amount)
    springs.current = springs.current.map((spring, index) => ({ ...spring, velocity: spring.velocity + pushes[index] }))
    startLoop()
  }

  // Largeur de chaque lettre en em et position de la ligne de base, mesurées sur la copie à 100 px.
  useLayoutEffect(() => {
    const measure = () => {
      const heading = root.current
      const copy = measureRow.current
      if (!heading || !copy) return
      const zoom = heading.offsetWidth ? heading.getBoundingClientRect().width / heading.offsetWidth : 1
      const measured = Array.from(copy.children).map((letter) => letter.getBoundingClientRect().width / zoom / 100)
      if (!measured.length || measured.some((width) => !(width > 0))) return
      widths.current = measured
      const ratio = measured.reduce((sum, width) => sum + width, 0)
      stretchY.current = ratio / REF_RATIO
      heading.style.setProperty('--name-ratio', String(ratio))
      heading.style.setProperty('--name-stretch', stretchY.current.toFixed(4))
      const metrics = document.createElement('canvas').getContext('2d')
      if (metrics) {
        metrics.font = `600 100px ${getComputedStyle(heading).fontFamily}`
        const { fontBoundingBoxAscent: ascent, fontBoundingBoxDescent: descent } = metrics.measureText('H')
        if (ascent && descent) heading.style.setProperty('--name-base', fontBaseline(ascent, descent, 100).toFixed(4))
      }
      render()
    }
    springs.current = chars.map(() => ({ value: 0, velocity: 0, target: 0 }))
    measure()
    void document.fonts.ready.then(measure)
    document.fonts.addEventListener('loadingdone', measure)
    return () => document.fonts.removeEventListener('loadingdone', measure)
  }, [chars])

  // Montée depuis sous le clip-path du h1, puis rebond ; remise en bas quand le hero se cache.
  useLayoutEffect(() => {
    const layer = rise.current
    if (!layer) return
    if (shouldReduceMotion) {
      layer.style.transform = ''
      return
    }
    if (!isVisible) {
      layer.style.transform = 'translate3d(0,100%,0)'
      cancelAnimationFrame(frame.current)
      frame.current = 0
      springs.current = chars.map(() => ({ value: 0, velocity: 0, target: 0 }))
      render()
      return
    }
    let riseFrame = 0
    const start = performance.now() + INTRO_DELAY
    const step = (now: number) => {
      const progress = Math.min(1, Math.max(0, (now - start) / RISE_DURATION))
      layer.style.transform = `translate3d(0,${((1 - easeOutQuint(progress)) * 100).toFixed(3)}%,0)`
      if (progress < 1) riseFrame = requestAnimationFrame(step)
      else {
        layer.style.transform = ''
        kick(RISE_KICK)
      }
    }
    riseFrame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(riseFrame)
  }, [isVisible, shouldReduceMotion, chars])

  useEffect(() => {
    const heading = root.current
    if (!heading || shouldReduceMotion) return
    let touchTimer = 0
    const handlePointerMove = (event: PointerEvent) => setPointer(event.clientX)
    const handlePointerLeave = () => setPointer(null)
    // Au doigt : déformation à l'endroit touché, puis retour à plat.
    const handlePointerDown = (event: PointerEvent) => {
      if (event.pointerType === 'mouse') return
      setPointer(event.clientX)
      window.clearTimeout(touchTimer)
      touchTimer = window.setTimeout(() => setPointer(null), TOUCH_RELEASE)
    }
    heading.addEventListener('pointermove', handlePointerMove)
    heading.addEventListener('pointerleave', handlePointerLeave)
    heading.addEventListener('pointerdown', handlePointerDown)
    return () => {
      window.clearTimeout(touchTimer)
      cancelAnimationFrame(frame.current)
      frame.current = 0
      heading.removeEventListener('pointermove', handlePointerMove)
      heading.removeEventListener('pointerleave', handlePointerLeave)
      heading.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [shouldReduceMotion, chars])

  const trackingFor = (index: number) => (index === chars.length - 1 ? 'tracking-normal' : 'tracking-[-0.03em]')

  return (
    <h1
      ref={root}
      aria-label={text}
      className="relative m-0 h-[calc(100cqw/4.1045)] w-full touch-pan-y p-0 font-sans font-extrabold select-none [clip-path:inset(-40%_-6%_0_-6%)] [cursor:inherit] [--name-base:0.864] [--name-ratio:5.3] [--name-stretch:1.29]"
    >
      <span ref={rise} aria-hidden="true" className="absolute inset-0 block">
        {/* Ligne de base calée à 92,5 % de la boîte, comme celle de la réf. */}
        <span
          ref={row}
          className="pointer-events-none absolute top-[calc(100cqw/4.1045*0.925_-_100cqw/var(--name-ratio)*var(--name-base))] left-0 flex w-full text-[length:calc(100cqw/var(--name-ratio))] leading-none whitespace-pre"
        >
          {chars.map((char, index) => (
            <span key={index} className="block h-[1em] flex-none">
              <span
                ref={(letter) => {
                  letters.current[index] = letter
                }}
                className={`block origin-[0_calc(var(--name-base)*100%)] [transform:scale(1,var(--name-stretch))] ${trackingFor(index)}`}
              >
                {char}
              </span>
            </span>
          ))}
        </span>
      </span>
      <span aria-hidden="true" className="pointer-events-none invisible absolute top-0 left-0 size-0 overflow-hidden">
        <span ref={measureRow} className="block w-max text-[100px] leading-none whitespace-pre">
          {chars.map((char, index) => (
            <span key={index} className={`inline-block ${trackingFor(index)}`}>
              {char}
            </span>
          ))}
        </span>
      </span>
    </h1>
  )
}
