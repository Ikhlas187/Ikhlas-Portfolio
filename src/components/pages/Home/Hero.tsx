import { lazy, Suspense, useRef, useState, useSyncExternalStore } from 'react'
import { useMotionValueEvent, useScroll, useTransform } from 'framer-motion'
import SiteHeader from '@/components/ui/SiteHeader'
import HeroTitle from '@/components/pages/Home/HeroTitle'
import { useLocale } from '@/lib/LocaleProvider'
import { HERO } from '@/data/hero'
import { isLoaderGone, subscribeLoaderGone } from '@/lib/loaderSession'
import { badgeIntro } from '@/logic/badgeIntro/badgeIntro'

const BadgeCanvas = lazy(() => import('@/components/pages/Home/BadgeCanvas'))

// Défilement réservé à l'intro du badge, en hauteurs d'écran.
const INTRO_SCREENS = 1.5

/* 1er écran : badge suspendu (réf. drkst.framer.website). Au défilement, la carte se retourne, on aperçoit à travers
   son dos dépoli les infos du hero (réf. dexharlan.framer.website), puis on entre dedans. */
export default function Hero() {
  const { locale } = useLocale()
  const hero = HERO[locale]
  const section = useRef<HTMLElement>(null)
  const titleLayer = useRef<HTMLDivElement>(null)
  const isPageVisible = useSyncExternalStore(subscribeLoaderGone, isLoaderGone)
  const { scrollY } = useScroll()
  const introProgress = useTransform(scrollY, (y) => y / (window.innerHeight * INTRO_SCREENS))
  const [isTitleVisible, setIsTitleVisible] = useState(() => badgeIntro(introProgress.get()).isBackVisible)
  useMotionValueEvent(introProgress, 'change', (progress) => setIsTitleVisible(badgeIntro(progress).isBackVisible))

  return (
    <>
      <SiteHeader />
      {/* Collée sans z-index : la section suivante, positionnée et plus loin dans le DOM, passe par-dessus. */}
      <section ref={section} id="top" className="sticky top-0 flex h-svh w-full flex-col items-center overflow-clip bg-white text-center text-black">
        {/* Découpé et flouté par le badge pendant l'intro : on aperçoit le titre à travers le dos de la carte. */}
        <div
          ref={titleLayer}
          className="absolute inset-y-0 left-1/2 flex w-full max-w-[1920px] -translate-x-1/2 flex-col items-center justify-center overflow-clip px-5 min-[810px]:px-7"
        >
          <HeroTitle
            name={hero.fullName}
            location={hero.location}
            availability={hero.availability}
            establishedLabel={hero.establishedLabel}
            establishedYear={hero.establishedYear}
            tagline={hero.tagline}
            ctaLabel={hero.ctaLabel}
            isVisible={isPageVisible && isTitleVisible}
            exitStart={window.innerHeight * INTRO_SCREENS}
          />
        </div>
        {isPageVisible && (
          <Suspense fallback={null}>
            <BadgeCanvas eventSource={section} introProgress={introProgress} titleLayer={titleLayer} name={hero.fullName} label={hero.badgeLabel} />
          </Suspense>
        )}
      </section>
      {/* Hauteur parcourue pendant l'intro, sous le hero collé. */}
      <div aria-hidden="true" className="h-[150vh]" />
    </>
  )
}
