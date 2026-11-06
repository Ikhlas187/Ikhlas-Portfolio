import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion'
import { Power } from 'lucide-react'
import WorksScreen from '@/components/pages/Home/WorksScreen'
import MacOS from '@/components/pages/Home/MacOS/MacOS'
import { Button } from '@/components/ui/button'
import { MACBOOK } from '@/data/macbook'
import { useLocale } from '@/lib/LocaleProvider'
import { canScrollBy } from '@/logic/scrollCapture/scrollCapture'
import { DOCK_START_VIEWPORT_RATIO, dockDistance, dockOffset, dockScale } from '@/logic/screenDock/screenDock'

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

// Ressort de la maquette Framer IFRI sur l'échelle et la descente du 1er écran.
const DOCK_SPRING = { stiffness: 500, damping: 60, mass: 1 }

/* Section macOS (réf. maquette Framer IFRI-Comotorage) : l'écran « Selected works » rétrécit et descend au scroll,
   sous le Mac qui défile normalement, jusqu'à finir caché derrière la dalle, centré dessus. */
export default function MacOSSection() {
  const { locale } = useLocale()
  const text = MACBOOK[locale]
  const [scale, setScale] = useState(1)
  const [isPoweredOn, setIsPoweredOn] = useState(true)
  const frameRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const dockRangeRef = useRef<HTMLDivElement>(null)
  const worksBoxRef = useRef<HTMLDivElement>(null)
  const dockDistancePx = useMotionValue(0)

  // Course : du haut du 1er écran à 76,6 % de la fenêtre (départ de la réf.) au bas de la zone touchant le bas de la fenêtre.
  const { scrollYProgress } = useScroll({
    target: dockRangeRef,
    offset: [
      [0, DOCK_START_VIEWPORT_RATIO],
      [1, 1],
    ],
  })
  // Fonctions plutôt que plages : framer-motion confierait l'animation au navigateur (ScrollTimeline), qui calcule mal la plage.
  const worksScale = useSpring(useTransform(scrollYProgress, dockScale), DOCK_SPRING)
  const worksY = useSpring(
    useTransform([scrollYProgress, dockDistancePx], ([progress, distance]: number[]) => dockOffset(progress, distance)),
    DOCK_SPRING,
  )

  useEffect(() => {
    const section = sectionRef.current
    const frame = frameRef.current
    const worksBox = worksBoxRef.current
    if (!section || !frame || !worksBox) return
    const observer = new ResizeObserver(() => {
      setScale(frame.clientWidth / SCREEN_WIDTH_PX)
      // Les 2 boîtes ne sont jamais transformées : leur écart ne dépend pas du scroll.
      dockDistancePx.set(dockDistance(worksBox.getBoundingClientRect(), frame.getBoundingClientRect()))
    })
    observer.observe(section)
    observer.observe(frame)
    return () => observer.disconnect()
  }, [dockDistancePx])

  // Une fenêtre qui peut encore défiler garde la molette ; sinon la page défile.
  const attachWheelCapture = useCallback((frame: HTMLDivElement | null) => {
    frameRef.current = frame
    if (!frame) return
    const handleWheel = (event: WheelEvent) => {
      // data-wheel-capture : zone qui gère la molette elle-même (app Qt dessinée dans un canvas).
      const isCaptured = event.target instanceof Element && event.target.closest('[data-wheel-capture]')
      if (isCaptured || canAncestorScroll(event.target, frame, event)) event.stopPropagation()
    }
    frame.addEventListener('wheel', handleWheel, { passive: false })
    return () => frame.removeEventListener('wheel', handleWheel)
  }, [])

  return (
    <section
      ref={sectionRef}
      aria-label={text.sectionLabel}
      className="relative bg-white px-[20px] pt-(--section-gap)"
    >
      {/* Zone de la course : commence au haut du 1er écran, finit sous la place réservée au pied de l'appareil. */}
      <div ref={dockRangeRef} className="flex flex-col items-center gap-[46px]">
        {/* 1er écran : 1162 px max comme la réf., boîte fixe dans le flux, seul son contenu est transformé. */}
        <div ref={worksBoxRef} aria-hidden="true" className="pointer-events-none relative z-[1] aspect-[1512/982] w-[min(1162px,100%)]">
          <motion.div style={{ y: worksY, scale: worksScale }} className="absolute inset-0 will-change-transform">
            <WorksScreen />
          </motion.div>
        </div>
        {/* Dalle = 815/1162 du 1er écran (réf.), cadre régulier de 10 px et rayon 28 px à 1440, proportionnels à la largeur (cqw).
            Dessous, la place du pied de l'appareil de la réf. : en fin de course la dalle commence au même y que la sienne (114 px à 1440).
            Notre dalle est 47 px plus haute (1512/982 contre 815/482), d'où 257 px sous l'écran au lieu de 304 (257 - 10 px de cadre). */}
        <div className="@container relative z-[2] mb-[calc(min(1162px,100%)*247/1162)] w-[calc(min(1162px,100%)*835/1162)]">
          <div className="relative w-full rounded-[calc(100cqw*28/835)] bg-black p-[calc(100cqw*10/835)] shadow-(--macos-screen-shadow)">
            <div
              ref={attachWheelCapture}
              data-mouse-trail="off"
              className="relative aspect-[1512/982] w-full overflow-hidden rounded-t-[calc(100cqw*18/835)] rounded-b-[3px] bg-black select-none"
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
          </div>
        </div>
      </div>
    </section>
  )
}
