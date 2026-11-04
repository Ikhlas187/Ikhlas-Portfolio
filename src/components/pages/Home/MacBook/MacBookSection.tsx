import { useCallback, useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { useMotionValueEvent, useReducedMotion, useScroll } from 'framer-motion'
import MacBookControls from '@/components/pages/Home/MacBook/MacBookControls'
import MacBookScene from '@/components/pages/Home/MacBook/MacBookScene'
import type { MacBookMotion, MacBookPhase } from '@/components/pages/Home/MacBook/macBookMotion'
import { Button } from '@/components/ui/button'
import { MACBOOK } from '@/data/macbook'
import { useLenis } from '@/lib/LenisProvider'
import { useLocale } from '@/lib/LocaleProvider'
import { ZOOM_RANGE, macBookPoseAt, scrollTopFor } from '@/logic/macBookScroll/macBookScroll'

// À 0,95 de zoom, la caméra a parcouru 99 % de la plongée : l'écran remplit la vue et devient utilisable.
const INTERACTIVE_ZOOM = 0.95
// Au-delà, l'écran grandit vers les bords : le bouton Allumer / Éteindre mordrait dessus.
const CONTROLS_MAX_ZOOM = 0.12

// Section haute à scène collante : le défilement ouvre le capot, plonge dans l'écran et démarre macOS.
export default function MacBookSection() {
  const { locale } = useLocale()
  const text = MACBOOK[locale]
  const lenis = useLenis()
  const sectionRef = useRef<HTMLElement>(null)
  const motion = useRef<MacBookMotion>({ lid: 0, zoom: 0 }).current
  const [isNear, setIsNear] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [phase, setPhase] = useState<MacBookPhase>('closed')
  const [isZoomed, setIsZoomed] = useState(false)
  const [isOverview, setIsOverview] = useState(true)
  const [isShutDown, setIsShutDown] = useState(false)
  const isReducedMotion = useReducedMotion() ?? false
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] })

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
        if (entry.isIntersecting) setIsNear(true)
      },
      { rootMargin: '200px 0px' },
    )
    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  const applyProgress = useCallback(
    (progress: number) => {
      const pose = macBookPoseAt(progress)
      motion.lid = pose.lid
      motion.zoom = pose.zoom
      setPhase(pose.lid === 0 ? 'closed' : pose.lid < 1 ? 'opening' : 'open')
      setIsZoomed(pose.zoom >= INTERACTIVE_ZOOM)
      setIsOverview(pose.zoom <= CONTROLS_MAX_ZOOM)
      // Capot refermé : le prochain passage rallume le Mac.
      if (pose.lid === 0) setIsShutDown(false)
    },
    [motion],
  )

  useEffect(() => applyProgress(scrollYProgress.get()), [applyProgress, scrollYProgress])
  useMotionValueEvent(scrollYProgress, 'change', applyProgress)

  // Clic sur le MacBook : défile jusqu'au plein écran au lieu de l'animer à part.
  const scrollToScreen = useCallback(() => {
    const section = sectionRef.current
    if (!section) return
    const sectionTop = section.getBoundingClientRect().top + window.scrollY
    const top = scrollTopFor(ZOOM_RANGE[1], sectionTop, section.offsetHeight - window.innerHeight)
    if (lenis) lenis.scrollTo(top, { duration: isReducedMotion ? 0 : 2.2 })
    else window.scrollTo({ top, behavior: isReducedMotion ? 'auto' : 'smooth' })
  }, [lenis, isReducedMotion])

  const isPoweredOn = phase === 'open' && !isShutDown

  return (
    <section ref={sectionRef} aria-label={text.sectionLabel} className="relative h-[400svh] bg-white">
      <div className="sticky top-0 h-svh overflow-hidden" data-cursor={phase === 'closed' ? 'scroll' : undefined}>
        {isNear && (
          <Canvas
            flat
            frameloop={isVisible ? 'always' : 'never'}
            dpr={[1, 2]}
            camera={{ fov: 30, near: 1, far: 2000, position: [0, 50, 50] }}
          >
            <MacBookScene
              motion={motion}
              phase={phase}
              isZoomed={isZoomed}
              isPoweredOn={isPoweredOn}
              isShutDown={isShutDown && isZoomed}
              isReducedMotion={isReducedMotion}
              onOpen={scrollToScreen}
              onZoomIn={scrollToScreen}
              onShutDown={() => setIsShutDown(true)}
            />
          </Canvas>
        )}
        {phase === 'closed' && (
          <>
            <Button
              className="sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:bottom-[6%] focus-visible:left-1/2 focus-visible:h-9 focus-visible:-translate-x-1/2 focus-visible:rounded-full focus-visible:bg-white focus-visible:px-4 focus-visible:text-black"
              onClick={scrollToScreen}
            >
              {text.openLabel}
            </Button>
          </>
        )}
        {phase === 'open' && (isOverview || (isShutDown && isZoomed)) && (
          <MacBookControls isPoweredOn={isPoweredOn} onTogglePower={() => setIsShutDown((current) => !current)} />
        )}
      </div>
    </section>
  )
}
