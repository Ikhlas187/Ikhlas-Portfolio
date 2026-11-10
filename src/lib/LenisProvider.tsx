import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import Lenis from '@studio-freight/lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { easeInOutCubic } from '@/logic/easing/easing'

gsap.registerPlugin(ScrollTrigger)

const LenisContext = createContext<Lenis | null>(null)

// Défilement des liens internes : entre 1 et 2,4 s, plus long quand la section est loin.
const ANCHOR_MIN_SECONDS = 1
const ANCHOR_MAX_SECONDS = 2.4
const ANCHOR_PX_PER_SECOND = 4000


/* Smooth scroll Lenis cadencé par gsap.ticker, pour que ScrollTrigger reste synchronisé. */
export default function LenisProvider({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null)

  useEffect(() => {
    const lenisInstance = new Lenis({
      duration: 1.4,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    })

    setLenis(lenisInstance)
    lenisInstance.on('scroll', ScrollTrigger.update)

    const ticker = gsap.ticker.add((time) => {
      lenisInstance.raf(time * 1000)
    })
    gsap.ticker.lagSmoothing(0)

    // Liens internes (#about, #services…) : même glissement que la molette au lieu d'un saut. Lenis 1.0 n'a pas d'option anchors.
    const onAnchorClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey) return
      const link = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[href^="#"]')
      const hash = link?.getAttribute('href')
      if (!hash || hash === '#') return
      const target = document.querySelector<HTMLElement>(hash)
      if (!target) return
      event.preventDefault()
      // Démarrage et arrivée progressifs, durée selon la distance : on voit la page défiler jusqu'à la section.
      const distance = Math.abs(target.getBoundingClientRect().top)
      lenisInstance.scrollTo(target, {
        duration: Math.min(ANCHOR_MAX_SECONDS, ANCHOR_MIN_SECONDS + distance / ANCHOR_PX_PER_SECOND),
        easing: easeInOutCubic,
      })
    }
    document.addEventListener('click', onAnchorClick)

    return () => {
      document.removeEventListener('click', onAnchorClick)
      gsap.ticker.remove(ticker)
      lenisInstance.destroy()
    }
  }, [])

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
}

export function useLenis() {
  return useContext(LenisContext)
}
