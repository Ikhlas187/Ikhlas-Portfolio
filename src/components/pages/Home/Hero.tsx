import SiteHeader from '@/components/ui/SiteHeader'
import HeroTitle from '@/components/pages/Home/HeroTitle'
import { useLocale } from '@/lib/LocaleProvider'
import { HERO } from '@/data/hero'

/* 1er écran (réf. jorge-template.framer.website, couleurs inversées) : nom géant centré et rôle dessous. Paliers 810 et 1200 de la réf. */
export default function Hero() {
  const { locale } = useLocale()
  const hero = HERO[locale]

  return (
    <>
      <SiteHeader />
      {/* Collée sans z-index : la section suivante, positionnée et plus loin dans le DOM, passe par-dessus. */}
      <section id="top" className="sticky top-0 flex h-svh w-full flex-col items-center overflow-clip bg-white text-center text-black">
        <div className="relative flex w-full max-w-[1920px] flex-1 flex-col items-center justify-center overflow-clip px-5 min-[810px]:px-10">
          <HeroTitle name={hero.fullName} role={hero.role} />
        </div>
      </section>
    </>
  )
}
