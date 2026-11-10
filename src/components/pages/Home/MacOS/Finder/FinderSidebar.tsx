import { AppWindow, CircleArrowDown, Clock, File, Folder, HardDrive, Monitor, type LucideIcon } from 'lucide-react'
import { FINDER_FAVORITES, MACOS, type FinderFavorite, type FinderLocation, type FsFolder } from '@/data/macos'
import { useLocale } from '@/lib/LocaleProvider'
import { cn } from '@/lib/utils'
import { findNode } from '@/logic/macos/fileTree/fileTree'
import { folderLocation, isSameLocation } from '@/logic/macos/finderLocation/finderLocation'

type FinderSidebarProps = {
  root: FsFolder
  current: FinderLocation
  onSelect: (location: FinderLocation) => void
}

const FAVORITE_ICONS: Record<FinderFavorite['id'], LucideIcon> = {
  recents: Clock,
  applications: AppWindow,
  desktop: Monitor,
  documents: File,
  downloads: CircleArrowDown,
  projects: Folder,
  certifications: Folder,
}

type SidebarEntry = { key: string; location: FinderLocation; label: string; Icon: LucideIcon; isDisk?: boolean }

export default function FinderSidebar({ root, current, onSelect }: FinderSidebarProps) {
  const { locale } = useLocale()
  const texts = MACOS[locale].finder

  const labelFor = (location: FinderLocation) => {
    if (location.kind === 'recents') return texts.recents
    if (location.kind === 'applications') return texts.applications
    return findNode(root, location.path)?.name ?? ''
  }

  const sections: { heading: string; entries: SidebarEntry[] }[] = [
    {
      heading: texts.favorites,
      entries: FINDER_FAVORITES.map((favorite) => ({
        key: favorite.id,
        location: favorite.location,
        label: labelFor(favorite.location),
        Icon: FAVORITE_ICONS[favorite.id],
      })),
    },
    {
      heading: texts.locations,
      entries: [{ key: 'disk', location: folderLocation([]), label: texts.macintoshHd, Icon: HardDrive, isDisk: true }],
    },
  ]

  return (
    <nav className="flex flex-col gap-[10px] pt-[2px] text-(--macos-finder-text)">
      {sections.map(({ heading, entries }) => (
        <div key={heading} className="flex flex-col">
          <p className="px-[6px] pb-[3px] text-[11px] leading-[16px] font-semibold text-(--macos-finder-heading)">
            {heading}
          </p>
          {entries.map(({ key, location, label, Icon, isDisk }) => {
            const isCurrent = isSameLocation(location, current)
            return (
              <button
                key={key}
                type="button"
                aria-current={isCurrent ? 'page' : undefined}
                onClick={() => onSelect(location)}
                className={cn(
                  'flex h-[28px] cursor-pointer items-center gap-[7px] rounded-[6px] px-[8px] text-left text-[13px]',
                  isCurrent && 'bg-(--macos-finder-sidebar-selected)',
                )}
              >
                <Icon
                  strokeWidth={1.8}
                  className={cn(
                    'size-[16px] shrink-0',
                    isDisk ? 'text-(--macos-finder-tool)' : 'text-(--macos-finder-accent)',
                  )}
                />
                <span className="truncate">{label}</span>
              </button>
            )
          })}
        </div>
      ))}
    </nav>
  )
}
