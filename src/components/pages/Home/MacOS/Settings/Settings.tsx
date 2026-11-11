import { Languages, Moon, Palette } from 'lucide-react'
import FinderWindow from '@/components/pages/Home/MacOS/FinderWindow'
import type { WindowFrameProps } from '@/components/pages/Home/MacOS/Window'
import { LOCALES, LOCALE_NAMES } from '@/data/locale'
import { MACOS } from '@/data/macos'
import { useLocale } from '@/lib/LocaleProvider'
import { cn } from '@/lib/utils'

type SettingsProps = { frame: WindowFrameProps; isDarkMode: boolean }

const ROW = 'flex items-center gap-[12px] px-[16px] py-[12px]'

export default function Settings({ frame, isDarkMode }: SettingsProps) {
  const { locale, setLocale } = useLocale()
  const texts = MACOS[locale].settings

  return (
    <FinderWindow frame={frame} title={texts.title} isZoomable={false}>
      <div className="absolute inset-0 overflow-y-auto px-[28px] py-[22px]">
        <div className="divide-y divide-(--macos-separator) rounded-[10px] border border-(--macos-separator) bg-(--macos-field)">
          <div className={ROW}>
            <Languages strokeWidth={1.8} className="size-[18px] text-(--macos-icon-settings-from)" />
            <div className="flex-1">
              <p>{texts.language}</p>
              <p className="text-[11px] text-(--macos-text-muted)">{texts.languageHint}</p>
            </div>
            <div
              role="radiogroup"
              aria-label={texts.language}
              className="flex rounded-[7px] bg-(--macos-field) p-[2px]"
            >
              {LOCALES.map((item) => (
                <button
                  key={item}
                  type="button"
                  role="radio"
                  aria-checked={item === locale}
                  onClick={() => setLocale(item)}
                  className={cn(
                    'h-[24px] cursor-pointer rounded-[5px] px-[12px] text-[12px] text-(--macos-text-muted)',
                    item === locale && 'bg-(--macos-selection) text-(--macos-icon-glyph)',
                  )}
                >
                  {LOCALE_NAMES[item]}
                </button>
              ))}
            </div>
          </div>
          <div className={ROW}>
            <Moon strokeWidth={1.8} className="size-[18px] text-(--macos-icon-settings-from)" />
            <p className="flex-1">{texts.appearance}</p>
            <p className="text-(--macos-text-muted)">{isDarkMode ? texts.appearanceValueDark : texts.appearanceValue}</p>
          </div>
          <div className={ROW}>
            <Palette strokeWidth={1.8} className="size-[18px] text-(--macos-icon-settings-from)" />
            <p className="flex-1">{texts.wallpaper}</p>
            <p className="text-(--macos-text-muted)">{texts.wallpaperValue}</p>
          </div>
        </div>
      </div>
    </FinderWindow>
  )
}
