import { Link } from 'react-router-dom'
import { Diamond } from 'lucide-react'
import type { Project } from '@/data/projects'
import { projectSlug } from '@/logic/macos/projectSlug/projectSlug'
import { projectServices } from '@/logic/projects/projectServices/projectServices'
import { unsplashPhotoUrl } from '@/logic/unsplashPhotoUrl/unsplashPhotoUrl'

type MobileProjectCardProps = { project: Project }

/* Un projet en plein écran : photo, et en bas « Nom ◆ Service » (réf. haufsess.com) sur un dégradé qui garde le texte lisible. */
export default function MobileProjectCard({ project }: MobileProjectCardProps) {
  const [cover] = project.photos
  const [service] = projectServices(project.eyebrow)

  return (
    <Link to={`/projects/${projectSlug(project.name)}`} className="relative block size-full cursor-pointer bg-black">
      <img src={unsplashPhotoUrl(cover.id, 1200)} alt={cover.alt} className="size-full object-cover" />
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
