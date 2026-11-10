import { Link, useLocation } from 'react-router-dom'
import type { FooterColumn } from '@/data/footer'
import { sectionHref } from '@/logic/sectionHref/sectionHref'

type FooterLinkColumnProps = {
  column: FooterColumn
}

const LINK_CLASS =
  'cursor-pointer font-sans text-[16px] leading-[1.4] font-normal [overflow-wrap:anywhere] text-white/55 transition-colors duration-200 hover:text-white'

export default function FooterLinkColumn({ column }: FooterLinkColumnProps) {
  const isHome = useLocation().pathname === '/'

  return (
    <div className="flex flex-col gap-4">
      <p className="font-sans text-[16px] leading-[1.4] font-medium text-white">{column.title}</p>
      <ul className="flex flex-col gap-3">
        {column.links.map((link) => {
          const href = sectionHref(link.href, isHome)
          return (
            <li key={link.label} className={link.isDesktopOnly ? 'max-[809px]:hidden' : undefined}>
              {/* Depuis une autre page, /#section passe par le routeur : pas de rechargement complet. */}
              {href.startsWith('/') ? (
                <Link to={href} className={LINK_CLASS}>
                  {link.label}
                </Link>
              ) : (
                <a
                  href={href}
                  target={link.isExternal ? '_blank' : undefined}
                  rel={link.isExternal ? 'noreferrer' : undefined}
                  className={LINK_CLASS}
                >
                  {link.label}
                </a>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
