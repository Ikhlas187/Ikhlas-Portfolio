import avatarUrl from '@/assets/avatar.webp'
import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValueEvent, useScroll } from 'framer-motion'
import HeaderLink from '@/components/ui/HeaderLink'
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

/* Header fixe au format de callumhayes.framer.website (nom à gauche, liens et sélecteur de langue à droite, verre flou) :
   disparaît en fondu en descendant, revient quand on remonte. Sous le CoinLoader (z-100). */
export default function SiteHeader() {
  const { locale } = useLocale()
  const header = HEADER[locale]
  const links = NAV_LINKS[locale]
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
      className={`fixed inset-x-0 top-0 z-[90] font-[family-name:var(--font-nav)] border-b border-[color-mix(in_srgb,var(--color-black)_6%,transparent)] bg-[color-mix(in_srgb,var(--color-white)_70%,transparent)] text-black backdrop-blur-[50px] ${isVisible ? '' : 'pointer-events-none'}`}
    >
      <div className="flex h-[70px] items-center justify-between px-5 min-[810px]:h-[90px] min-[810px]:px-[50px]">
        <div className="flex items-center gap-3">
          <img src={avatarUrl} alt="" className="size-9 shrink-0 rounded-full bg-black object-cover min-[810px]:size-11" />
          <HeaderLink
            label={header.avatarLabel}
            href={header.homeLink.href}
            onNavigate={closeMenu}
            className="text-[18px] leading-none font-medium tracking-[-0.01em] text-black! hover:text-black! min-[810px]:text-[20px]"
          />
        </div>

        <div className="hidden items-center gap-[30px] min-[810px]:flex">
          <nav aria-label={header.navLabel} className="flex items-center gap-[34px] text-[17px] leading-none font-medium tracking-[-0.01em]">
            {links.map((link) => (
              <HeaderLink key={link.href} label={link.label} href={link.href} />
            ))}
          </nav>
          <LanguageSelect />
        </div>

        <div className="min-[810px]:hidden">
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
        <motion.div
          initial={false}
          animate={{ opacity: isMenuOpen ? 1 : 0 }}
          transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-start gap-6 px-5 pt-4 pb-8"
        >
          <nav aria-label={header.navLabel} className="flex flex-col gap-4 text-[28px] leading-[1.2] tracking-[-0.04em]">
            {links.map((link) => (
              <HeaderLink key={link.href} label={link.label} href={link.href} onNavigate={closeMenu} />
            ))}
          </nav>
          <LanguageSelect />
        </motion.div>
      </motion.div>
    </motion.header>
  )
}
