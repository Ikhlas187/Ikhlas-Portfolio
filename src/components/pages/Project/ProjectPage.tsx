import { useEffect } from 'react'
import { Link, Navigate, useLocation, useParams } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import BackPill from '@/components/ui/BackPill'
import Footer from '@/components/ui/Footer'
import SiteHeader from '@/components/ui/SiteHeader'
import { PROJECT_PAGE, PROJECTS } from '@/data/projects'
import { useLenis } from '@/lib/LenisProvider'
import { useLocale } from '@/lib/LocaleProvider'
import { projectSlug } from '@/logic/macos/projectSlug/projectSlug'
import { projectServices } from '@/logic/projects/projectServices/projectServices'
import { unsplashPhotoUrl } from '@/logic/unsplashPhotoUrl/unsplashPhotoUrl'

/* Page d'un projet (réf. haufsess.com) : Retour, titre, description, services et année, photos empilées, projet suivant. */
export default function ProjectPage() {
  const { slug } = useParams()
  const { locale } = useLocale()
  const lenis = useLenis()
  const { hash } = useLocation()
  const projects = PROJECTS[locale]
  const text = PROJECT_PAGE[locale]
  const index = projects.findIndex((project) => projectSlug(project.name) === slug)

  useEffect(() => {
    // Retour de la page de réservation : /…#contact ramène au footer, sinon haut de page.
    const target = hash ? document.querySelector<HTMLElement>(hash) : null
    lenis?.scrollTo(target ?? 0, { immediate: true })
  }, [lenis, slug, hash])

  if (index < 0) return <Navigate to="/" replace />
  const project = projects[index]
  const nextProject = projects[(index + 1) % projects.length]
  const services = projectServices(project.eyebrow)

  return (
    <div className="bg-white pt-[72px] text-black">
      <SiteHeader />
      <main className="mx-auto max-w-[1800px] px-3 pt-8 min-[810px]:px-4 min-[1200px]:px-5">
        <BackPill label={text.back} to="/#projects" />
        <h1 className="mt-10 font-heading text-[48px] leading-[1.1] font-normal tracking-[-0.04em] min-[810px]:text-[64px] min-[1200px]:text-[80px]">
          {project.name}
        </h1>
        <dl className="mt-8 flex max-w-[440px] flex-col gap-6 font-sans text-[18px] leading-[1.25] font-medium tracking-[-0.02em]">
          <div className="flex flex-col gap-1">
            <dt className="text-[14px] tracking-normal">{text.description}</dt>
            <dd>{project.description}</dd>
          </div>
          {services.length > 0 && (
            <div className="flex flex-col gap-1">
              <dt className="text-[14px] tracking-normal">{text.services}</dt>
              {services.map((service) => (
                <dd key={service}>{service}</dd>
              ))}
            </div>
          )}
          <div className="flex flex-col gap-1">
            <dt className="text-[14px] tracking-normal">{text.year}</dt>
            <dd>{project.date}</dd>
          </div>
        </dl>
        <div className="mt-12 flex flex-col gap-3 min-[810px]:gap-4">
          {project.photos.map((photo) => (
            <img
              key={photo.id}
              src={unsplashPhotoUrl(photo.id, 1600)}
              alt={photo.alt}
              loading="lazy"
              className="w-full rounded-[8px] bg-[color-mix(in_srgb,var(--color-black)_6%,var(--color-white))] object-cover"
            />
          ))}
        </div>
        <div className="flex justify-end py-16">
          <Link
            to={`/projects/${projectSlug(nextProject.name)}`}
            className="inline-flex cursor-pointer items-center gap-1 font-sans text-[20px] leading-[1.2] font-medium tracking-[-0.02em] underline underline-offset-4"
          >
            {nextProject.name}
            <ChevronRight aria-hidden="true" className="size-5" />
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}
