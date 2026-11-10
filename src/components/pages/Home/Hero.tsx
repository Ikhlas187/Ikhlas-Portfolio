import SiteHeader from '@/components/ui/SiteHeader'
import FadeInImage from '@/components/pages/Home/FadeInImage'
import HeroName from '@/components/pages/Home/HeroName'
import { useLocale } from '@/lib/LocaleProvider'
import { HERO } from '@/data/hero'
import { unsplashPhotoUrl } from '@/logic/unsplashPhotoUrl/unsplashPhotoUrl'

/* 1er écran (réf. haufsess.com) : header fixe, tagline et photo côte à côte, nom géant en bas. Paliers 810 et 1200 de la réf. */
export default function Hero() {
  const { locale } = useLocale()
  const hero = HERO[locale]

  return (
    <div id="top" className="bg-white pt-[72px] text-black">
      <SiteHeader />
      <div className="mx-auto max-w-[1800px] px-3 pt-5 pb-16 min-[810px]:px-4 min-[810px]:pt-6 min-[1200px]:px-5 min-[1200px]:pb-12">
        <section className="flex flex-col justify-center gap-12 min-[810px]:justify-start min-[810px]:gap-16 min-[1200px]:h-[90vh] min-[1200px]:max-h-[900px] min-[1200px]:min-h-[720px] min-[1200px]:gap-7">
          <div className="flex w-full flex-col gap-8 overflow-clip min-[810px]:flex-row min-[810px]:items-start min-[810px]:justify-end min-[810px]:gap-6 min-[1200px]:gap-0">
            <div className="flex w-full items-center min-[810px]:w-px min-[810px]:flex-1">
              <p className="max-w-[424px] flex-1 font-sans text-[24px] leading-[1.1] font-medium tracking-[-0.02em] whitespace-pre-wrap min-[810px]:text-[28px] min-[1200px]:text-[32px]">
                {hero.tagline}
              </p>
            </div>
            <div className="w-full min-[810px]:w-px min-[810px]:flex-1">
              <FadeInImage
                src={unsplashPhotoUrl(hero.photoId, 1400)}
                alt={hero.photoAlt}
                className="h-[398px] w-full rounded-[8px] object-cover object-center min-[810px]:aspect-video min-[810px]:h-auto min-[810px]:max-h-[700px]"
              />
            </div>
          </div>
          <HeroName name={hero.name} />
        </section>
      </div>
    </div>
  )
}
