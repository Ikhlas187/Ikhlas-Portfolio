import { useEffect, useRef, useState, type RefObject } from 'react'
import { createPortal } from 'react-dom'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'
import { useLocale } from '@/lib/LocaleProvider'
import { HERO } from '@/data/hero'
import { gazeOffset, pupilRange, READING_PATH, REST_GAZE } from '@/logic/eyesCursor/gaze/gaze'

type EyesCursorProps = {
  scope: RefObject<HTMLElement | null>
  isActive: boolean
}

type Point = { x: number; y: number }

const RANGE = pupilRange(20, 26, 10, 2)
const PUPIL_SPRING = { stiffness: 320, damping: 24, mass: 0.6 }
const LOOK_TARGETS = 'img, video, canvas, svg, h1, h2, h3, h4, h5, h6, p, a, button, input, textarea'
const CLICKABLE = 'a[href], button, [role="button"], [role="link"], input, select, textarea, label, summary'
const NEAR_RADIUS = 360
const READ_DELAY = 600
const BLINK_MIN = 2600
const BLINK_SPREAD = 3400
const BLINK_CLOSED = 140

// Cible regardée : le plus petit élément sous le pointeur, sinon le plus proche à moins de 360 px.
function findLookTarget(point: Point, scope: HTMLElement) {
  const maxArea = window.innerWidth * window.innerHeight * 0.6
  const under: { box: DOMRect; area: number; isText: boolean }[] = []
  const near: { box: DOMRect; distance: number }[] = []
  scope.querySelectorAll(LOOK_TARGETS).forEach((element) => {
    const box = element.getBoundingClientRect()
    const area = box.width * box.height
    if (box.width < 4 || box.height < 4 || box.bottom < 0 || box.top > window.innerHeight || area > maxArea) return
    const dx = Math.max(box.left - point.x, 0, point.x - box.right)
    const dy = Math.max(box.top - point.y, 0, point.y - box.bottom)
    if (dx === 0 && dy === 0) under.push({ box, area, isText: /^(P|H[1-6])$/.test(element.tagName) })
    else if (Math.hypot(dx, dy) < NEAR_RADIUS) near.push({ box, distance: Math.hypot(dx, dy) })
  })
  const center = (box: DOMRect) => ({ x: box.left + box.width / 2, y: box.top + box.height / 2 })
  const smallest = under.sort((a, b) => a.area - b.area)[0]
  if (smallest) return { ...center(smallest.box), isText: smallest.isText }
  const closest = near.sort((a, b) => a.distance - b.distance)[0]
  return closest ? { ...center(closest.box), isText: false } : null
}

/* Curseur en yeux de dexharlan.framer.website, limité au hero : les pupilles suivent ce qui est visé, lisent un texte
   survolé, clignent, et une pastille annonce les éléments cliquables. Dessiné en DOM, sans image. */
export default function EyesCursor({ scope, isActive }: EyesCursorProps) {
  const { locale } = useLocale()
  const shouldReduceMotion = useReducedMotion()
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const pupilX = useSpring(REST_GAZE.x * RANGE.x, PUPIL_SPRING)
  const pupilY = useSpring(REST_GAZE.y * RANGE.y, PUPIL_SPRING)
  const [isBlinking, setIsBlinking] = useState(false)
  const [isOverClickable, setIsOverClickable] = useState(false)
  const pointer = useRef<Point | null>(null)

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      pointer.current = { x: event.clientX, y: event.clientY }
      x.set(event.clientX)
      y.set(event.clientY)
    }
    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    return () => window.removeEventListener('pointermove', handlePointerMove)
  }, [x, y])

  useEffect(() => {
    if (!isActive) return
    let frame = 0
    let readTimer = 0
    const read = (index: number) => {
      const step = READING_PATH[index % READING_PATH.length]
      pupilX.set(step.x * RANGE.x)
      pupilY.set(step.y * RANGE.y)
      readTimer = window.setTimeout(() => read(index + 1), step.duration)
    }
    const update = () => {
      frame = 0
      window.clearTimeout(readTimer)
      const point = pointer.current
      if (!point || !scope.current) return
      const hit = document.elementFromPoint(point.x, point.y)
      setIsOverClickable(!!hit?.closest(CLICKABLE))
      if (shouldReduceMotion) return
      const target = findLookTarget(point, scope.current)
      if (target?.isText) readTimer = window.setTimeout(() => read(0), READ_DELAY)
      const offset = gazeOffset(point, target, RANGE)
      pupilX.set(offset.x)
      pupilY.set(offset.y)
    }
    const schedule = () => {
      frame ||= requestAnimationFrame(update)
    }
    schedule()
    window.addEventListener('pointermove', schedule, { passive: true })
    window.addEventListener('scroll', schedule, { passive: true, capture: true })
    return () => {
      cancelAnimationFrame(frame)
      window.clearTimeout(readTimer)
      window.removeEventListener('pointermove', schedule)
      window.removeEventListener('scroll', schedule, { capture: true })
    }
  }, [isActive, scope, shouldReduceMotion, pupilX, pupilY])

  useEffect(() => {
    if (!isActive || shouldReduceMotion) return
    let closeTimer = 0
    let openTimer = 0
    const schedule = () => {
      closeTimer = window.setTimeout(() => {
        setIsBlinking(true)
        openTimer = window.setTimeout(() => {
          setIsBlinking(false)
          schedule()
        }, BLINK_CLOSED)
      }, BLINK_MIN + Math.random() * BLINK_SPREAD)
    }
    schedule()
    return () => {
      window.clearTimeout(closeTimer)
      window.clearTimeout(openTimer)
    }
  }, [isActive, shouldReduceMotion])

  // Portail : le calque du titre est transformé et découpé, un enfant fixed y serait décalé et rogné.
  return createPortal(
    isActive ? (
      <motion.div aria-hidden="true" style={{ x, y }} className="pointer-events-none fixed top-0 left-0 z-[100] select-none">
        <div className="relative flex -translate-x-1/2 -translate-y-1/2 items-center">
          {[0, 1].map((eye) => (
            <motion.div
              key={eye}
              animate={{ scaleY: isBlinking ? 0.12 : 1 }}
              transition={{ duration: 0.07 }}
              className="flex h-[26px] w-5 shrink-0 items-center justify-center rounded-full border-2 border-black bg-white not-first:ml-px"
            >
              <motion.div style={{ x: pupilX, y: pupilY }} className="relative size-2.5 rounded-full bg-black">
                <div className="absolute top-[16%] left-[18%] size-[3.2px] rounded-full bg-white" />
              </motion.div>
            </motion.div>
          ))}
          <motion.div
            initial={false}
            style={{ y: '-50%', originX: 0 }}
            animate={isOverClickable ? { opacity: 1, scale: 1, x: 0 } : { opacity: 0, scale: 0.5, x: -8 }}
            transition={isOverClickable ? { type: 'spring', stiffness: 520, damping: 26 } : { duration: 0.12 }}
            className="absolute top-1/2 left-full ml-1.5 rounded-full border-[1.5px] border-white bg-black px-2.5 py-[5px] label-sm leading-none whitespace-nowrap text-white"
          >
            {HERO[locale].cursorClickLabel}
          </motion.div>
        </div>
      </motion.div>
    ) : null,
    document.body,
  )
}
