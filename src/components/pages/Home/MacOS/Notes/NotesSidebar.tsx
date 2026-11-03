import { useState } from 'react'
import { Folder, Inbox, Plus } from 'lucide-react'
import { MACOS } from '@/data/macos'
import { useLocale } from '@/lib/LocaleProvider'
import { cn } from '@/lib/utils'
import { ALL_NOTES } from '@/logic/macos/notesBook/notesBook'

type NotesSidebarProps = {
  folders: { id: string; label: string; count: number }[]
  active: string
  onSelect: (id: string) => void
  onAddFolder: (name: string) => void
}

// Panneau de verre détaché du bord (m-2, rayon 18 px) ; son ombre de 8 px peint la marge, les 2 congés ferment les coins côté liste.
const GLASS_PANEL =
  'relative m-[6.5px] flex w-[208px] shrink-0 flex-col rounded-[18px] bg-(--macos-frame-sidebar) shadow-(--macos-frame-sidebar-shadow) backdrop-blur-[40px] backdrop-brightness-[1.04] backdrop-saturate-[1.9]'
const CORNER_FILLERS =
  'before:pointer-events-none before:absolute before:top-[-8px] before:left-[calc(100%-18px)] before:size-[26px] before:bg-[radial-gradient(circle_at_0_100%,transparent_25px,var(--macos-frame-surface)_25.5px)] after:pointer-events-none after:absolute after:bottom-[-8px] after:left-[calc(100%-18px)] after:size-[26px] after:bg-[radial-gradient(circle_at_0_0,transparent_25px,var(--macos-frame-surface)_25.5px)]'

export default function NotesSidebar({ folders, active, onSelect, onAddFolder }: NotesSidebarProps) {
  const { locale } = useLocale()
  const texts = MACOS[locale].notes
  const [newFolder, setNewFolder] = useState<string | null>(null)

  return (
    <nav data-window-drag className={cn(GLASS_PANEL, CORNER_FILLERS)}>
      <div className="flex min-h-0 flex-1 flex-col gap-[11.375px] overflow-y-auto px-[6.5px] pt-[42px] pb-[6.5px]">
        <div className="flex flex-col gap-px">
          <h3 className="px-[6.5px] pb-[1.625px] text-[11px] leading-[1.5] font-semibold text-(--macos-frame-muted)">{texts.onMyMac}</h3>
          {folders.map((folder) => {
            const Icon = folder.id === ALL_NOTES ? Inbox : Folder
            return (
              <button
                key={folder.id}
                type="button"
                onClick={() => onSelect(folder.id)}
                className={cn(
                  'flex h-[22.75px] w-full cursor-pointer items-center gap-[6.5px] rounded-[9px] px-[6.5px] text-left',
                  active === folder.id && 'bg-(--macos-frame-selected)',
                )}
              >
                <Icon className="size-[13px] shrink-0 text-(--macos-notes-amber)" />
                <span className="flex-1 truncate">{folder.label}</span>
                <span className="text-[9.75px] text-(--macos-frame-muted)">{folder.count}</span>
              </button>
            )
          })}
        </div>
        <div className="mt-auto">
          {newFolder === null ? (
            <button
              type="button"
              onClick={() => setNewFolder('')}
              className="flex cursor-pointer items-center gap-[4.875px] px-[6.5px] py-[3.25px] text-(--macos-frame-muted) hover:text-(--macos-frame-fg)"
            >
              <Plus size={15} /> {texts.newFolder}
            </button>
          ) : (
            <input
              autoFocus
              aria-label={texts.folderName}
              placeholder={texts.folderName}
              value={newFolder}
              onChange={(event) => setNewFolder(event.target.value)}
              onBlur={() => setNewFolder(null)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && newFolder.trim()) onAddFolder(newFolder)
                if (event.key === 'Enter' || event.key === 'Escape') setNewFolder(null)
              }}
              style={{ outline: 'none' }}
              className="h-[22px] w-full rounded-[6px] bg-(--macos-frame-surface) px-[6.5px] shadow-(--macos-frame-field-shadow) transition-shadow duration-150 select-text focus:shadow-(--macos-frame-field-focus)"
            />
          )}
        </div>
      </div>
    </nav>
  )
}
