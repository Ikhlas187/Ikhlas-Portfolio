import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import MobileProjectCard from '@/components/pages/Home/MobileProjectCard'
import SectionHeading from '@/components/pages/Home/SectionHeading'
import { buttonVariants } from '@/components/ui/button'
import { PROJECT_PAGE, PROJECTS } from '@/data/projects'
import { ROUTES } from '@/data/routes'
import { useLocale } from '@/lib/LocaleProvider'
import { cn } from '@/lib/utils'

/* Projets sur mobile, à la place du Mac : un projet par écran, section collée, le scroll vers le bas fait défiler
   les projets vers la gauche ; puis lien vers les certifications. */
export default function MobileProjects() {
  const { locale } = useLocale()
  const projects = PROJECTS[locale]
  const text = PROJECT_PAGE[locale]
  const trackRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ['start start', 'end end'] })
  // Fonction plutôt que plage : framer-motion confierait l'animation au navigateur (ScrollTimeline), qui calcule mal la plage.
  const x = useTransform(scrollYProgress, (progress) => `${-Math.min(1, Math.max(0, progress)) * (projects.length - 1) * 100}vw`)

  return (
    <section id="projects" className="bg-white pt-(--section-gap) pb-4 text-black">
      <div className="px-3 pb-6">
        <SectionHeading title={text.sectionTitle} />
      </div>
      {/* 1 hauteur d'écran par projet : le temps de faire passer chacun. */}
      <div ref={trackRef} style={{ height: `${projects.length * 100}svh` }} className="relative">
        <div className="sticky top-0 h-svh overflow-hidden">
          <motion.ul style={{ x }} className="flex h-full">
            {projects.map((project) => (
              <li key={project.name} className="h-full w-screen shrink-0">
                <MobileProjectCard project={project} />
              </li>
            ))}
          </motion.ul>
        </div>
      </div>
      <div className="mt-8 px-3">
        <Link
          to={ROUTES.CERTIFICATIONS}
          className={cn(buttonVariants(), 'h-12 w-full gap-2 rounded-full font-sans text-[16px]')}
        >
          {text.certificationsLink}
          <ArrowRight aria-hidden="true" />
        </Link>
      </div>
    </section>
  )
}
