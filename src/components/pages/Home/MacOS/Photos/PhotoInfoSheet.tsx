import type { PhotoItem } from '@/components/pages/Home/MacOS/Photos/Photos'
import { MACOS } from '@/data/macos'
import { useLocale } from '@/lib/LocaleProvider'
import { cn } from '@/lib/utils'

type PhotoInfoSheetProps = { item: PhotoItem; onClose: () => void }

export default function PhotoInfoSheet({ item, onClose }: PhotoInfoSheetProps) {
  const { locale } = useLocale()
  const texts = MACOS[locale].photos
  const rows = [
    { label: texts.album, value: item.album },
    { label: texts.file, value: item.fileName },
  ]

  return (
    <div className="absolute inset-0 z-20 flex cursor-pointer items-end bg-(--macos-app-scrim)" onClick={onClose}>
      <div
        onClick={(event) => event.stopPropagation()}
        className="w-full cursor-default rounded-t-[16px] bg-(--macos-photos-sheet) pt-[12px] pb-[32px] text-(--macos-photos-text) shadow-(--macos-app-sheet-shadow)"
      >
        <div className="mx-auto mb-[8px] h-[4px] w-[36px] rounded-full bg-(--macos-photos-handle)" />
        <div className="flex items-center justify-between px-[16px] pb-[8px]">
          <h2 className="text-[15px] leading-normal font-semibold">{texts.info}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={texts.closeInfo}
            className="cursor-pointer text-[13px] font-medium text-(--macos-photos-link)"
          >
            {texts.done}
          </button>
        </div>
        <div className="mx-[16px] mb-[12px] rounded-[12px] bg-(--macos-photos-fill) px-[16px] py-[12px]">
          <p className="text-[13px] leading-relaxed text-(--macos-photos-text-80)">{item.alt}</p>
        </div>
        <div className="mx-[16px] overflow-hidden rounded-[12px] bg-(--macos-photos-fill)">
          {rows.map((row, index) => (
            <div
              key={row.label}
              className={cn(
                'flex items-center justify-between px-[16px] py-[12px]',
                index < rows.length - 1 && 'border-b border-(--macos-photos-line)',
              )}
            >
              <span className="text-[13px] text-(--macos-photos-text-60)">{row.label}</span>
              <span className="max-w-[65%] truncate text-[13px]">{row.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
