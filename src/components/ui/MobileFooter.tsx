import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Mail } from 'lucide-react'
import { FaLinkedinIn } from 'react-icons/fa6'
import { SiGithub } from 'react-icons/si'
import CallWidget from '@/components/ui/CallWidget'
import { FOOTER } from '@/data/footer'
import { HERO } from '@/data/hero'
import { ROUTES } from '@/data/routes'
import { SITE } from '@/data/site'
import { useLocale } from '@/lib/LocaleProvider'
import { sectionHref } from '@/logic/sectionHref/sectionHref'

// Logos de marque des réseaux (react-icons, comme le Dock du Mac) et icône lucide pour l'e-mail.
const SOCIAL_LOGOS = [
  { href: SITE.socials.github, Logo: SiGithub },
  { href: SITE.socials.linkedin, Logo: FaLinkedinIn },
  { href: `mailto:${SITE.email}`, Logo: Mail },
]

const LINK_CLASS =
  'cursor-pointer font-sans text-[14px] leading-[1.5] font-light [overflow-wrap:anywhere] text-white/65 transition-colors hover:text-white'

// Footer mobile (réf. cashless.africa) : rendez-vous, puis bloc noir avec nom, réseaux, rubriques et copyright.
export default function MobileFooter() {
  const { locale } = useLocale()
  const copy = FOOTER[locale]
  const { pathname } = useLocation()
  const isHome = pathname === '/'
  const navigate = useNavigate()
  const columns = copy.columns.filter((column) => !column.links.some((link) => link.isExternal))
  const socialLabels = copy.columns.flatMap((column) => column.links).filter((link) => link.isExternal)
  const socialLinks = SOCIAL_LOGOS.map((social) => ({
    ...social,
    label: socialLabels.find((link) => link.href === social.href)?.label ?? SITE.email,
  }))

  return (
    <footer id="contact">
      <div className="flex flex-col items-center gap-6 bg-white px-3 pt-12 pb-12 text-black">
        <h2 className="text-center font-heading text-[28px] leading-[1.2] font-normal tracking-[-0.02em]">{copy.callTitle}</h2>
        <CallWidget onAccept={() => navigate(ROUTES.BOOKING, { state: { from: pathname } })} />
      </div>
      <div className="bg-black px-6 pt-16 pb-24 text-white">
        <p className="font-heading text-[32px] leading-none tracking-[-0.04em]">{HERO[locale].name}</p>
        <ul className="mt-6 flex items-center gap-5">
          {socialLinks.map(({ href, label, Logo }) => (
            <li key={href}>
              <a
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel={href.startsWith('http') ? 'noreferrer' : undefined}
                aria-label={label}
                className="flex cursor-pointer text-white/50 transition-colors hover:text-white"
              >
                <Logo aria-hidden="true" className="size-[18px]" />
              </a>
            </li>
          ))}
        </ul>
        <div className="mt-16 flex flex-col gap-10">
          {columns.map((column) => (
            <div key={column.title} className="flex flex-col gap-4">
              <p className="font-sans text-[11px] leading-none font-semibold tracking-[0.08em] text-white/35 uppercase">
                {column.title}
              </p>
              <ul className="flex flex-col gap-2">
                {column.links
                  .filter((link) => !link.isDesktopOnly)
                  .map((link) => {
                    const href = sectionHref(link.href, isHome)
                    return (
                      <li key={link.label}>
                        {href.startsWith('/') ? (
                          <Link to={href} className={LINK_CLASS}>
                            {link.label}
                          </Link>
                        ) : (
                          <a href={href} className={LINK_CLASS}>
                            {link.label}
                          </a>
                        )}
                      </li>
                    )
                  })}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col gap-3 font-sans text-[11px] leading-[1.5] text-white/45">
          <p>{copy.copyright}</p>
          <p>{copy.credit}</p>
        </div>
      </div>
    </footer>
  )
}
