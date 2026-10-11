import type { CSSProperties } from 'react'
import { Sparkle } from 'lucide-react'
import { PROJECTS_SECTION, type Project } from '@/data/projects'
import { unsplashPhotoUrl } from '@/logic/unsplashPhotoUrl/unsplashPhotoUrl'

const PHOTO_WIDTH = 900

// Gabarits a/b alternés pour retrouver le collage irrégulier de la référence.
export default function ProjectBoard({ project }: { project: Project }) {
  return (
    <article
      className={`bd-board bd-board--${project.layout}`}
      style={{ '--accent': project.accent, '--accent-dark': project.dark } as CSSProperties}
    >
      <div className="bd-board__info">
        <p className="bd-board__eyebrow">{project.eyebrow}</p>
        <div>
          <h3 className="bd-board__name">{project.name}</h3>
          <p className="bd-board__desc">{project.description}</p>
        </div>
        <p className="bd-board__date">
          {PROJECTS_SECTION.dateLabel} {project.date}
        </p>
      </div>

      <div className="bd-board__art">
        {project.photos.map((photo, i) => (
          <figure className={`bd-photo bd-photo--${i + 1}`} key={photo.id}>
            <img src={unsplashPhotoUrl(photo.id, PHOTO_WIDTH)} alt={photo.alt} loading="lazy" />
          </figure>
        ))}
        <div className="bd-tile-name" aria-hidden="true">
          <span className="bd-tile-name__mark">
            {project.name.charAt(0)}
            <Sparkle size={14} fill="currentColor" strokeWidth={0} aria-hidden="true" />
          </span>
          <span className="bd-tile-name__label">{project.name}</span>
        </div>
      </div>
    </article>
  )
}
