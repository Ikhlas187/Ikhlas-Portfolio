import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const MotionLink = motion.create(Link)

type NavPillProps = {
  label: string
  href: string
  onNavigate?: () => void
}

/* --pill-hover va de 0 (repos) à 1 (survol) sur le ressort de la réf. : le léger dépassement à la sortie éclaircit la pill un instant. */
export default function NavPill({ label, href, onNavigate }: NavPillProps) {
  return (
    <MotionLink
      to={href}
      onClick={onNavigate}
      initial={{ '--pill-hover': 0 }}
      whileHover={{ '--pill-hover': 1 }}
      whileTap={{ '--pill-hover': 1 }}
      transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
      className="flex cursor-pointer items-center justify-center rounded-[50px] bg-[color-mix(in_srgb,var(--color-black)_clamp(0%,calc(6%_+_94%_*_var(--pill-hover)),100%),var(--color-white))] px-3 py-1.5 font-sans text-[18px] leading-[1.2] font-medium tracking-[-0.05em] whitespace-pre text-[color-mix(in_srgb,var(--color-white)_clamp(0%,calc(100%_*_var(--pill-hover)),100%),var(--color-black))]"
    >
      {label}
    </MotionLink>
  )
}
