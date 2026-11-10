import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import CertificationsButton from '@/components/pages/Home/CertificationsButton'
import ProjectSlide from '@/components/pages/Home/ProjectSlide'
import SectionHeading from '@/components/pages/Home/SectionHeading'
import { PROJECT_PAGE, SHOWCASE_PROJECTS } from '@/data/projects'
import { useLocale } from '@/lib/LocaleProvider'
import { showcaseOffsetVw } from '@/logic/showcaseTrack/showcaseTrack'

// Projets du téléphone, à la place du Mac : section collée où le scroll vertical fait défiler les projets vers la gauche.
export default function ProjectsShowcase() {
  const { locale } = useLocale()
  const projects = SHOWCASE_PROJECTS[locale]
  const text = PROJECT_PAGE[locale]
  const trackRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ['start start', 'end end'] })
  // Fonction plutôt que plage : framer-motion passerait sinon par ScrollTimeline, qui calcule mal la plage.
  const x = useTransform(scrollYProgress, (progress) => `${showcaseOffsetVw(progress, projects.length)}vw`)

  return (
    <section id="projects" className="bg-white pt-(--section-gap) pb-4 text-black">
      <div className="px-3 pb-6 min-[810px]:px-4 min-[1200px]:px-5">
        <SectionHeading title={text.sectionTitle} />
      </div>
      {/* 1 hauteur d'écran par projet : le temps de faire passer chacun. */}
      <div ref={trackRef} style={{ height: `${projects.length * 100}svh` }} className="relative">
        <div className="sticky top-0 h-svh overflow-hidden">
          <motion.ul style={{ x }} className="flex h-full">
            {projects.map((project) => (
              <li key={project.slug} className="h-full w-screen shrink-0">
                <ProjectSlide project={project} />
              </li>
            ))}
          </motion.ul>
        </div>
      </div>
      <div className="mt-8 px-3">
        <CertificationsButton />
      </div>
    </section>
  )
}
