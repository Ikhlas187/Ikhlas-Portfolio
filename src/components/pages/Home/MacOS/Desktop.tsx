import { useCallback, useEffect, useMemo, useReducer, useRef, useState, type MouseEvent } from 'react'
import { AnimatePresence, useReducedMotion } from 'framer-motion'
import AboutThisMac from '@/components/pages/Home/MacOS/AboutThisMac'
import Browser from '@/components/pages/Home/MacOS/Browser/Browser'
import Calendar from '@/components/pages/Home/MacOS/Calendar/Calendar'
import ControlCenter, { type ControlCenterSettings } from '@/components/pages/Home/MacOS/ControlCenter'
import DesktopIcons from '@/components/pages/Home/MacOS/DesktopIcons'
import Dock from '@/components/pages/Home/MacOS/Dock'
import Finder from '@/components/pages/Home/MacOS/Finder/Finder'
import Mail from '@/components/pages/Home/MacOS/Mail/Mail'
import MenuBar from '@/components/pages/Home/MacOS/MenuBar'
import Messages from '@/components/pages/Home/MacOS/Messages/Messages'
import Music from '@/components/pages/Home/MacOS/Music/Music'
import Notes from '@/components/pages/Home/MacOS/Notes/Notes'
import Photos from '@/components/pages/Home/MacOS/Photos/Photos'
import Preview from '@/components/pages/Home/MacOS/Preview/Preview'
import RepoContextMenu, { REPO_CONTEXT_MENU_SIZE } from '@/components/pages/Home/MacOS/RepoContextMenu'
import Settings from '@/components/pages/Home/MacOS/Settings/Settings'
import Terminal from '@/components/pages/Home/MacOS/Terminal/Terminal'
import { useMacFiles } from '@/components/pages/Home/MacOS/useMacFiles'
import VSCode from '@/components/pages/Home/MacOS/VSCode/VSCode'
import type { WindowFrameProps } from '@/components/pages/Home/MacOS/Window'
import type { DockApp, MenuAction } from '@/data/giantSur'
import { ABOUT_PATH, CV_PATH, DESKTOP_PATH, MACOS, PROJECTS_PATH, type FinderViewMode, type FsNode } from '@/data/macos'
import { useLocale } from '@/lib/LocaleProvider'
import type { MacDisplay } from '@/lib/macDisplaySession'
import { contextMenuPosition, screenPoint } from '@/logic/macos/contextMenu/contextMenu'
import { findNode } from '@/logic/macos/fileTree/fileTree'
import { addRecent } from '@/logic/macos/recents/recents'
import { MACOS_SCREEN, type Point, type Size } from '@/logic/macos/windowBounds/windowBounds'
import {
  INITIAL_WINDOW_MANAGER_STATE,
  activeApp,
  runningApps,
  windowManagerReducer,
  type AppId,
  type MacWindow,
  type OpenWindowRequest,
} from '@/logic/macos/windowManager/windowManager'
import type { RepoSummary } from '@/types/repo'

type DesktopProps = {
  display: MacDisplay
  onDisplayChange: (display: MacDisplay) => void
  onRestart: () => void
  onShutdown: () => void
}

// Durée du rebond de l'icône avant l'ouverture (même valeur que le rebond de DockItem).
const LAUNCH_DELAY_MS = 1000
const INITIAL_CONTROL_CENTER: ControlCenterSettings = {
  isWifiOn: true,
  isBluetoothOn: true,
  isAirDropOn: false,
  isFocusOn: false,
  volume: 0.6,
}

const WINDOW_SIZES: Record<Exclude<AppId, 'preview'>, Size> = {
  finder: { width: 920, height: 436 },
  browser: { width: 1080, height: 690 },
  notes: { width: 860, height: 520 },
  terminal: { width: 660, height: 420 },
  mail: { width: 620, height: 470 },
  photos: { width: 878, height: 593 },
  settings: { width: 600, height: 300 },
  about: { width: 330, height: 420 },
  messages: { width: 760, height: 500 },
  music: { width: 900, height: 560 },
  calendar: { width: 439, height: 732 },
  vscode: { width: 1140, height: 720 },
}

