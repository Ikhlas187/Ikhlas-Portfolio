import MagneticButton from '@/components/pages/Home/MagneticButton'
import ScheduleButton from '@/components/pages/Home/ScheduleButton'
import Projects from '@/components/pages/Home/Projects'
import About from '@/components/pages/Home/About'
import DedicatedTeam from '@/components/pages/Home/DedicatedTeam'
import Services from '@/components/pages/Home/Services'
import Footer from '@/components/pages/Home/Footer'

// À venir : menu 3 barres verticales entre DedicatedTeam et Services, CTA avant Footer (réf. momdesign.fr).
export default function HomePage() {
  return (
    <main className="bg-[#000]">
      <div className="flex justify-center px-6 py-10">
        <MagneticButton>
          <ScheduleButton />
        </MagneticButton>
      </div>
      <Projects />
      <About />
      <DedicatedTeam />
      <Services />
      <Footer />
    </main>
  )
}
