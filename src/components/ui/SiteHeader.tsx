import avatarUrl from '@/assets/avatar.webp'
import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValueEvent, useScroll } from 'framer-motion'
import NavPill from '@/components/ui/NavPill'
import LanguageSelect from '@/components/ui/LanguageSelect'
import BurgerButton from '@/components/ui/BurgerButton'
import { HEADER } from '@/data/hero'
import { NAV_LINKS } from '@/data/site'
import { useLocale } from '@/lib/LocaleProvider'
import { nextUpwardTravel, shouldHideHeader } from '@/logic/headerVisibility/headerVisibility'

// Sur le Mac plein écran ([data-header-guard]), il faut remonter plus pour ne pas cacher sa barre de menus.
const GUARD_REVEAL_DISTANCE_PX = 320
// Le header revenu en remontant repart seul quand le scroll s'arrête, sauf tout en haut, au survol ou menu ouvert.
const IDLE_HIDE_DELAY_MS = 1500

function isOverHeaderGuard() {
  const guard = document.querySelector('[data-header-guard]')
  if (!guard) return false
  const rect = guard.getBoundingClientRect()
  return rect.top <= 0 && rect.bottom > 0
}

/* Header fixe (réf. haufsess.com) : disparaît en fondu en descendant, revient quand on remonte. Sous le CoinLoader (z-100). */
export default function SiteHeader() {
  const { locale } = useLocale()
  const header = HEADER[locale]
  const links = [header.homeLink, ...NAV_LINKS[locale]]
  const { scrollY } = useScroll()
  const [isHidden, setIsHidden] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const isHovered = useRef(false)
  const isMenuOpenRef = useRef(false)
  const hideTimer = useRef(0)
  const previousScrollY = useRef(0)
  const upwardTravel = useRef(0)

  const scheduleIdleHide = () => {
    window.clearTimeout(hideTimer.current)
    hideTimer.current = window.setTimeout(() => {
      if (isHovered.current || isMenuOpenRef.current || scrollY.get() <= 0) return
      upwardTravel.current = 0
      setIsHidden(true)
    }, IDLE_HIDE_DELAY_MS)
  }

  useEffect(() => {
    isMenuOpenRef.current = isMenuOpen
    if (!isMenuOpen && !isHidden) scheduleIdleHide()
  }, [isMenuOpen])

  useEffect(() => () => window.clearTimeout(hideTimer.current), [])

  useMotionValueEvent(scrollY, 'change', (currentScrollY) => {
    const isGuarded = isOverHeaderGuard()
    upwardTravel.current = nextUpwardTravel(upwardTravel.current, previousScrollY.current, currentScrollY)
    const nextIsHidden = shouldHideHeader({
      previousScrollY: previousScrollY.current,
      scrollY: currentScrollY,
      isHidden,
      upwardTravel: upwardTravel.current,
      revealDistance: isGuarded ? GUARD_REVEAL_DISTANCE_PX : 0,
    })
    previousScrollY.current = currentScrollY
    if (nextIsHidden !== isHidden) setIsHidden(nextIsHidden)
    if (nextIsHidden) window.clearTimeout(hideTimer.current)
    else scheduleIdleHide()
  })

  const isVisible = !isHidden || isMenuOpen
  const closeMenu = () => setIsMenuOpen(false)

  return (
    <motion.header
      initial={false}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
      onPointerEnter={() => {
        isHovered.current = true
      }}
      onPointerLeave={() => {
        isHovered.current = false
        if (!isHidden) scheduleIdleHide()
      }}
      className={`fixed inset-x-0 top-0 z-[90] bg-white ${isVisible ? '' : 'pointer-events-none'}`}
    >
      <div className="mx-auto flex max-w-[1800px] flex-col px-3 py-5 min-[810px]:px-4">
        {/* Ordinateur : 3 colonnes, les liens au centre exact de la page quelle que soit la largeur du sélecteur de langue. */}
        <div className="flex w-full items-center justify-center gap-2.5 max-[809px]:h-[47px] min-[810px]:grid min-[810px]:grid-cols-[1fr_auto_1fr]">
          <img
            src={avatarUrl}
            alt={header.avatarLabel}
            className="h-[43px] w-[38px] shrink-0 rounded-[49px] bg-black object-cover min-[810px]:size-[57px] min-[810px]:justify-self-start"
          />

          <nav aria-label={header.navLabel} className="hidden flex-1 items-center gap-4 min-[810px]:flex">
            {links.map((link) => (
              <NavPill key={link.href} label={link.label} href={link.href} />
            ))}
          </nav>

          <div className={`min-[810px]:justify-self-end ${isMenuOpen ? 'order-2' : ''}`}>
            <LanguageSelect />
          </div>

          <div className={`min-[810px]:hidden ${isMenuOpen ? 'order-1' : 'order-3'}`}>
            <BurgerButton isOpen={isMenuOpen} onToggle={() => setIsMenuOpen((isOpen) => !isOpen)} />
          </div>
        </div>

        <motion.div
          id="home-mobile-nav"
          initial={false}
          animate={{ height: isMenuOpen ? 'auto' : 0 }}
          transition={{ type: 'spring', bounce: 0.08, duration: 0.48 }}
          className="overflow-hidden min-[810px]:hidden"
          inert={!isMenuOpen}
        >
          <motion.nav
            aria-label={header.navLabel}
            initial={false}
            animate={{ opacity: isMenuOpen ? 1 : 0 }}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-wrap items-center justify-between gap-y-2 pt-[50px]"
          >
            {links.map((link) => (
              <NavPill key={link.href} label={link.label} href={link.href} onNavigate={closeMenu} />
            ))}
          </motion.nav>
        </motion.div>
      </div>
    </motion.header>
  )
}
