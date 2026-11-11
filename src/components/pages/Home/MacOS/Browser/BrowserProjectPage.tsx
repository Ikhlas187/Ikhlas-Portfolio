import { PROJECTS, PROJECTS_SECTION } from '@/data/projects'
import { useLocale } from '@/lib/LocaleProvider'
import { projectSlug } from '@/logic/macos/projectSlug/projectSlug'
import { unsplashPhotoUrl } from '@/logic/unsplashPhotoUrl/unsplashPhotoUrl'

type BrowserProjectPageProps = { slug: string }

export default function BrowserProjectPage({ slug }: BrowserProjectPageProps) {
  const { locale } = useLocale()
  const project = PROJECTS[locale].find((item) => projectSlug(item.name) === slug)
  if (!project) return null
  const [cover, ...photos] = project.photos

  return (
    <article className="min-h-full bg-black px-[56px] py-[36px] text-white">
      <p className="text-[12px] tracking-[0.14em] text-(--color-accent) uppercase">{project.eyebrow}</p>
      <h1 className="mt-[6px] font-heading text-[64px] leading-[0.95]">{project.name}</h1>
      <div className="mt-[16px] flex items-start justify-between gap-[40px]">
        <p className="max-w-[560px] text-[15px] leading-[1.6] text-(--color-gray-600)">{project.description}</p>
        <p className="shrink-0 text-[13px] text-(--color-gray-500)">
          {PROJECTS_SECTION[locale].dateLabel} {project.date}
        </p>
      </div>
      <img loading="lazy" decoding="async"
        src={unsplashPhotoUrl(cover.id, 1400)}
        alt={cover.alt}
        className="mt-[28px] aspect-[16/7] w-full rounded-[10px] object-cover"
      />
      <div className="mt-[12px] grid grid-cols-3 gap-[12px]">
        {photos.map((photo) => (
          <img loading="lazy" decoding="async"
            key={photo.id}
            src={unsplashPhotoUrl(photo.id, 600)}
            alt={photo.alt}
            className="aspect-[4/3] w-full rounded-[8px] object-cover"
          />
        ))}
      </div>
    </article>
  )
}
