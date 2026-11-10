import { useEffect, useRef } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLocation } from 'react-router-dom'
import Hero from '@/components/pages/Home/Hero'
import Projects from '@/components/pages/Home/Projects'
import MacOSSection from '@/components/pages/Home/MacOSSection'
import ProjectsShowcase from '@/components/pages/Home/ProjectsShowcase'
import About from '@/components/pages/Home/About'
import Experience from '@/components/pages/Home/Experience'
import DedicatedTeam from '@/components/pages/Home/DedicatedTeam'
import Services from '@/components/pages/Home/Services'
import PinNote from '@/components/pages/Home/PinNote'
import Footer from '@/components/ui/Footer'
import { useLocale } from '@/lib/LocaleProvider'
import { MOBILE_QUERY, useMediaQuery } from '@/lib/useMediaQuery'

// Sections masquées pour l'instant, gardées pour y revenir : passer à true pour les réafficher.
const SHOULD_SHOW_PROJECTS = false
const SHOULD_SHOW_SKILLS = false

// À venir : menu 3 barres verticales entre DedicatedTeam et Services, CTA de fin (réf. momdesign.fr).
export default function HomePage() {
  const { locale } = useLocale()
  const previousLocale = useRef(locale)
  const isMobile = useMediaQuery(MOBILE_QUERY)
  const { hash } = useLocation()

  // Arrivée par /#section (bouton Retour, liens du footer depuis une autre page) : saut direct à la section.
  useEffect(() => {
    if (!hash) return
    const frame = requestAnimationFrame(() => document.querySelector(hash)?.scrollIntoView())
    return () => cancelAnimationFrame(frame)
  }, [hash])

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
      {/* Téléphone (réf. haufsess.com) : pas de Mac ni de tableau de notes, les projets suivent directement le hero. */}
      {!isMobile && <MacOSSection />}
      <ProjectsShowcase />
      <About />
      <Experience />
      {SHOULD_SHOW_SKILLS && <DedicatedTeam />}
      <Services />
      {!isMobile && <PinNote />}
      <Footer />
    </main>
  )
}
