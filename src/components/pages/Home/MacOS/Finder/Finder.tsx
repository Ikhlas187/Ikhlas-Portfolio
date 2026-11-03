import { useEffect, useMemo, useState, type MouseEvent } from 'react'
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
import FinderStatus from '@/components/pages/Home/MacOS/Finder/FinderStatus'
import { useMacRepos, type LoadStatus } from '@/components/pages/Home/MacOS/MacReposProvider'
import { useMacFiles } from '@/components/pages/Home/MacOS/useMacFiles'
import Window, { type WindowFrameProps } from '@/components/pages/Home/MacOS/Window'
import { GIANT_SUR, type DockApp } from '@/data/giantSur'
import { DESKTOP_PATH, FILE_TREE_YEAR, MACOS, PROJECTS_PATH, type FinderLocation, type FinderViewMode } from '@/data/macos'
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
import type { RepoSummary } from '@/types/repo'

type FinderProps = {
  frame: WindowFrameProps
  viewMode: FinderViewMode
  recents: string[][]
  onViewModeChange: (viewMode: FinderViewMode) => void
  onOpenFile: (path: string[]) => void
  onOpenApp: (app: DockApp) => void
  onRepoContextMenu: (repo: RepoSummary, event: MouseEvent<HTMLElement>) => void
}

const TOOL_BUTTON =
  'flex h-[28px] cursor-pointer items-center justify-center gap-[2px] rounded-[6px] px-[6px] text-(--macos-finder-tool) hover:bg-(--macos-finder-hover) disabled:cursor-default disabled:opacity-40 disabled:hover:bg-transparent'

// Dossier d'un repo dans Bureau/Projets/<repo>/… : son nom, sinon null.
function repoNameAt(location: FinderLocation) {
  if (location.kind !== 'folder' || location.path.length < 3) return null
  const isInProjects = PROJECTS_PATH.every((id, index) => location.path[index] === id)
  return isInProjects ? location.path[PROJECTS_PATH.length] : null
}

export default function Finder({
  frame,
  viewMode,
  recents,
  onViewModeChange,
  onOpenFile,
  onOpenApp,
  onRepoContextMenu,
}: FinderProps) {
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
  const repos = useMacRepos()
  const { requestRepo } = repos
  const repoName = repoNameAt(location)
  const isProjectsFolder = location.kind === 'folder' && location.path.join('/') === PROJECTS_PATH.join('/')

  useEffect(() => {
    if (repoName) requestRepo(repoName)
  }, [repoName, requestRepo])

  const loadStatus: LoadStatus = repoName
    ? (repos.repoStatus(repoName) ?? 'loading')
    : isProjectsFolder
      ? repos.indexStatus
      : 'ready'

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
          : (findNode(root, location.path)?.name ?? location.path.at(-1) ?? '')

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

  const showContextMenu = (item: FinderItem, event: MouseEvent<HTMLElement>) => {
    if (item.kind === 'app' || item.node.kind !== 'folder' || !item.node.repo) return
    setSelectedKey(item.key)
    onRepoContextMenu(item.node.repo.summary, event)
  }

  const sortBy = (column: SortColumn) => setSortOrder((current) => nextSortOrder(current, column))

  const ViewIcon = viewMode === 'icons' ? LayoutGrid : List
  const nextViewMode = viewMode === 'icons' ? 'list' : 'icons'
  const hasSelection = selectedKey !== null && items.some((item) => item.key === selectedKey)

  return (
    <Window
      {...frame}
      title={title}
      sidebarClassName="w-[152px] bg-(--macos-finder-sidebar)"
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
        {loadStatus !== 'ready' ? (
          <FinderStatus
            status={loadStatus}
            onRetry={() => (repoName ? requestRepo(repoName) : repos.reloadIndex())}
          />
        ) : viewMode === 'icons' ? (
          <FinderGrid
            items={items}
            selectedKey={selectedKey}
            onSelect={setSelectedKey}
            onOpen={openItem}
            onContextMenu={showContextMenu}
          />
        ) : (
          <FinderList
            items={items}
            selectedKey={selectedKey}
            sortOrder={sortOrder}
            onSort={sortBy}
            onSelect={setSelectedKey}
            onOpen={openItem}
            onContextMenu={showContextMenu}
          />
        )}
      </div>
    </Window>
  )
}
