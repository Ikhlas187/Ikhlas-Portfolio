import { Link } from 'react-router-dom'
import { Diamond } from 'lucide-react'
import type { ShowcaseProject } from '@/data/projects'

type MobileProjectCardProps = { project: ShowcaseProject }

/* Un projet en plein écran : capture du site sur téléphone, et en bas « Nom ◆ Service » (réf. haufsess.com)
   sur un dégradé qui garde le texte lisible. */
export default function MobileProjectCard({ project }: MobileProjectCardProps) {
  const [service] = project.services

  return (
    <Link to={`/projects/${project.slug}`} className="relative block size-full cursor-pointer bg-black">
      <img src={project.cover.src} alt={project.cover.alt} className="size-full object-cover object-top" />
      <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/70 to-transparent px-4 pt-24 pb-[88px]">
        <p className="flex items-center gap-2 font-sans text-[22px] leading-[1.2] font-medium tracking-[-0.02em] text-white">
          {project.name}
          {service && (
            <>
              <Diamond aria-hidden="true" className="size-3 fill-current" />
              {service}
            </>
          )}
        </p>
      </div>
    </Link>
  )
}
