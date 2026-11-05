import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Power } from 'lucide-react'
import WorksScreen from '@/components/pages/Home/WorksScreen'
import MacOS from '@/components/pages/Home/MacOS/MacOS'
import { Button } from '@/components/ui/button'
import { MACBOOK } from '@/data/macbook'
import { useLocale } from '@/lib/LocaleProvider'
import { canScrollBy } from '@/logic/scrollCapture/scrollCapture'
import { fadeOutBetween } from '@/logic/scrollFade/scrollFade'

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

// Part de la traversée où l'écran « Selected works » finit de se loger dans le Mac, puis s'efface.
const DOCK_END = 0.7
const FADE_START = 0.74
const FADE_END = 0.92
// Largeur de départ de l'écran « Selected works », en part de la fenêtre.
const START_WIDTH_RATIO = 0.94

/* Section macOS (réf. maquette Framer IFRI-Comotorage) : l'écran « Selected works » rétrécit au scroll et se loge
   dans l'écran du Mac, qui monte depuis le bas ; le bureau 1512 × 982 apparaît quand il s'efface. */
export default function MacOSSection() {
  const { locale } = useLocale()
  const text = MACBOOK[locale]
  const [scale, setScale] = useState(1)
  const [startScale, setStartScale] = useState(1.2)
  const [isPoweredOn, setIsPoweredOn] = useState(true)
  const frameRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] })
  const macY = useTransform(scrollYProgress, [0, DOCK_END], ['70svh', '0svh'])
  const worksY = useTransform(scrollYProgress, [0, DOCK_END], ['-70svh', '0svh'])
  const worksScale = useTransform(scrollYProgress, [0, DOCK_END], [startScale, 1])
  // Fonction plutôt que plages : framer-motion confierait le fondu au navigateur (ScrollTimeline), qui calcule mal la plage ici.
  const worksOpacity = useTransform(scrollYProgress, (progress) => fadeOutBetween(progress, FADE_START, FADE_END))

  useEffect(() => {
    const frame = frameRef.current
    if (!frame) return
    const observer = new ResizeObserver(([entry]) => {
      setScale(entry.contentRect.width / SCREEN_WIDTH_PX)
      setStartScale(Math.max(1, (window.innerWidth * START_WIDTH_RATIO) / entry.contentRect.width))
    })
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
    <section ref={sectionRef} aria-label={text.sectionLabel} className="relative h-[260svh] bg-white">
      <div className="sticky top-0 flex h-svh items-center overflow-hidden px-[5%] py-[max(48px,5.5vw)]">
        {/* Cadre noir de l'écran, limité en largeur pour que l'écran entier tienne dans la fenêtre. */}
        <motion.div
          style={{ y: macY }}
          className="relative mx-auto w-full max-w-[min(1620px,calc((100svh-160px)*1.54))] rounded-[clamp(14px,2.2%,28px)] bg-black p-[1.45%] pb-[1.15%] shadow-(--macos-screen-shadow)"
        >
          <div className="relative">
          <div
            ref={attachWheelCapture}
            data-mouse-trail="off"
            className="relative aspect-[1512/982] w-full overflow-hidden rounded-t-[clamp(8px,1.2%,16px)] rounded-b-[3px] bg-black select-none"
          >
            <div
              className="absolute top-0 left-0 origin-top-left"
              style={{ width: SCREEN_WIDTH_PX, height: SCREEN_HEIGHT_PX, transform: `scale(${scale})` }}
            >
              <MacOS isPoweredOn={isPoweredOn} onShutdown={() => setIsPoweredOn(false)} />
              {/* Encoche de la caméra (MacBook Pro 14 : ~186 × 32 pt sur 1512), coins du haut incurvés vers le cadre. */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute top-0 left-1/2 z-[60] flex h-[32px] w-[186px] -translate-x-1/2 items-center justify-center rounded-b-[12px] bg-black before:absolute before:top-0 before:-left-[10px] before:size-[10px] before:bg-[radial-gradient(circle_at_0_100%,transparent_10px,var(--color-black)_10.5px)] after:absolute after:top-0 after:-right-[10px] after:size-[10px] after:bg-[radial-gradient(circle_at_100%_100%,transparent_10px,var(--color-black)_10.5px)]"
              >
                <span className="size-[7px] rounded-full bg-(--color-gray-300) ring-1 ring-(--color-gray-200)" />
              </div>
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
          {/* 1er écran posé sur la dalle du Mac : grand au départ, il se réduit jusqu'à la recouvrir exactement. */}
          <motion.div
            aria-hidden="true"
            style={{ y: worksY, scale: worksScale, opacity: worksOpacity }}
            className="pointer-events-none absolute inset-0"
          >
            <WorksScreen />
          </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
