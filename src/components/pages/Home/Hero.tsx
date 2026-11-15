import { lazy, Suspense, useRef, useSyncExternalStore } from 'react'
import SiteHeader from '@/components/ui/SiteHeader'
import { useLocale } from '@/lib/LocaleProvider'
import { HERO } from '@/data/hero'
import { isLoaderGone, subscribeLoaderGone } from '@/lib/loaderSession'

const BadgeCanvas = lazy(() => import('@/components/pages/Home/BadgeCanvas'))

/* 1er écran : fond blanc et badge suspendu (réf. drkst.framer.website). Le nom et le rôle restent pour les lecteurs d'écran et le référencement. */
export default function Hero() {
  const { locale } = useLocale()
  const hero = HERO[locale]
  const section = useRef<HTMLElement>(null)
  // Le badge tombe une fois le loader effacé.
  const isPageVisible = useSyncExternalStore(subscribeLoaderGone, isLoaderGone)

  return (
    <>
      <SiteHeader />
      {/* Collée sans z-index : la section suivante, positionnée et plus loin dans le DOM, passe par-dessus. */}
      <section ref={section} id="top" className="sticky top-0 flex h-svh w-full flex-col items-center overflow-clip bg-white text-center text-black">
        <h1 className="sr-only">
          {hero.fullName}, {hero.role}
        </h1>
        {isPageVisible && (
          <Suspense fallback={null}>
            <BadgeCanvas eventSource={section} name={hero.fullName} role={hero.role} label={hero.badgeLabel} flipLabel={hero.badgeFlipLabel} />
          </Suspense>
        )}
      </section>
    </>
  )
}
