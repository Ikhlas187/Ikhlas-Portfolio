import type { MouseEvent } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import FileIcon from '@/components/pages/Home/MacOS/FileIcon'
import { MACOS } from '@/data/macos'
import { useLocale } from '@/lib/LocaleProvider'
import { cn } from '@/lib/utils'
import { formatFileSize } from '@/logic/macos/fileSize/fileSize'
import type { FinderItem, SortColumn, SortOrder } from '@/logic/macos/finderItems/finderItems'

type FinderListProps = {
  items: FinderItem[]
  selectedKey: string | null
  sortOrder: SortOrder
  onSort: (column: SortColumn) => void
  onSelect: (key: string) => void
  onOpen: (item: FinderItem) => void
  onContextMenu: (item: FinderItem, event: MouseEvent<HTMLElement>) => void
}

const COLUMNS = 'grid grid-cols-[minmax(0,1fr)_98px_116px_150px]'
const SORT_COLUMNS: SortColumn[] = ['name', 'size', 'kind', 'dateAdded']
// Comme le Finder, les rayures continuent sous le dernier élément jusqu'en bas de la fenêtre.
const MIN_ROWS = 18

export default function FinderList({ items, selectedKey, sortOrder, onSort, onSelect, onOpen, onContextMenu }: FinderListProps) {
  const { locale } = useLocale()
  const texts = MACOS[locale].finder
  const SortIcon = sortOrder.isAscending ? ChevronUp : ChevronDown
  const fillerCount = Math.max(0, MIN_ROWS - items.length)

  return (
    <div className="flex min-w-[520px] flex-col text-(--macos-finder-text)">
      <div
        className={cn(
          COLUMNS,
          'sticky top-0 z-10 h-[26px] border-b border-(--macos-finder-separator) bg-(--macos-finder-window) pr-[10px] pl-[10px] text-[12px]',
        )}
      >
        {SORT_COLUMNS.map((column, index) => {
          const isSorted = sortOrder.column === column
          return (
            <button
              key={column}
              type="button"
              onClick={() => onSort(column)}
              aria-sort={isSorted ? (sortOrder.isAscending ? 'ascending' : 'descending') : undefined}
              className={cn(
                'flex min-w-0 cursor-pointer items-center justify-between gap-[4px] pr-[8px] text-left text-(--macos-finder-text-muted)',
                index === 0 ? 'pl-[38px]' : 'border-l border-(--macos-finder-separator) pl-[7px]',
                'my-[5px]',
                isSorted && 'font-semibold text-(--macos-finder-text)',
              )}
            >
              <span className="truncate">{texts.columns[column]}</span>
              {isSorted && <SortIcon strokeWidth={2.2} className="size-[11px] shrink-0 text-(--macos-finder-text-muted)" />}
            </button>
          )
        })}
      </div>
      <ul className="px-[10px] pt-[4px]">
        {items.map((item, index) => {
          const isSelected = item.key === selectedKey
          return (
            <li key={item.key}>
              <button
                type="button"
                onClick={() => onSelect(item.key)}
                onDoubleClick={() => onOpen(item)}
                onContextMenu={(event) => onContextMenu(item, event)}
                onKeyDown={(event) => event.key === 'Enter' && onOpen(item)}
                className={cn(
                  COLUMNS,
                  'h-[20px] w-full cursor-pointer items-center rounded-[5px] text-left text-[13px] leading-[16px] outline-none',
                  index % 2 === 1 && 'bg-(--macos-finder-stripe)',
                  isSelected && 'bg-(--macos-finder-selection) text-(--macos-finder-selection-text)',
                )}
              >
                <span className="flex min-w-0 items-center gap-[6px] pl-[16px]">
                  <span className="flex size-[16px] shrink-0">
                    <FileIcon item={item} />
                  </span>
                  <span className="truncate">{item.name}</span>
                </span>
                <span className={cn('pl-[8px] text-(--macos-finder-text-muted)', isSelected && 'text-inherit')}>
                  {formatFileSize(item.sizeInBytes, texts.sizeUnits)}
                </span>
                <span className={cn('truncate pl-[8px] text-(--macos-finder-text-muted)', isSelected && 'text-inherit')}>
                  {texts.kinds[item.kind]}
                </span>
                <span className={cn('truncate pl-[8px] text-(--macos-finder-text-muted)', isSelected && 'text-inherit')}>
                  {item.dateAdded}
                </span>
              </button>
            </li>
          )
        })}
        {Array.from({ length: fillerCount }, (_, offset) => (
          <li
            key={`filler-${offset}`}
            aria-hidden="true"
            className={cn('h-[20px] rounded-[5px]', (items.length + offset) % 2 === 1 && 'bg-(--macos-finder-stripe)')}
          />
        ))}
      </ul>
    </div>
  )
}
