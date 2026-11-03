import { useMemo, useState } from 'react'
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  CircleEllipsis,
  Grid3x2,
  LayoutGrid,
  List,
  Share,
  Tag,
} from 'lucide-react'
import FinderGrid from '@/components/pages/Home/MacOS/Finder/FinderGrid'
import FinderList from '@/components/pages/Home/MacOS/Finder/FinderList'
import FinderSearch from '@/components/pages/Home/MacOS/Finder/FinderSearch'
import FinderSidebar from '@/components/pages/Home/MacOS/Finder/FinderSidebar'
import { useMacFiles } from '@/components/pages/Home/MacOS/useMacFiles'
import Window, { type WindowFrameProps } from '@/components/pages/Home/MacOS/Window'
import { GIANT_SUR, type DockApp } from '@/data/giantSur'
import { DESKTOP_PATH, FILE_TREE_YEAR, MACOS, type FinderLocation, type FinderViewMode } from '@/data/macos'
import { useLocale } from '@/lib/LocaleProvider'
import { cn } from '@/lib/utils'
import { findNode } from '@/logic/macos/fileTree/fileTree'
import {
  DEFAULT_SORT_ORDER,
  appItem,
  filterItemsByName,
  nextSortOrder,
  nodeItem,
  sortItems,
  type FinderItem,
  type SortColumn,
} from '@/logic/macos/finderItems/finderItems'
import { folderLocation } from '@/logic/macos/finderLocation/finderLocation'
import {
  canGoBack,
  canGoForward,
  createHistory,
  currentEntry,
  goBack,
  goForward,
  pushEntry,
} from '@/logic/macos/navigationHistory/navigationHistory'

type FinderProps = {
  frame: WindowFrameProps
  viewMode: FinderViewMode
  recents: string[][]
  onViewModeChange: (viewMode: FinderViewMode) => void
  onOpenFile: (path: string[]) => void
  onOpenApp: (app: DockApp) => void
}

const TOOL_BUTTON =
  'flex h-[28px] cursor-pointer items-center justify-center gap-[2px] rounded-[6px] px-[6px] text-(--macos-finder-tool) hover:bg-(--macos-finder-hover) disabled:cursor-default disabled:opacity-40 disabled:hover:bg-transparent'

