import { MACOS } from '@/data/macos'
import { useLocale } from '@/lib/LocaleProvider'

export default function BrowserNotFoundPage() {
  const { locale } = useLocale()
  const texts = MACOS[locale].browser

  return (
    <div className="flex min-h-full flex-col items-center justify-center gap-[10px] bg-black text-white">
      <p className="font-heading text-[96px] leading-none text-(--color-accent)">404</p>
      <h2 className="[font-family:inherit] text-[20px] font-bold">{texts.notFoundTitle}</h2>
      <p className="text-[14px] text-(--color-gray-600)">{texts.notFoundBody}</p>
    </div>
  )
}
