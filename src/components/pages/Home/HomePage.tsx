import { lazy, Suspense, useEffect, useRef } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Hero from '@/components/pages/Home/Hero'
import Projects from '@/components/pages/Home/Projects'
import About from '@/components/pages/Home/About'
import DedicatedTeam from '@/components/pages/Home/DedicatedTeam'
import Services from '@/components/pages/Home/Services'
import PinNote from '@/components/pages/Home/PinNote'
import { useLocale } from '@/lib/LocaleProvider'

// three.js et la scène 3D partent dans un chunk à part, hors du bundle principal.
const MacBookSection = lazy(() => import('@/components/pages/Home/MacBook/MacBookSection'))

// À venir : menu 3 barres verticales entre DedicatedTeam et Services, CTA de fin (réf. momdesign.fr).
export default function HomePage() {
  const { locale } = useLocale()
  const previousLocale = useRef(locale)

  // Les textes traduits changent la hauteur des sections : les déclencheurs placés plus bas doivent être recalculés.
  useEffect(() => {
    if (previousLocale.current === locale) return
    previousLocale.current = locale
    ScrollTrigger.refresh()
  }, [locale])

  return (
    <main className="bg-black">
      <Hero />
      <Projects />
      {/* Même hauteur que la section : les ScrollTrigger plus bas ne bougent pas au chargement. */}
      <Suspense fallback={<div aria-hidden className="h-svh bg-black" />}>
        <MacBookSection />
      </Suspense>
      {/* SplitText remplace les lignes du texte dans le DOM : on remonte la section pour la redécouper dans la nouvelle langue. */}
      <About key={locale} />
      <DedicatedTeam />
      <Services />
      <PinNote />
    </main>
  )
}
