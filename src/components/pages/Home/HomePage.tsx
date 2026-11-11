import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Hero from '@/components/pages/Home/Hero'
import MacOSSection from '@/components/pages/Home/MacOSSection'
import ProjectsShowcase from '@/components/pages/Home/ProjectsShowcase'
import About from '@/components/pages/Home/About'
import Experience from '@/components/pages/Home/Experience'
import Services from '@/components/pages/Home/Services'
import PinNote from '@/components/pages/Home/PinNote'
import Footer from '@/components/ui/Footer'
import { MOBILE_QUERY, useMediaQuery } from '@/lib/useMediaQuery'

export default function HomePage() {
  const isMobile = useMediaQuery(MOBILE_QUERY)
  const { hash } = useLocation()

  // Arrivée par /#section (bouton Retour, liens du footer depuis une autre page) : saut direct à la section.
  useEffect(() => {
    if (!hash) return
    const frame = requestAnimationFrame(() => document.querySelector(hash)?.scrollIntoView())
    return () => cancelAnimationFrame(frame)
  }, [hash])

  return (
    <main className="bg-black">
      {/* Borne le hero collé : il reste sous la section qui le recouvre, puis repart avec elle. */}
      <div>
        <Hero />
        {/* Ordinateur : le Mac (bouton des certifications dessous) ; téléphone (réf. haufsess.com) : les projets à sa place, pas de tableau de notes. */}
        {isMobile ? <ProjectsShowcase /> : <MacOSSection />}
      </div>
      <About />
      <Experience />
      <Services />
      {!isMobile && <PinNote />}
      <Footer />
    </main>
  )
}
