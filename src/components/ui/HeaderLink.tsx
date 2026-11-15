import { Link, useLocation } from 'react-router-dom'
import { sectionHref } from '@/logic/sectionHref/sectionHref'

type HeaderLinkProps = {
  label: string
  href: string
  className?: string
  onNavigate?: () => void
}

/* Lien texte du header (réf. callumhayes.framer.website) : gris, plus clair au survol. */
export default function HeaderLink({ label, href, className = '', onNavigate }: HeaderLinkProps) {
  const target = sectionHref(href, useLocation().pathname === '/')
  const classes = `cursor-pointer text-[color-mix(in_srgb,var(--color-black)_72%,transparent)] transition-colors duration-200 hover:text-[color-mix(in_srgb,var(--color-black)_45%,transparent)] ${className}`

  // Sur la home, #section reste une ancre : Lenis la fait défiler en douceur (LenisProvider).
  if (target.startsWith('#')) {
    return (
      <a href={target} onClick={onNavigate} className={classes}>
        {label}
      </a>
    )
  }
  return (
    <Link to={target} onClick={onNavigate} className={classes}>
      {label}
    </Link>
  )
}
