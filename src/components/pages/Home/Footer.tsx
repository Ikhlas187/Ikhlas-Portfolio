import { FaLinkedin } from 'react-icons/fa6'
import BookingCalendar from '@/components/pages/Home/BookingCalendar'
import NameMark from '@/components/pages/Home/NameMark'
import { FOOTER } from '@/data/footer'
import { HERO } from '@/data/hero'
import { SITE } from '@/data/site'
import { useLocale } from '@/lib/LocaleProvider'

const TEXT = 'font-sans text-[20px] leading-[1.2] font-medium tracking-[-0.04em]'
const LINK = `${TEXT} pb-1 tracking-normal underline decoration-2 underline-offset-[6px] cursor-pointer`

/* Footer de la réf. haufsess.com : calendrier à gauche, contact, LinkedIn, nom géant et copyright à droite. */
export default function Footer() {
  const { locale } = useLocale()
  const copy = FOOTER[locale]

  return (
    <footer className="bg-black px-3 pt-20 pb-8 text-white min-[810px]:px-6">
      <div className="mx-auto flex max-w-[1800px] flex-col-reverse gap-12 min-[1200px]:flex-row">
        <div className="h-[575px] w-full max-w-[400px] shrink-0">
          <BookingCalendar />
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <p className={TEXT}>{copy.pitch}</p>
          <p className={`${TEXT} mt-5 max-w-[400px]`}>{copy.contactLine}</p>
          <div className="mt-2 flex flex-wrap gap-[18px]">
            <a href={`mailto:${SITE.email}`} className={LINK}>
              {copy.emailLabel}
            </a>
            <a href={SITE.socials.github} target="_blank" rel="noreferrer" className={LINK}>
              {copy.githubLabel}
            </a>
          </div>
          <a
            href={SITE.socials.linkedin}
            target="_blank"
            rel="noreferrer"
            aria-label={copy.linkedinLabel}
            className="mt-6 flex size-10 cursor-pointer items-center justify-center"
          >
            <FaLinkedin className="size-[18px]" aria-hidden="true" />
          </a>
          <div className="mt-auto pt-[78px]">
            <NameMark name={HERO[locale].name} className="text-white" />
          </div>
          <p className="mt-[61px] font-sans text-[16px] leading-[1.2] font-medium tracking-[-0.05em]">{copy.copyright}</p>
        </div>
      </div>
    </footer>
  )
}
