import FileIcon from '@/components/pages/Home/MacOS/FileIcon'
import { cn } from '@/lib/utils'
import type { FinderItem } from '@/logic/macos/finderItems/finderItems'

type FinderGridProps = {
  items: FinderItem[]
  selectedKey: string | null
  onSelect: (key: string) => void
  onOpen: (item: FinderItem) => void
}

export default function FinderGrid({ items, selectedKey, onSelect, onOpen }: FinderGridProps) {
  return (
    <ul className="grid grid-cols-[repeat(auto-fill,112px)] content-start justify-between gap-x-[12px] gap-y-[14px] px-[16px] pt-[24px] pb-[16px]">
      {items.map((item) => {
        const isSelected = item.key === selectedKey
        return (
          <li key={item.key}>
            <button
              type="button"
              onClick={() => onSelect(item.key)}
              onDoubleClick={() => onOpen(item)}
              onKeyDown={(event) => event.key === 'Enter' && onOpen(item)}
              className="flex w-full cursor-pointer flex-col items-center gap-[4px] outline-none"
            >
              <span
                className={cn(
                  'flex size-[72px] items-center justify-center rounded-[7px] p-[4px]',
                  isSelected && 'bg-(--macos-finder-icon-selected)',
                )}
              >
                <FileIcon item={item} />
              </span>
              <span
                className={cn(
                  'line-clamp-2 max-w-full rounded-[4px] px-[4px] text-center text-[12px] leading-[16px] break-words',
                  isSelected && 'bg-(--macos-finder-selection) text-(--macos-finder-selection-text)',
                )}
              >
                {item.name}
              </span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}
