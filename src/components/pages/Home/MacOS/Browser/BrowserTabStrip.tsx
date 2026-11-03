import { X } from 'lucide-react'
import { MACOS } from '@/data/macos'
import { useLocale } from '@/lib/LocaleProvider'
import { cn } from '@/lib/utils'

type BrowserTabStripProps = {
  tabs: { id: string; title: string }[]
  activeId: string
  onSelect: (id: string) => void
  onClose: (id: string) => void
}

// Rangée d'onglets, visible dès 2 onglets ; la croix apparaît au survol de l'onglet.
export default function BrowserTabStrip({ tabs, activeId, onSelect, onClose }: BrowserTabStripProps) {
  const { locale } = useLocale()
  const texts = MACOS[locale].browser

  return (
    <div className="flex h-[22.75px] shrink-0 gap-px border-y border-(--macos-frame-line) bg-(--macos-frame-tabs) p-[1.625px]">
      {tabs.map((tab) => (
        <div
          key={tab.id}
          className={cn(
            'group relative flex min-w-0 flex-1 items-center justify-center rounded-[5px] px-[19.5px] text-[9.75px]',
            tab.id === activeId
              ? 'bg-(--macos-frame-surface) shadow-(--macos-frame-control-shadow)'
              : 'text-(--macos-frame-muted) hover:bg-(--macos-frame-hover)',
          )}
        >
          <button
            type="button"
            aria-label={texts.closeTab}
            onClick={() => onClose(tab.id)}
            className="absolute left-[4.875px] hidden cursor-pointer rounded-[3.25px] p-[1.625px] group-hover:block hover:bg-(--macos-frame-hover)"
          >
            <X size={11} />
          </button>
          <button type="button" onClick={() => onSelect(tab.id)} className="min-w-0 cursor-pointer truncate">
            {tab.title}
          </button>
        </div>
      ))}
    </div>
  )
}
