import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useLocale } from '@/lib/LocaleProvider'
import { HEADER } from '@/data/hero'
import { Button } from '@/components/ui/button'

type BurgerButtonProps = {
  isOpen: boolean
  onToggle: () => void
}

export default function BurgerButton({ isOpen, onToggle }: BurgerButtonProps) {
  const { locale } = useLocale()
  const Icon = isOpen ? X : Menu

  return (
    <Button
      variant="plain"
      onClick={onToggle}
      aria-expanded={isOpen}
      aria-controls="home-mobile-nav"
      aria-label={isOpen ? HEADER[locale].closeMenuLabel : HEADER[locale].openMenuLabel}
      className="relative size-8 rounded-none text-black"
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
          <Icon className="size-9" strokeWidth={1.75} aria-hidden="true" />
        </motion.span>
      </AnimatePresence>
    </Button>
  )
}
