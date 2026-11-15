import { Globe } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useLocale } from '@/lib/LocaleProvider'
import { LANGUAGE_SELECT, LOCALES, LOCALE_NAMES } from '@/data/locale'
import { isLocale } from '@/logic/initialLocale/initialLocale'

const ITEMS = LOCALES.map((locale) => ({ value: locale, label: LOCALE_NAMES[locale] }))

/* Sélecteur de langue à la place du bouton « Use this template » de callumhayes.framer.website : cadre arrondi de 8 px, plein au survol. */
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
        className="h-[42px] gap-2 rounded-[8px] px-5 py-2.5 font-[family-name:var(--font-nav)] text-[16px] leading-none font-medium tracking-[-0.01em] hover:bg-black hover:text-white data-popup-open:bg-black data-popup-open:text-white [&_svg:not([class*='size-'])]:size-4"
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
            className="font-[family-name:var(--font-nav)] text-[16px] font-medium tracking-[-0.01em] [&_svg:not([class*='size-'])]:size-4"
          >
            <Globe strokeWidth={1.75} aria-hidden="true" />
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
