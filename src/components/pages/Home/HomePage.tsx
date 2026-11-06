import { useEffect, useRef } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Hero from '@/components/pages/Home/Hero'
import Projects from '@/components/pages/Home/Projects'
import MacOSSection from '@/components/pages/Home/MacOSSection'
import About from '@/components/pages/Home/About'
import Experience from '@/components/pages/Home/Experience'
import DedicatedTeam from '@/components/pages/Home/DedicatedTeam'
import Services from '@/components/pages/Home/Services'
import PinNote from '@/components/pages/Home/PinNote'
import Footer from '@/components/pages/Home/Footer'
import { useLocale } from '@/lib/LocaleProvider'

// Sections masquées pour l'instant, gardées pour y revenir : passer à true pour les réafficher.
// Projects : l'intercalaire « Selected works » vit maintenant dans MacOSSection (WorksScreen).
const SHOULD_SHOW_PROJECTS = false
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
      <MacOSSection />
      <About />
      <Experience />
      {SHOULD_SHOW_SKILLS && <DedicatedTeam />}
      <Services />
      <PinNote />
      <Footer />
    </main>
  )
}
