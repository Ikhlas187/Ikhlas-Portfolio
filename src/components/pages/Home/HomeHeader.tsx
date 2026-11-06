import avatarUrl from '@/assets/avatar.webp'
import { useRef, useState } from 'react'
import { motion, useMotionValueEvent, useScroll } from 'framer-motion'
import NavPill from '@/components/pages/Home/NavPill'
import LanguageSelect from '@/components/pages/Home/LanguageSelect'
import BurgerButton from '@/components/pages/Home/BurgerButton'
import { HEADER } from '@/data/hero'
import { NAV_LINKS } from '@/data/site'
import { useLocale } from '@/lib/LocaleProvider'
import { shouldHideHeader } from '@/logic/headerVisibility/headerVisibility'

/* Header fixe (réf. haufsess.com) : disparaît en fondu en descendant, revient dès qu'on remonte. Sous le CoinLoader (z-100). */
export default function HomeHeader() {
  const { locale } = useLocale()
  const header = HEADER[locale]
  const links = [header.homeLink, ...NAV_LINKS[locale]]
  const { scrollY } = useScroll()
  const [isHidden, setIsHidden] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const previousScrollY = useRef(0)

  useMotionValueEvent(scrollY, 'change', (currentScrollY) => {
    const nextIsHidden = shouldHideHeader({
      previousScrollY: previousScrollY.current,
      scrollY: currentScrollY,
      isHidden,
    })
    previousScrollY.current = currentScrollY
    if (nextIsHidden !== isHidden) setIsHidden(nextIsHidden)
  })

  const isVisible = !isHidden || isMenuOpen
  const closeMenu = () => setIsMenuOpen(false)

  return (
    <motion.header
      initial={false}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
      className={`fixed inset-x-0 top-0 z-[90] bg-white ${isVisible ? '' : 'pointer-events-none'}`}
    >
      <div className="mx-auto flex max-w-[1800px] flex-col px-3 py-5 min-[810px]:px-4">
        <div className="flex w-full items-center justify-center gap-2.5 max-[809px]:h-[47px]">
          <img
            src={avatarUrl}
            alt={header.avatarLabel}
            className="h-[43px] w-[38px] shrink-0 rounded-[49px] bg-black object-cover min-[810px]:size-[57px]"
          />

          <nav aria-label={header.navLabel} className="hidden flex-1 items-center gap-4 min-[810px]:flex">
            {links.map((link) => (
              <NavPill key={link.href} label={link.label} href={link.href} />
            ))}
          </nav>

          <div className={isMenuOpen ? 'order-2' : ''}>
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
