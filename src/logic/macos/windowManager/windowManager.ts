import type { AppName } from '@/data/macos'
import {
  cascadeRect,
  clampWindowPosition,
  maximizedRect,
  type Point,
  type Rect,
  type Screen,
  type Size,
} from '@/logic/macos/windowBounds/windowBounds'

export type AppId = AppName

export type WindowPayload = { path?: string[] }

export type MacWindow = {
  id: string
  app: AppId
  // Deux demandes d'ouverture avec la même clé ramènent la fenêtre existante au lieu d'en créer une.
  key: string | null
  rect: Rect
  restoreRect: Rect | null
  z: number
  isMinimized: boolean
  isMaximized: boolean
  // Lancée depuis le Dock : la fenêtre sort de son icône au lieu d'apparaître sur place.
  isOpenedFromDock: boolean
  payload: WindowPayload
}

export type WindowManagerState = {
  windows: MacWindow[]
  focusedId: string | null
  topZ: number
  openedCount: number
}

export type OpenWindowRequest = {
  app: AppId
  size: Size
  key?: string
  payload?: WindowPayload
  isFromDock?: boolean
}

export type WindowAction =
  | { type: 'open'; request: OpenWindowRequest }
  | { type: 'focus'; id: string }
  | { type: 'focusDesktop' }
  | { type: 'close'; id: string }
  | { type: 'minimize'; id: string }
  | { type: 'restore'; id: string }
  | { type: 'toggleMaximize'; id: string }
  | { type: 'move'; id: string; position: Point }
  | { type: 'navigate'; id: string; payload: WindowPayload }
  | { type: 'closeAll' }
  | { type: 'quitApp'; app: AppId }
  | { type: 'hideApp'; app: AppId }
  | { type: 'hideOtherApps'; app: AppId }
  | { type: 'showAll' }

export const INITIAL_WINDOW_MANAGER_STATE: WindowManagerState = {
  windows: [],
  focusedId: null,
  topZ: 0,
  openedCount: 0,
}

function updateWindow(state: WindowManagerState, id: string, update: (window: MacWindow) => MacWindow) {
  return { ...state, windows: state.windows.map((window) => (window.id === id ? update(window) : window)) }
}

function topVisibleWindowId(windows: MacWindow[]) {
  const visible = windows.filter((window) => !window.isMinimized)
  if (visible.length === 0) return null
  return visible.reduce((top, window) => (window.z > top.z ? window : top)).id
}

export function focusWindow(state: WindowManagerState, id: string): WindowManagerState {
  const target = state.windows.find((window) => window.id === id)
  if (!target) return state
  if (state.focusedId === id && target.z === state.topZ) return state
  const topZ = state.topZ + 1
  return { ...updateWindow(state, id, (window) => ({ ...window, z: topZ })), focusedId: id, topZ }
}

export function openWindow(state: WindowManagerState, request: OpenWindowRequest, screen: Screen): WindowManagerState {
  const existing = request.key ? state.windows.find((window) => window.key === request.key) : undefined
  if (existing) return restoreWindow(state, existing.id)

  const openedCount = state.openedCount + 1
  const topZ = state.topZ + 1
  const window: MacWindow = {
    id: `${request.app}-${openedCount}`,
    app: request.app,
    key: request.key ?? null,
    rect: cascadeRect(request.size, state.openedCount, screen),
    restoreRect: null,
    z: topZ,
    isMinimized: false,
    isMaximized: false,
    isOpenedFromDock: request.isFromDock ?? false,
    payload: request.payload ?? {},
  }
  return { windows: [...state.windows, window], focusedId: window.id, topZ, openedCount }
}

export function closeWindow(state: WindowManagerState, id: string): WindowManagerState {
  const windows = state.windows.filter((window) => window.id !== id)
  const focusedId = state.focusedId === id ? topVisibleWindowId(windows) : state.focusedId
  return { ...state, windows, focusedId }
}

