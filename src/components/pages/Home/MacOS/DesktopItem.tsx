import type { MouseEvent } from 'react'
import FileIcon from '@/components/pages/Home/MacOS/FileIcon'
import { cn } from '@/lib/utils'
import type { FinderNodeItem } from '@/logic/macos/finderItems/finderItems'

type DesktopItemProps = {
  item: FinderNodeItem
  isSelected: boolean
  onClick: (event: MouseEvent<HTMLElement>) => void
  onOpen: () => void
}

export default function DesktopItem({ item, isSelected, onClick, onOpen }: DesktopItemProps) {
  return (
    <button
      type="button"
      className="my-2 flex w-32 cursor-pointer flex-col items-center p-1"
      onClick={onClick}
      onDoubleClick={onOpen}
      onKeyDown={(event) => event.key === 'Enter' && onOpen()}
    >
      <div
        className={cn(
          'rounded-[0.375rem] border-2 px-1 py-2',
          isSelected ? 'border-(--color-giantsur-gray-500) bg-(--color-giantsur-gray-900)/30' : 'border-transparent',
        )}
      >
        <FileIcon item={item} className="size-14" />
      </div>
      {/* Le reset global impose aux h3 police, interlignage et approche du portfolio : on les annule ici. */}
      <h3
        className={cn(
          'mt-0.5 rounded-[0.375rem] px-2 py-0.5 text-center [font-family:inherit] text-[0.75rem]/[1rem] font-bold tracking-normal whitespace-nowrap text-(--color-giantsur-white) [text-shadow:var(--giantsur-text-shadow)] select-none',
          isSelected && 'bg-(--color-giantsur-blue-700)',
        )}
      >
        {item.name}
      </h3>
    </button>
  )
}
