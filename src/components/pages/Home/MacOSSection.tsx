import { useCallback, useEffect, useRef, useState } from 'react'
import { Power } from 'lucide-react'
import MacOS from '@/components/pages/Home/MacOS/MacOS'
import { Button } from '@/components/ui/button'
import { MACBOOK } from '@/data/macbook'
import { useLocale } from '@/lib/LocaleProvider'
import { canScrollBy } from '@/logic/scrollCapture/scrollCapture'

// Taille logique du bureau macOS, réduite à la largeur de la section.
const SCREEN_WIDTH_PX = 1512
const SCREEN_HEIGHT_PX = 982

function canAncestorScroll(target: EventTarget | null, boundary: HTMLElement, event: WheelEvent) {
  for (let node = target instanceof Element ? target : null; node && node !== boundary; node = node.parentElement) {
    const style = getComputedStyle(node)
    const isScrollableY =
      /(auto|scroll)/.test(style.overflowY) &&
      canScrollBy({ offset: node.scrollTop, contentSize: node.scrollHeight, viewportSize: node.clientHeight }, event.deltaY)
    const isScrollableX =
      /(auto|scroll)/.test(style.overflowX) &&
      canScrollBy({ offset: node.scrollLeft, contentSize: node.scrollWidth, viewportSize: node.clientWidth }, event.deltaX)
    if (isScrollableY || isScrollableX) return true
  }
  return false
}

/* Le faux macOS en section normale (mise en scène du projet Awwwards « Personal Portfolio - MacBook ») :
   écran à cadre noir sur le fond crème du site, bureau 1512 × 982 mis à la largeur. */
export default function MacOSSection() {
  const { locale } = useLocale()
  const text = MACBOOK[locale]
  const [scale, setScale] = useState(1)
  const [isPoweredOn, setIsPoweredOn] = useState(true)
  const frameRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const frame = frameRef.current
    if (!frame) return
    const observer = new ResizeObserver(([entry]) => setScale(entry.contentRect.width / SCREEN_WIDTH_PX))
    observer.observe(frame)
    return () => observer.disconnect()
  }, [])

  // Une fenêtre qui peut encore défiler garde la molette ; sinon la page défile.
  const attachWheelCapture = useCallback((frame: HTMLDivElement | null) => {
    frameRef.current = frame
    if (!frame) return
    const handleWheel = (event: WheelEvent) => {
      if (canAncestorScroll(event.target, frame, event)) event.stopPropagation()
    }
    frame.addEventListener('wheel', handleWheel, { passive: false })
    return () => frame.removeEventListener('wheel', handleWheel)
  }, [])

  return (
    <section aria-label={text.sectionLabel} className="bg-white pt-(--section-gap)">
      <div className="relative overflow-hidden flex min-h-svh items-center px-[5%] py-[max(48px,5.5vw)]">
        {/* Cadre noir de l'écran comme la réf., limité en largeur pour que l'écran entier tienne dans la fenêtre. */}
        <div className="relative mx-auto w-full max-w-[min(1620px,calc((100svh-160px)*1.54))] rounded-[10px] bg-black p-[1.45%] pb-[1.15%] shadow-(--macos-screen-shadow)">
      <div
        ref={attachWheelCapture}
        data-mouse-trail="off"
        className="relative aspect-[1512/982] w-full overflow-hidden rounded-[3px] bg-black select-none"
      >
        <div
          className="absolute top-0 left-0 origin-top-left"
          style={{ width: SCREEN_WIDTH_PX, height: SCREEN_HEIGHT_PX, transform: `scale(${scale})` }}
        >
          <MacOS isPoweredOn={isPoweredOn} onShutdown={() => setIsPoweredOn(false)} />
        </div>
        {!isPoweredOn && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Button
              onClick={() => setIsPoweredOn(true)}
              className="h-10 gap-2 rounded-full bg-white px-5 text-black hover:bg-white/90"
            >
              <Power className="size-4" aria-hidden="true" />
              {text.powerOn}
            </Button>
          </div>
        )}
      </div>
        </div>
      </div>
    </section>
  )
}
