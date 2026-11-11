import { Link } from 'react-router-dom'
import { Diamond } from 'lucide-react'
import type { ShowcaseProject } from '@/data/projects'

type ProjectSlideProps = { project: ShowcaseProject }

// Un projet en plein écran, « Nom ◆ Service » en bas (réf. haufsess.com) sur un dégradé qui le garde lisible.
export default function ProjectSlide({ project }: ProjectSlideProps) {
  const [service] = project.services

  return (
    <Link to={`/projects/${project.slug}`} className="relative block size-full cursor-pointer bg-black">
      <picture>
        <source media="(min-width: 810px)" srcSet={project.cover.landscape} />
        <img loading="lazy" decoding="async" src={project.cover.portrait} alt={project.cover.alt} className="size-full object-cover object-[50%_15%]" />
      </picture>
      <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/70 to-transparent px-4 pt-24 pb-[88px] min-[810px]:px-10">
        <p className="flex items-center gap-2 font-sans text-[22px] min-[810px]:text-[32px] leading-[1.2] font-medium tracking-[-0.02em] text-white">
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
