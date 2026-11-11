import { ABOUT } from '@/data/about'
import { MACOS } from '@/data/macos'
import { useLocale } from '@/lib/LocaleProvider'
import { segmentText } from '@/logic/macos/aboutSegment/aboutSegment'

export default function BrowserAboutPage() {
  const { locale } = useLocale()
  const about = ABOUT[locale]

  return (
    <article className="min-h-full bg-(--color-white) px-[72px] py-[48px] text-black">
      <p className="text-[12px] tracking-[0.14em] text-(--color-accent) uppercase">{about.kicker}</p>
      <h1 className="mt-[6px] font-heading text-[56px] leading-[0.95]">{MACOS[locale].browser.aboutTitle}</h1>
      <div className="mt-[24px] flex max-w-[680px] flex-col gap-[14px] text-[15px] leading-[1.65]">
        {about.paragraphs.map((paragraph, index) => (
          <p key={index}>{paragraph.map(segmentText).join('')}</p>
        ))}
      </div>
    </article>
  )
}
