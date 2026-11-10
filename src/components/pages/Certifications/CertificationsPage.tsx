import { useEffect } from 'react'
import { Award } from 'lucide-react'
import BackPill from '@/components/ui/BackPill'
import Footer from '@/components/ui/Footer'
import SiteHeader from '@/components/ui/SiteHeader'
import { CERTIFICATIONS_PAGE } from '@/data/certifications'
import { CV } from '@/data/cv'
import { useLenis } from '@/lib/LenisProvider'
import { useLocale } from '@/lib/LocaleProvider'

// Photo d'un certificat : src/assets/certifications/<id de la certification>.(webp|jpg|jpeg|png).
const PHOTOS = import.meta.glob<string>('/src/assets/certifications/*.{webp,jpg,jpeg,png}', {
  eager: true,
  import: 'default',
})

function photoOf(id: string) {
  const path = Object.keys(PHOTOS).find((file) => file.split('/').pop()?.split('.')[0] === id)
  return path ? PHOTOS[path] : undefined
}

/* Certifications l'une sous l'autre : photo du certificat, titre et année dessous. */
export default function CertificationsPage() {
  const { locale } = useLocale()
  const lenis = useLenis()
  const text = CERTIFICATIONS_PAGE[locale]
  const certifications = CV[locale].certifications

  useEffect(() => {
    lenis?.scrollTo(0, { immediate: true })
  }, [lenis])

  return (
    <div className="bg-white pt-[72px] text-black">
      <SiteHeader />
      <main className="mx-auto max-w-[900px] px-3 pt-8 pb-16 min-[810px]:px-4">
        <BackPill label={text.back} to="/#projects" />
        <h1 className="mt-10 font-heading text-[48px] leading-[1.1] font-normal tracking-[-0.04em] min-[810px]:text-[64px]">
          {text.title}
        </h1>
        <ul className="mt-10 flex flex-col gap-12">
          {certifications.map((certification) => {
            const photo = photoOf(certification.id)
            return (
              <li key={certification.id} className="flex flex-col gap-3">
                {photo ? (
                  <img
                    src={photo}
                    alt={certification.title}
                    loading="lazy"
                    className="w-full rounded-[8px] border border-[color-mix(in_srgb,var(--color-black)_10%,var(--color-white))]"
                  />
                ) : (
                  <div className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-3 rounded-[8px] bg-[color-mix(in_srgb,var(--color-black)_6%,var(--color-white))] font-sans text-[14px] text-(--color-gray-400)">
                    <Award aria-hidden="true" className="size-10" />
                    {text.photoPending}
                  </div>
                )}
                <div className="flex items-baseline justify-between gap-4 font-sans text-[18px] leading-[1.25] font-medium tracking-[-0.02em]">
                  <p>{certification.title}</p>
                  <p className="shrink-0">{certification.year ?? certification.issuer}</p>
                </div>
              </li>
            )
          })}
        </ul>
      </main>
      <Footer />
    </div>
  )
}