type PreviewNode = Exclude<FsNode, { kind: 'folder' } | { kind: 'code' }>

const PREVIEW_SIZES: Record<PreviewNode['kind'], Size> = {
  text: { width: 600, height: 500 },
  image: { width: 840, height: 600 },
  pdf: { width: 700, height: 800 },
}
const CERTIFICATE_PREVIEW_SIZE: Size = { width: 640, height: 500 }

const previewSize = (node: PreviewNode) =>
  node.kind === 'pdf' && node.document.type === 'certificate' ? CERTIFICATE_PREVIEW_SIZE : PREVIEW_SIZES[node.kind]

const reducer = windowManagerReducer(MACOS_SCREEN)

// Bureau Giant Sur (barre de menus, icônes, Dock) qui pilote le gestionnaire de fenêtres et les apps.
export default function Desktop({ display, onDisplayChange, onRestart, onShutdown }: DesktopProps) {
  const { locale } = useLocale()
  const appNames = MACOS[locale].appNames
  const root = useMacFiles()
  const [state, dispatch] = useReducer(reducer, INITIAL_WINDOW_MANAGER_STATE)
  const [activeMenuId, setActiveMenuId] = useState('')
  const [recentPaths, setRecentPaths] = useState<string[][]>([])
  const [finderViewModes, setFinderViewModes] = useState<Record<string, FinderViewMode>>({})
  const [launchingApps, setLaunchingApps] = useState<ReadonlySet<DockApp>>(new Set())
  const [isControlCenterOpen, setIsControlCenterOpen] = useState(false)
  const [controlCenter, setControlCenter] = useState(INITIAL_CONTROL_CENTER)
  const launchTimers = useRef<number[]>([])
  const requestCount = useRef(0)
  const [repoMenu, setRepoMenu] = useState<{ repo: RepoSummary; position: Point } | null>(null)
  const isReducedMotion = useReducedMotion() ?? false

  useEffect(() => () => launchTimers.current.forEach((timer) => window.clearTimeout(timer)), [])

  const running = useMemo(() => runningApps(state), [state])
  const focusedId = state.focusedId
  const currentApp = activeApp(state)

  const closeMenu = useCallback(() => setActiveMenuId(''), [])
  const toggleMenu = useCallback((menuId: string) => {
    setActiveMenuId((currentMenuId) => (currentMenuId !== menuId ? menuId : ''))
  }, [])
  const hoverMenu = useCallback((menuId: string) => {
    setActiveMenuId((currentMenuId) => (currentMenuId && currentMenuId !== menuId ? menuId : currentMenuId))
  }, [])

  const open = (request: OpenWindowRequest) => dispatch({ type: 'open', request })

  // Une seule fenêtre par app, sauf le Finder qui en ouvre une de plus à chaque demande.
  const launch = (app: Exclude<AppId, 'preview'>, payload?: OpenWindowRequest['payload'], isFromDock = false) =>
    open({ app, size: WINDOW_SIZES[app], key: app === 'finder' ? undefined : app, payload, isFromDock })

  const nextRequestId = () => (requestCount.current += 1)

  const openInVSCode = (repo?: string, file?: string) =>
    launch('vscode', repo ? { repo, file, requestId: nextRequestId() } : undefined)

  const openInBrowser = (url: string) => launch('browser', { url, requestId: nextRequestId() })

  const openPath = (path: string[]) => {
    const node = findNode(root, path)
    if (!node) return
    if (node.kind === 'folder') return launch('finder', { path })
    setRecentPaths((current) => addRecent(current, path))
    if (node.kind === 'code') return openInVSCode(node.repo, node.filePath)
    open({ app: 'preview', size: previewSize(node), key: `preview:${path.join('/')}`, payload: { path } })
  }

  const openApp = (app: DockApp, isFromDock = false) =>
    launch(app, app === 'finder' ? { path: DESKTOP_PATH } : undefined, isFromDock)

  const setFinderViewMode = (windowId: string, viewMode: FinderViewMode) =>
    setFinderViewModes((current) => ({ ...current, [windowId]: viewMode }))

  const setFocusedFinderViewMode = (viewMode: FinderViewMode) => {
    const focused = state.windows.find((window) => window.id === focusedId)
    if (focused?.app === 'finder') setFinderViewMode(focused.id, viewMode)
  }

  // Clic dans le Dock : ramène la fenêtre la plus récente de l'app, sinon fait rebondir l'icône puis lance l'app.
  const activateFromDock = (app: DockApp) => {
    const windows = state.windows.filter((window) => window.app === app).sort((left, right) => right.z - left.z)
    const target = windows.find((window) => !window.isMinimized) ?? windows[0]
    if (target) return dispatch({ type: 'restore', id: target.id })
    if (isReducedMotion) return openApp(app, true)
    if (launchingApps.has(app)) return
    setLaunchingApps((current) => new Set(current).add(app))
    const timer = window.setTimeout(() => {
      setLaunchingApps((current) => {
        const next = new Set(current)
        next.delete(app)
        return next
      })
      openApp(app, true)
    }, LAUNCH_DELAY_MS)
    launchTimers.current.push(timer)
  }

  const closeControlCenter = useCallback(() => setIsControlCenterOpen(false), [])
  const closeRepoMenu = useCallback(() => setRepoMenu(null), [])

  const showRepoMenu = (repo: RepoSummary, event: MouseEvent<HTMLElement>) => {
    event.preventDefault()
    const screen = event.currentTarget.closest<HTMLElement>('[data-macos-root]')
    if (!screen) return
    const rect = screen.getBoundingClientRect()
    const scale = rect.width / screen.offsetWidth || 1
    const pointer = screenPoint({ x: event.clientX, y: event.clientY }, rect, scale)
    closeMenu()
    setRepoMenu({ repo, position: contextMenuPosition(pointer, REPO_CONTEXT_MENU_SIZE, MACOS_SCREEN) })
  }

  const handleMenu = (action: MenuAction) => {
    switch (action) {
      case 'about':
        return launch('about')
      case 'settings':
        return launch('settings')
      case 'quitApp':
        return dispatch({ type: 'quitApp', app: currentApp })
      case 'restart':
        return onRestart()
      case 'shutDown':
        return onShutdown()
      case 'logOut':
        return dispatch({ type: 'closeAll' })
      case 'hideApp':
        return dispatch({ type: 'hideApp', app: currentApp })
      case 'hideOthers':
        return dispatch({ type: 'hideOtherApps', app: currentApp })
      case 'showAll':
      case 'bringAllToFront':
        return dispatch({ type: 'showAll' })
      case 'newFinderWindow':
      case 'goDesktop':
        return launch('finder', { path: DESKTOP_PATH })
      case 'goDocuments':
        return launch('finder', { path: ['documents'] })
      case 'goDownloads':
        return launch('finder', { path: ['downloads'] })
      case 'goProjects':
        return launch('finder', { path: PROJECTS_PATH })
      case 'openTerminal':
        return launch('terminal')
      case 'newNote':
        return launch('notes')
      case 'portfolioHelp':
        return openPath(ABOUT_PATH)
      case 'closeWindow':
        return focusedId && dispatch({ type: 'close', id: focusedId })
      case 'minimize':
        return focusedId && dispatch({ type: 'minimize', id: focusedId })
      case 'zoom':
        return focusedId && dispatch({ type: 'toggleMaximize', id: focusedId })
      case 'viewAsIcons':
        return setFocusedFinderViewMode('icons')
      case 'viewAsList':
        return setFocusedFinderViewMode('list')
    }
  }

  const frameFor = (window: MacWindow): WindowFrameProps => ({
    window,
    isFocused: window.id === focusedId,
    onFocus: () => {
      closeMenu()
      dispatch({ type: 'focus', id: window.id })
    },
    onClose: () => dispatch({ type: 'close', id: window.id }),
    onMinimize: () => dispatch({ type: 'minimize', id: window.id }),
    onZoom: () => dispatch({ type: 'toggleMaximize', id: window.id }),
    onMove: (position) => dispatch({ type: 'move', id: window.id, position }),
  })

  const renderWindow = (window: MacWindow) => {
    const frame = frameFor(window)
    switch (window.app) {
      case 'finder':
        return (
          <Finder
            key={window.id}
            frame={frame}
            viewMode={finderViewModes[window.id] ?? 'icons'}
            recents={recentPaths}
            onViewModeChange={(viewMode) => setFinderViewMode(window.id, viewMode)}
            onOpenFile={openPath}
            onOpenApp={openApp}
            onRepoContextMenu={showRepoMenu}
          />
        )
      case 'browser':
        return <Browser key={window.id} frame={frame} />
      case 'notes':
        return <Notes key={window.id} frame={frame} />
      case 'terminal':
        return <Terminal key={window.id} frame={frame} />
      case 'mail':
        return <Mail key={window.id} frame={frame} />
      case 'photos':
        return <Photos key={window.id} frame={frame} />
      case 'settings':
        return <Settings key={window.id} frame={frame} isDarkMode={display.isDarkMode} />
      case 'preview':
        return <Preview key={window.id} frame={frame} />
      case 'messages':
        return <Messages key={window.id} frame={frame} />
      case 'music':
        return <Music key={window.id} frame={frame} />
      case 'calendar':
        return <Calendar key={window.id} frame={frame} />
      case 'vscode':
        return <VSCode key={window.id} frame={frame} onOpenInBrowser={openInBrowser} />
      case 'about':
        return <AboutThisMac key={window.id} frame={frame} onMoreInfo={() => openPath(CV_PATH)} />
    }
  }

  const clickDesktop = () => {
    closeMenu()
    dispatch({ type: 'focusDesktop' })
  }

  return (
    <>
      <DesktopIcons onClickDesktop={clickDesktop} onOpen={openPath} />
      {/* Calque isolé : le z-index croissant des fenêtres ne passe jamais devant la barre de menus ni le Dock. */}
      <div className="pointer-events-none absolute inset-0 isolate">
        <AnimatePresence>{state.windows.map(renderWindow)}</AnimatePresence>
      </div>
      <MenuBar
        activeMenuId={activeMenuId}
        onToggleMenu={toggleMenu}
        onHoverMenu={hoverMenu}
        onCloseMenu={closeMenu}
        activeAppName={appNames[currentApp]}
        onSelect={handleMenu}
        isControlCenterOpen={isControlCenterOpen}
        onToggleControlCenter={() => setIsControlCenterOpen((isOpen) => !isOpen)}
      />
      <Dock
        runningApps={running}
        launchingApps={launchingApps}
        onClickDock={closeMenu}
        onActivate={activateFromDock}
      />
      {repoMenu && (
        <RepoContextMenu
          repo={repoMenu.repo}
          position={repoMenu.position}
          onOpenInVSCode={() => openInVSCode(repoMenu.repo.name)}
          onOpenInBrowser={() => repoMenu.repo.homepageUrl && openInBrowser(repoMenu.repo.homepageUrl)}
          onOpenOnGitHub={() => window.open(repoMenu.repo.githubUrl, '_blank', 'noopener,noreferrer')}
          onClose={closeRepoMenu}
        />
      )}
      <AnimatePresence>
        {isControlCenterOpen && (
          <ControlCenter
            display={display}
            settings={controlCenter}
            onDisplayChange={onDisplayChange}
            onSettingsChange={setControlCenter}
            onClose={closeControlCenter}
          />
        )}
      </AnimatePresence>
    </>
  )
}
