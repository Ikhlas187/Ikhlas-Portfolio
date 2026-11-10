import { Globe } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useLocale } from '@/lib/LocaleProvider'
import { LANGUAGE_SELECT, LOCALES, LOCALE_NAMES } from '@/data/locale'
import { isLocale } from '@/logic/initialLocale/initialLocale'

const ITEMS = LOCALES.map((locale) => ({ value: locale, label: LOCALE_NAMES[locale] }))

/* Sélecteur de langue dans la boîte de la réf. haufsess.com : 200px (166px en mobile), globe, libellé, chevron. */
export default function LanguageSelect() {
  const { locale, setLocale } = useLocale()

  return (
    <Select
      items={ITEMS}
      value={locale}
      modal={false}
      onValueChange={(value) => {
        if (isLocale(value)) setLocale(value)
      }}
    >
      <SelectTrigger
        aria-label={LANGUAGE_SELECT[locale].label}
        className="w-[166px] text-[18px] leading-[1.4] font-medium tracking-[-0.01em] min-[810px]:w-[200px] [&_svg:not([class*='size-'])]:size-6"
      >
        <SelectValue>
          {(value: string) => (
            <>
              <Globe strokeWidth={1.75} aria-hidden="true" />
              {isLocale(value) ? LOCALE_NAMES[value] : value}
            </>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {ITEMS.map((item) => (
          <SelectItem
            key={item.value}
            value={item.value}
            lang={item.value}
            className="text-[18px] leading-[1.4] font-medium tracking-[-0.01em] [&_svg:not([class*='size-'])]:size-6"
          >
            <Globe strokeWidth={1.75} aria-hidden="true" />
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
