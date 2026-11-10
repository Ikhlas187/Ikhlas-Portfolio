import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Award } from 'lucide-react'
import BackPill from '@/components/ui/BackPill'
import Footer from '@/components/ui/Footer'
import SiteHeader from '@/components/ui/SiteHeader'
import { CERTIFICATION_PHOTOS } from '@/data/certificationPhotos'
import { CERTIFICATIONS_PAGE } from '@/data/certifications'
import { CV } from '@/data/cv'
import { useLenis } from '@/lib/LenisProvider'
import { useLocale } from '@/lib/LocaleProvider'

/* Certifications : photo du certificat, titre et année dessous ; 1 par ligne sur téléphone, 2 par ligne sur ordinateur. */
export default function CertificationsPage() {
  const { locale } = useLocale()
  const lenis = useLenis()
  const { hash } = useLocation()
  const text = CERTIFICATIONS_PAGE[locale]
  const certifications = CV[locale].certifications

  useEffect(() => {
    // Retour de la page de réservation : /…#contact ramène au footer, sinon haut de page.
    const target = hash ? document.querySelector<HTMLElement>(hash) : null
    lenis?.scrollTo(target ?? 0, { immediate: true })
  }, [lenis, hash])

  return (
    <div className="bg-white pt-[72px] text-black">
      <SiteHeader />
      <main className="mx-auto max-w-[1800px] px-3 pt-8 pb-16 min-[810px]:px-4 min-[1200px]:px-5">
        <BackPill label={text.back} to="/#projects" />
        <h1 className="mt-10 font-heading text-[48px] leading-[1.1] font-normal tracking-[-0.04em] min-[810px]:text-[64px]">
          {text.title}
        </h1>
        <ul className="mt-10 grid grid-cols-1 gap-12 min-[810px]:grid-cols-2 min-[810px]:gap-x-6">
          {certifications.map((certification) => {
            const photo = CERTIFICATION_PHOTOS[certification.id]
            return (
              <li key={certification.id} className="flex flex-col gap-3">
                {photo ? (
                  <img
                    src={photo}
                    alt={certification.title}
                    loading="lazy"
                    className="aspect-[1.414] w-full rounded-[8px] border border-[color-mix(in_srgb,var(--color-black)_10%,var(--color-white))] bg-[color-mix(in_srgb,var(--color-black)_4%,var(--color-white))] object-contain"
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