export function minimizeWindow(state: WindowManagerState, id: string): WindowManagerState {
  const minimized = updateWindow(state, id, (window) => ({ ...window, isMinimized: true }))
  const focusedId = state.focusedId === id ? topVisibleWindowId(minimized.windows) : state.focusedId
  return { ...minimized, focusedId }
}

export function restoreWindow(state: WindowManagerState, id: string): WindowManagerState {
  return focusWindow(
    updateWindow(state, id, (window) => ({ ...window, isMinimized: false })),
    id,
  )
}

export function toggleMaximize(state: WindowManagerState, id: string, screen: Screen): WindowManagerState {
  const toggled = updateWindow(state, id, (window) =>
    window.isMaximized && window.restoreRect
      ? { ...window, isMaximized: false, rect: window.restoreRect, restoreRect: null }
      : { ...window, isMaximized: true, rect: maximizedRect(screen), restoreRect: window.rect },
  )
  return focusWindow(toggled, id)
}

export function moveWindow(state: WindowManagerState, id: string, position: Point, screen: Screen): WindowManagerState {
  return updateWindow(state, id, (window) =>
    window.isMaximized
      ? window
      : { ...window, rect: { ...window.rect, ...clampWindowPosition(position, window.rect, screen) } },
  )
}

export function quitApp(state: WindowManagerState, app: AppId): WindowManagerState {
  const windows = state.windows.filter((window) => window.app !== app)
  const isFocusedClosed = !windows.some((window) => window.id === state.focusedId)
  return { ...state, windows, focusedId: isFocusedClosed ? topVisibleWindowId(windows) : state.focusedId }
}

function minimizeWhere(state: WindowManagerState, shouldMinimize: (window: MacWindow) => boolean) {
  const windows = state.windows.map((window) => (shouldMinimize(window) ? { ...window, isMinimized: true } : window))
  const focused = windows.find((window) => window.id === state.focusedId)
  return { ...state, windows, focusedId: focused && !focused.isMinimized ? focused.id : topVisibleWindowId(windows) }
}

export function hideApp(state: WindowManagerState, app: AppId): WindowManagerState {
  return minimizeWhere(state, (window) => window.app === app)
}

export function hideOtherApps(state: WindowManagerState, app: AppId): WindowManagerState {
  return minimizeWhere(state, (window) => window.app !== app)
}

// Ramène toutes les fenêtres réduites sans changer l'ordre de superposition.
export function showAllWindows(state: WindowManagerState): WindowManagerState {
  const windows = state.windows.map((window) => (window.isMinimized ? { ...window, isMinimized: false } : window))
  return { ...state, windows, focusedId: state.focusedId ?? topVisibleWindowId(windows) }
}

export function windowManagerReducer(screen: Screen) {
  return (state: WindowManagerState, action: WindowAction): WindowManagerState => {
    switch (action.type) {
      case 'open':
        return openWindow(state, action.request, screen)
      case 'focus':
        return focusWindow(state, action.id)
      case 'focusDesktop':
        return { ...state, focusedId: null }
      case 'close':
        return closeWindow(state, action.id)
      case 'minimize':
        return minimizeWindow(state, action.id)
      case 'restore':
        return restoreWindow(state, action.id)
      case 'toggleMaximize':
        return toggleMaximize(state, action.id, screen)
      case 'move':
        return moveWindow(state, action.id, action.position, screen)
      case 'navigate':
        return updateWindow(state, action.id, (window) => ({ ...window, payload: action.payload }))
      case 'closeAll':
        return INITIAL_WINDOW_MANAGER_STATE
      case 'quitApp':
        return quitApp(state, action.app)
      case 'hideApp':
        return hideApp(state, action.app)
      case 'hideOtherApps':
        return hideOtherApps(state, action.app)
      case 'showAll':
        return showAllWindows(state)
    }
  }
}

export function activeApp(state: WindowManagerState): AppId {
  return state.windows.find((window) => window.id === state.focusedId)?.app ?? 'finder'
}

export function runningApps(state: WindowManagerState): Set<AppId> {
  return new Set(state.windows.map((window) => window.app))
}
