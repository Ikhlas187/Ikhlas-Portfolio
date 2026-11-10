import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useScroll, useTransform } from 'framer-motion'
import { Power } from 'lucide-react'
import CertificationsButton from '@/components/pages/Home/CertificationsButton'
import MacOS from '@/components/pages/Home/MacOS/MacOS'
import SectionHeading from '@/components/pages/Home/SectionHeading'
import { Button } from '@/components/ui/button'
import { MACBOOK } from '@/data/macbook'
import { PROJECT_PAGE } from '@/data/projects'
import { useLenis } from '@/lib/LenisProvider'
import { useLocale } from '@/lib/LocaleProvider'
import { canScrollBy } from '@/logic/scrollCapture/scrollCapture'
import { revealAspect, revealBackdropOpacity, revealCoverScale, revealScale } from '@/logic/screenReveal/screenReveal'

// Taille logique du bureau macOS, réduite à la largeur de la section.
const SCREEN_WIDTH_PX = 1512
const SCREEN_HEIGHT_PX = 982
const SCREEN_ASPECT = SCREEN_WIDTH_PX / SCREEN_HEIGHT_PX

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

// Retour de l'écran à sa place quand on éteint le Mac en plein écran.
const REVEAL_SCROLL_SECONDS = 1.6

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

/* Section macOS : le Mac arrive plein écran et rétrécit au scroll jusqu'à sa place dans l'appareil (réf. cafedelmar.nl). */
export default function MacOSSection() {
  const { locale } = useLocale()
  const text = MACBOOK[locale]
  const [scale, setScale] = useState(1)
  const [isPoweredOn, setIsPoweredOn] = useState(true)
  const [deviceHeight, setDeviceHeight] = useState(0)
  const frameRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const revealZoneRef = useRef<HTMLDivElement>(null)
  const deviceRef = useRef<HTMLDivElement>(null)
  const coverScale = useMotionValue(1)
  const viewportAspect = useMotionValue(SCREEN_ASPECT)
  const lenis = useLenis()

  // Réf. cafedelmar.nl : l'écran du Mac arrive plein écran, reste collé, puis rétrécit jusqu'à sa place dans l'appareil.
  const { scrollYProgress: revealProgress } = useScroll({ target: revealZoneRef, offset: ['start start', 'end end'] })
  const deviceScale = useTransform([revealProgress, coverScale], ([progress, cover]: number[]) => revealScale(progress, cover))
  const backdropOpacity = useTransform(revealProgress, revealBackdropOpacity)
  // Bouton des certifications sous l'appareil : n'apparaît qu'à la fin du rétrécissement.
  const buttonOpacity = useTransform(revealProgress, (progress) => Math.min(1, Math.max(0, (progress - 0.8) / 0.2)))
  const buttonEvents = useTransform(buttonOpacity, (opacity) => (opacity > 0.5 ? 'auto' : 'none'))
  const screenAspect = useTransform([revealProgress, viewportAspect], ([progress, aspect]: number[]) =>
    revealAspect(progress, aspect, SCREEN_ASPECT),
  )
  // Bureau macOS : 1512 px de large, sa hauteur suit la proportion de l'écran.
  const desktopHeight = useTransform(screenAspect, (aspect) => SCREEN_WIDTH_PX / aspect)
  // Coins de l'écran droits en plein écran, arrondis dans l'appareil.
  const screenRadius = useTransform(revealProgress, (progress) => `calc(100cqw * ${(18 / 835) * Math.min(1, Math.max(0, progress))})`)

  useEffect(() => {
    const section = sectionRef.current
    const frame = frameRef.current
    if (!section || !frame) return
    const observer = new ResizeObserver(() => {
      setScale(frame.clientWidth / SCREEN_WIDTH_PX)
      setDeviceHeight(deviceRef.current?.offsetHeight ?? 0)
      const viewport = { width: window.innerWidth, height: window.innerHeight }
      coverScale.set(revealCoverScale(frame.offsetWidth, viewport.width))
      viewportAspect.set(viewport.width / viewport.height)
    })
    observer.observe(section)
    observer.observe(frame)
    return () => observer.disconnect()
  }, [coverScale, viewportAspect])

  // Éteindre en plein écran fait défiler jusqu'au bout de la zone : on voit l'écran rejoindre l'appareil.
  const shutdown = () => {
    setIsPoweredOn(false)
    const zone = revealZoneRef.current
    if (!zone || !lenis || revealProgress.get() >= 1) return
    const target = window.scrollY + zone.getBoundingClientRect().bottom - window.innerHeight
    lenis.scrollTo(target, { duration: REVEAL_SCROLL_SECONDS, easing: easeInOutCubic })
  }

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
      {/* Titre de section de la réf. haufsess.com, vu juste avant que l'écran du Mac monte en plein écran. */}
      <div className="pb-10 text-black">
        <SectionHeading title={PROJECT_PAGE[locale].sectionTitle} />
      </div>
      <div className="flex flex-col items-center">
        {/* Zone de 2 hauteurs de fenêtre : la 1re pour arriver, la 2e collée pendant que l'écran rétrécit. */}
        <div ref={revealZoneRef} data-header-guard className="relative z-[2] -mx-[20px] h-[200vh] self-stretch overflow-clip">
          <div className="sticky top-0 flex h-screen items-center justify-center">
            <motion.div aria-hidden="true" style={{ opacity: backdropOpacity }} className="absolute inset-0 bg-black" />
            {/* Dalle = 835/1162 du 1er écran, cadre de 10 px et rayon 28 px à 1440, proportionnels à la largeur (cqw). */}
            <motion.div
              ref={deviceRef}
              style={{ scale: deviceScale }}
              className="@container relative w-[calc(min(1162px,100%-40px)*835/1162)]"
            >
              <div className="relative w-full rounded-[calc(100cqw*28/835)] bg-black p-[calc(100cqw*10/835)] shadow-(--macos-screen-shadow)">
                <motion.div
                  ref={attachWheelCapture}
                  data-mouse-trail="off"
                  style={{ aspectRatio: screenAspect, borderTopLeftRadius: screenRadius, borderTopRightRadius: screenRadius }}
                  className="relative w-full overflow-hidden rounded-b-[3px] bg-black select-none"
                >
                  <motion.div
                    className="absolute top-0 left-0 origin-top-left"
                    style={{ width: SCREEN_WIDTH_PX, height: desktopHeight, scale }}
                  >
                    <MacOS isPoweredOn={isPoweredOn} onShutdown={shutdown} />
                    {/* Encoche de la caméra (MacBook Pro 14 : ~186 × 32 pt sur 1512), coins du haut incurvés vers le cadre. */}
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute top-0 left-1/2 z-[60] flex h-[32px] w-[186px] -translate-x-1/2 items-center justify-center rounded-b-[12px] bg-black before:absolute before:top-0 before:-left-[10px] before:size-[10px] before:bg-[radial-gradient(circle_at_0_100%,transparent_10px,var(--color-black)_10.5px)] after:absolute after:top-0 after:-right-[10px] after:size-[10px] after:bg-[radial-gradient(circle_at_100%_100%,transparent_10px,var(--color-black)_10.5px)]"
                    >
                      <span className="size-[7px] rounded-full bg-(--color-gray-300) ring-1 ring-(--color-gray-200)" />
                    </div>
                  </motion.div>
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
                </motion.div>
              </div>
            </motion.div>
            {/* Hors du flux : l'appareil reste centré, donc le plein écran aussi. */}
            <motion.div
              style={{ opacity: buttonOpacity, pointerEvents: buttonEvents, top: `calc(50% + ${deviceHeight / 2 + 28}px)` }}
              className="absolute left-1/2 -translate-x-1/2"
            >
              <CertificationsButton />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
