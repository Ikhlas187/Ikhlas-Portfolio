import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useLocale } from '@/lib/LocaleProvider'
import { HEADER } from '@/data/hero'

type BurgerButtonProps = {
  isOpen: boolean
  onToggle: () => void
}

export default function BurgerButton({ isOpen, onToggle }: BurgerButtonProps) {
  const { locale } = useLocale()
  const Icon = isOpen ? X : Menu

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={isOpen}
      aria-controls="home-mobile-nav"
      aria-label={isOpen ? HEADER[locale].closeMenuLabel : HEADER[locale].openMenuLabel}
      className="relative flex size-8 shrink-0 cursor-pointer items-center justify-center text-black"
    >
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={isOpen ? 'close' : 'open'}
          initial={{ opacity: 0, rotate: isOpen ? -45 : 45 }}
          animate={{ opacity: 1, rotate: 0 }}
          exit={{ opacity: 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 60, mass: 1 }}
          className="flex"
        >
          <Icon className="size-7" strokeWidth={1.75} aria-hidden="true" />
        </motion.span>
      </AnimatePresence>
    </button>
  )
}
