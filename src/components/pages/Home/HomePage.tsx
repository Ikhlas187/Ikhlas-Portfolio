import { lazy, Suspense, useEffect, useRef } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Hero from '@/components/pages/Home/Hero'
import Projects from '@/components/pages/Home/Projects'
import About from '@/components/pages/Home/About'
import Experience from '@/components/pages/Home/Experience'
import DedicatedTeam from '@/components/pages/Home/DedicatedTeam'
import Services from '@/components/pages/Home/Services'
import PinNote from '@/components/pages/Home/PinNote'
import CallSection from '@/components/pages/Home/CallSection'
import Footer from '@/components/pages/Home/Footer'
import { useLocale } from '@/lib/LocaleProvider'

// three.js et la scène 3D partent dans un chunk à part, hors du bundle principal.
const MacBookSection = lazy(() => import('@/components/pages/Home/MacBook/MacBookSection'))

// Sections masquées pour l'instant, gardées pour y revenir : passer à true pour les réafficher.
const SHOULD_SHOW_PROJECTS = true
const SHOULD_SHOW_SKILLS = false

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
      {SHOULD_SHOW_PROJECTS && <Projects />}
      {/* Même hauteur que la section : les ScrollTrigger plus bas ne bougent pas au chargement. */}
      <Suspense fallback={<div aria-hidden className="h-[400svh] bg-white" />}>
        <MacBookSection />
      </Suspense>
      {/* SplitText remplace les lignes du texte dans le DOM : on remonte la section pour la redécouper dans la nouvelle langue. */}
      <About key={locale} />
      <Experience />
      {SHOULD_SHOW_SKILLS && <DedicatedTeam />}
      <Services />
      <PinNote />
      <CallSection />
      <Footer />
    </main>
  )
}