export default function Finder({ frame, viewMode, recents, onViewModeChange, onOpenFile, onOpenApp }: FinderProps) {
  const { locale } = useLocale()
  const texts = MACOS[locale].finder
  const dockItems = GIANT_SUR[locale].dockItems
  const root = useMacFiles()
  const [history, setHistory] = useState(() =>
    createHistory<FinderLocation>(folderLocation(frame.window.payload.path ?? DESKTOP_PATH)),
  )
  const [selectedKey, setSelectedKey] = useState<string | null>(null)
  const [sortOrder, setSortOrder] = useState(DEFAULT_SORT_ORDER)
  const [query, setQuery] = useState('')

  const location = currentEntry(history)

  const locationItems = useMemo((): FinderItem[] => {
    if (location.kind === 'applications') {
      return dockItems.flatMap((dockItem) =>
        dockItem.app ? [appItem(dockItem.app, dockItem.title, dockItem.logo, FILE_TREE_YEAR)] : [],
      )
    }
    if (location.kind === 'recents') {
      return recents.flatMap((path) => {
        const node = findNode(root, path)
        return node ? [nodeItem(node, path)] : []
      })
    }
    const folder = findNode(root, location.path)
    if (folder?.kind !== 'folder') return []
    return folder.children.map((child) => nodeItem(child, [...location.path, child.id]))
  }, [location, dockItems, recents, root])

  const items = useMemo(
    () => sortItems(filterItemsByName(locationItems, query), sortOrder, texts.kinds),
    [locationItems, query, sortOrder, texts.kinds],
  )

  const title =
    location.kind === 'recents'
      ? texts.recents
      : location.kind === 'applications'
        ? texts.applications
        : location.path.length === 0
          ? texts.macintoshHd
          : (findNode(root, location.path)?.name ?? '')

  const goTo = (next: FinderLocation) => {
    setHistory((current) => pushEntry(current, next))
    setSelectedKey(null)
    setQuery('')
  }

  const step = (move: typeof goBack<FinderLocation>) => {
    setHistory((current) => move(current))
    setSelectedKey(null)
    setQuery('')
  }

  const openItem = (item: FinderItem) => {
    if (item.kind === 'app') onOpenApp(item.app)
    else if (item.node.kind === 'folder') goTo(folderLocation(item.path))
    else onOpenFile(item.path)
  }

  const sortBy = (column: SortColumn) => setSortOrder((current) => nextSortOrder(current, column))

  const ViewIcon = viewMode === 'icons' ? LayoutGrid : List
  const nextViewMode = viewMode === 'icons' ? 'list' : 'icons'
  const hasSelection = selectedKey !== null && items.some((item) => item.key === selectedKey)

  return (
    <Window
      {...frame}
      title={title}
      className="border-(--macos-finder-window-border) bg-(--macos-finder-glass) text-(--macos-finder-text)"
      sidebarClassName="w-[152px] border-(--macos-finder-separator) bg-(--macos-finder-sidebar)"
      titleBarClassName="gap-[8px] border-transparent bg-(--macos-finder-window) pr-[12px] pl-[14px]"
      contentClassName="bg-(--macos-finder-window)"
      sidebar={<FinderSidebar root={root} current={location} onSelect={goTo} />}
      toolbar={
        <div className="flex min-w-0 flex-1 items-center gap-[6px]">
          <button
            type="button"
            aria-label={texts.back}
            disabled={!canGoBack(history)}
            onClick={() => step(goBack)}
            className={cn(TOOL_BUTTON, 'w-[28px] px-0')}
          >
            <ChevronLeft strokeWidth={1.8} className="size-[20px]" />
          </button>
          <button
            type="button"
            aria-label={texts.forward}
            disabled={!canGoForward(history)}
            onClick={() => step(goForward)}
            className={cn(TOOL_BUTTON, 'w-[28px] px-0')}
          >
            <ChevronRight strokeWidth={1.8} className="size-[20px]" />
          </button>
          <p className="ml-[4px] min-w-0 flex-1 truncate text-[15px] font-bold text-(--macos-finder-text)">{title}</p>
          <button
            type="button"
            aria-label={texts.changeView}
            title={texts.changeView}
            onClick={() => onViewModeChange(nextViewMode)}
            className={cn(TOOL_BUTTON, 'mr-[30px]')}
          >
            <ViewIcon strokeWidth={1.7} className="size-[17px]" />
            <ChevronsUpDown strokeWidth={1.8} className="size-[12px]" />
          </button>
          <span aria-hidden="true" className={cn(TOOL_BUTTON, 'cursor-default hover:bg-transparent')}>
            <Grid3x2 strokeWidth={1.7} className="size-[17px]" />
            <ChevronDown strokeWidth={2} className="size-[11px]" />
          </span>
          <button type="button" aria-label={texts.share} disabled={!hasSelection} className={TOOL_BUTTON}>
            <Share strokeWidth={1.7} className="size-[17px]" />
          </button>
          <button type="button" aria-label={texts.tags} disabled={!hasSelection} className={TOOL_BUTTON}>
            <Tag strokeWidth={1.7} className="size-[17px]" />
          </button>
          <span aria-hidden="true" className={cn(TOOL_BUTTON, 'cursor-default hover:bg-transparent')}>
            <CircleEllipsis strokeWidth={1.7} className="size-[18px]" />
            <ChevronDown strokeWidth={2} className="size-[11px]" />
          </span>
          <span className="ml-[16px] flex">
            <FinderSearch
              label={texts.search}
              clearLabel={texts.clearSearch}
              query={query}
              onQueryChange={setQuery}
              buttonClassName={cn(TOOL_BUTTON, 'w-[30px] px-0')}
            />
          </span>
        </div>
      }
    >
      <div
        className="absolute inset-0 overflow-auto"
        onClick={(event) => !(event.target as HTMLElement).closest('button') && setSelectedKey(null)}
      >
        {viewMode === 'icons' ? (
          <FinderGrid items={items} selectedKey={selectedKey} onSelect={setSelectedKey} onOpen={openItem} />
        ) : (
          <FinderList
            items={items}
            selectedKey={selectedKey}
            sortOrder={sortOrder}
            onSort={sortBy}
            onSelect={setSelectedKey}
            onOpen={openItem}
          />
        )}
      </div>
    </Window>
  )
}
