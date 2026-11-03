import { useEffect, useLayoutEffect, useRef, type RefObject } from 'react'
import { dockTargetRect } from '@/components/pages/Home/MacOS/dockTarget'
import { genieOpacity, genieStripCount, genieStrips } from '@/logic/macos/genie/genie'
import type { Rect } from '@/logic/macos/windowBounds/windowBounds'

export type GenieDirection = 'minimize' | 'restore'

type GenieRun = { layer: HTMLDivElement; strips: HTMLDivElement[]; window: Rect; icon: Rect; progress: number; frame: number }

const DURATION_MS = 520

// La fenêtre est copiée en bandes horizontales empilées : chaque bande est translatée et étirée seule, ce qui tord la forme.
function buildLayer(source: HTMLElement, root: HTMLElement, window: Rect, icon: Rect): GenieRun {
  const layer = document.createElement('div')
  layer.setAttribute('aria-hidden', 'true')
  layer.inert = true
  layer.className = 'pointer-events-none absolute inset-0 z-20'
  const count = genieStripCount(window.height)
  const stripHeight = window.height / count
  const scrolled = Array.from(source.querySelectorAll<HTMLElement>('*'))
    .map((element, index) => ({ index, top: element.scrollTop, left: element.scrollLeft }))
    .filter((entry) => entry.top > 0 || entry.left > 0)

  const strips = Array.from({ length: count }, (_, index) => {
    const strip = document.createElement('div')
    strip.style.cssText = `position:absolute;left:0;top:0;width:${window.width}px;height:${stripHeight + 1}px;overflow:hidden;transform-origin:0 0;will-change:transform`
    const clone = source.cloneNode(true) as HTMLElement
    clone.style.transform = 'none'
    clone.style.left = '0'
    clone.style.top = `${-index * stripHeight}px`
    clone.style.width = `${window.width}px`
    clone.style.height = `${window.height}px`
    clone.style.opacity = '1'
    clone.style.visibility = 'visible'
    clone.removeAttribute('aria-label')
    // Une iframe copiée rechargerait la page dans chaque bande : on la remplace par un aplat.
    clone.querySelectorAll('iframe').forEach((frame) => {
      const placeholder = document.createElement('div')
      placeholder.className = frame.className
      placeholder.style.background = 'var(--macos-finder-window)'
      frame.replaceWith(placeholder)
    })
    strip.append(clone)
    layer.append(strip)
    return strip
  })
  root.append(layer)

  // cloneNode ne copie pas la position de défilement : sans ça, une liste défilée repartirait du haut.
  strips.forEach((strip) => {
    const elements = strip.firstElementChild?.querySelectorAll<HTMLElement>('*')
    scrolled.forEach(({ index, top, left }) => {
      const element = elements?.[index]
      if (element) element.scrollTo(left, top)
    })
  })

  return { layer, strips, window, icon, progress: 0, frame: 0 }
}

function paint(run: GenieRun) {
  const shapes = genieStrips(run.window, run.icon, run.progress, run.strips.length)
  run.strips.forEach((strip, index) => {
    const { x, y, scaleX, scaleY } = shapes[index]
    strip.style.transform = `translate(${x}px, ${y}px) scale(${scaleX}, ${scaleY})`
  })
  run.layer.style.opacity = String(genieOpacity(run.progress))
}

// Effet « génie » de macOS : la fenêtre s'aspire dans son icône du Dock (minimize) ou en ressort (restore).
export function useGenie(
  sourceRef: RefObject<HTMLElement | null>,
  direction: GenieDirection | null,
  window: Rect,
  app: string,
  onDone: () => void,
) {
  const runRef = useRef<GenieRun | null>(null)
  const onDoneRef = useRef(onDone)
  const windowRef = useRef(window)

  useLayoutEffect(() => {
    onDoneRef.current = onDone
    windowRef.current = window
  })

  useLayoutEffect(() => {
    if (!direction) return
    const source = sourceRef.current
    const root = source?.closest<HTMLElement>('[data-macos-root]')
    const icon = root ? dockTargetRect(root, app) : null
    if (!source || !root || !icon) {
      onDoneRef.current()
      return
    }
    // Un changement de sens en cours de route repart de la progression atteinte, avec les mêmes bandes.
    const run =
      runRef.current ??
      Object.assign(buildLayer(source, root, windowRef.current, icon), { progress: direction === 'minimize' ? 0 : 1 })
    runRef.current = run
    const target = direction === 'minimize' ? 1 : 0
    let last = performance.now()
    paint(run)

    const tick = (now: number) => {
      const step = (now - last) / DURATION_MS
      last = now
      run.progress = target > run.progress ? Math.min(target, run.progress + step) : Math.max(target, run.progress - step)
      paint(run)
      if (run.progress === target) {
        run.layer.remove()
        runRef.current = null
        onDoneRef.current()
        return
      }
      run.frame = requestAnimationFrame(tick)
    }
    run.frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(run.frame)
  }, [direction, sourceRef, app])

  useEffect(
    () => () => {
      runRef.current?.layer.remove()
      runRef.current = null
    },
    [],
  )
}
