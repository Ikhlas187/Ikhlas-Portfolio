import { useEffect, useState, useSyncExternalStore } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'
import { CURSOR_LABELS, type CursorKind } from '@/data/cursor'
import { useLocale } from '@/lib/LocaleProvider'
import { cursorKindOf } from '@/logic/cursorKind/cursorKind'

const FINE_POINTER_QUERY = '(hover: hover) and (pointer: fine)'
const FOLLOW_SPRING = { stiffness: 420, damping: 38, mass: 0.6 }
const GROW_SPRING = { type: 'spring', duration: 0.3, bounce: 0.35 } as const

function subscribeToPointerQuery(onChange: () => void) {
  const query = window.matchMedia(FINE_POINTER_QUERY)
  query.addEventListener('change', onChange)
  return () => query.removeEventListener('change', onChange)
}

function isFinePointer() {
  return window.matchMedia(FINE_POINTER_QUERY).matches
}

// L'écran du Mac en plein écran (zone sans traînée) garde le curseur natif.
function cursorKindAt(element: Element | null): CursorKind | null {
  if (!element || element.closest('[data-mouse-trail="off"]')) return null
  return cursorKindOf(element.closest('[data-cursor]')?.getAttribute('data-cursor'))
}

/* Bulle crème qui remplace le curseur sur les zones marquées data-cursor (planches projet, MacBook fermé). */
export default function ContextCursor() {
  const { locale } = useLocale()
  const isEnabled = useSyncExternalStore(subscribeToPointerQuery, isFinePointer)
  const isReducedMotion = useReducedMotion() ?? false
  const [kind, setKind] = useState<CursorKind | null>(null)
  const [lastKind, setLastKind] = useState<CursorKind>('view')
  const x = useMotionValue(-200)
  const y = useMotionValue(-200)
  const followX = useSpring(x, FOLLOW_SPRING)
  const followY = useSpring(y, FOLLOW_SPRING)

  useEffect(() => {
    if (!isEnabled) return
    let pointer: { x: number; y: number } | null = null

    const update = (nextKind: CursorKind | null) => {
      setKind(nextKind)
      if (nextKind) setLastKind(nextKind)
    }

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return
      pointer = { x: event.clientX, y: event.clientY }
      x.set(pointer.x)
      y.set(pointer.y)
      update(cursorKindAt(event.target instanceof Element ? event.target : null))
    }

    // Au scroll, la zone sous la souris change sans que la souris bouge (planches épinglées, capot qui s'ouvre).
    const onScroll = () => {
      if (pointer) update(cursorKindAt(document.elementFromPoint(pointer.x, pointer.y)))
    }

    const onLeave = () => update(null)

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    document.documentElement.addEventListener('mouseleave', onLeave)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('scroll', onScroll)
      document.documentElement.removeEventListener('mouseleave', onLeave)
    }
  }, [isEnabled, x, y])

  if (!isEnabled) return null

  const isShown = kind !== null

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-9999 -mt-10 -ml-10 grid size-20 place-items-center rounded-full bg-white text-[13px] font-medium tracking-[0.02em] text-black"
      style={{ x: isReducedMotion ? x : followX, y: isReducedMotion ? y : followY }}
      initial={false}
      animate={{ scale: isShown ? 1 : 0, opacity: isShown ? 1 : 0 }}
      transition={isReducedMotion ? { duration: 0 } : { scale: GROW_SPRING, opacity: { duration: 0.15 } }}
    >
      {CURSOR_LABELS[locale][lastKind]}
    </motion.div>
  )
}
