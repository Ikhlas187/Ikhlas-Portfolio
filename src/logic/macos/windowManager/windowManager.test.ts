import { describe, expect, it } from 'vitest'
import {
  INITIAL_WINDOW_MANAGER_STATE,
  activeApp,
  closeWindow,
  focusWindow,
  hideApp,
  hideOtherApps,
  minimizeWindow,
  moveWindow,
  openWindow,
  quitApp,
  restoreWindow,
  runningApps,
  showAllWindows,
  toggleMaximize,
  type WindowManagerState,
} from '@/logic/macos/windowManager/windowManager'

const screen = { width: 1000, height: 800, menuBarHeight: 30 }
const notesRequest = { app: 'notes' as const, size: { width: 400, height: 300 }, key: 'notes' }
const finderRequest = { app: 'finder' as const, size: { width: 500, height: 300 } }

function withNotesAndFinder(): WindowManagerState {
  return openWindow(openWindow(INITIAL_WINDOW_MANAGER_STATE, notesRequest, screen), finderRequest, screen)
}

describe('openWindow', () => {
  it('retient qu’une fenêtre a été lancée depuis le Dock', () => {
    const dockRequest = { ...notesRequest, isFromDock: true }

    const desktopWithNotes = openWindow(INITIAL_WINDOW_MANAGER_STATE, dockRequest, screen)

    expect(desktopWithNotes.windows[0].isOpenedFromDock).toBe(true)
  })

  it('ne marque pas comme lancée du Dock une fenêtre ouverte ailleurs', () => {
    const emptyDesktop = INITIAL_WINDOW_MANAGER_STATE

    const desktopWithFinder = openWindow(emptyDesktop, finderRequest, screen)

    expect(desktopWithFinder.windows[0].isOpenedFromDock).toBe(false)
  })

  it('ouvre une fenêtre au premier plan et lui donne le focus', () => {
    const emptyDesktop = INITIAL_WINDOW_MANAGER_STATE

    const desktopWithNotes = openWindow(emptyDesktop, notesRequest, screen)

    expect(desktopWithNotes.windows).toHaveLength(1)
    expect(desktopWithNotes.focusedId).toBe('notes-1')
    expect(desktopWithNotes.windows[0].z).toBe(desktopWithNotes.topZ)
  })

  it('ramène la fenêtre existante quand la clé est déjà ouverte', () => {
    const desktop = minimizeWindow(withNotesAndFinder(), 'notes-1')

    const desktopAfterReopen = openWindow(desktop, notesRequest, screen)

    expect(desktopAfterReopen.windows).toHaveLength(2)
    expect(desktopAfterReopen.focusedId).toBe('notes-1')
    expect(desktopAfterReopen.windows.find((window) => window.id === 'notes-1')?.isMinimized).toBe(false)
  })

  it('ouvre une nouvelle fenêtre à chaque demande sans clé', () => {
    const desktop = withNotesAndFinder()

    expect(openWindow(desktop, finderRequest, screen).windows).toHaveLength(3)
  })
})

describe('focusWindow', () => {
  it('passe la fenêtre cliquée au-dessus des autres', () => {
    const desktop = withNotesAndFinder()

    const desktopWithNotesOnTop = focusWindow(desktop, 'notes-1')
    const notes = desktopWithNotesOnTop.windows.find((window) => window.id === 'notes-1')
    const finder = desktopWithNotesOnTop.windows.find((window) => window.id === 'finder-2')

    expect(desktopWithNotesOnTop.focusedId).toBe('notes-1')
    expect(notes!.z).toBeGreaterThan(finder!.z)
  })

  it('ne touche pas à l’état d’origine', () => {
    const desktop = withNotesAndFinder()
    const desktopCopy = structuredClone(desktop)

    focusWindow(desktop, 'notes-1')

    expect(desktop).toEqual(desktopCopy)
  })
})

describe('closeWindow', () => {
  it('donne le focus à la fenêtre visible la plus haute restante', () => {
    const desktop = withNotesAndFinder()

    expect(closeWindow(desktop, 'finder-2').focusedId).toBe('notes-1')
  })

  it('laisse le bureau sans focus quand la dernière fenêtre se ferme', () => {
    const desktopWithNotes = openWindow(INITIAL_WINDOW_MANAGER_STATE, notesRequest, screen)

    expect(closeWindow(desktopWithNotes, 'notes-1').focusedId).toBeNull()
  })
})

describe('minimizeWindow et restoreWindow', () => {
  it('retire le focus de la fenêtre réduite', () => {
    const desktop = withNotesAndFinder()

    const desktopWithFinderMinimized = minimizeWindow(desktop, 'finder-2')

    expect(desktopWithFinderMinimized.focusedId).toBe('notes-1')
  })

  it('remet au premier plan la fenêtre restaurée depuis le Dock', () => {
    const desktop = minimizeWindow(withNotesAndFinder(), 'finder-2')

    const desktopWithFinderRestored = restoreWindow(desktop, 'finder-2')

    expect(desktopWithFinderRestored.focusedId).toBe('finder-2')
    expect(desktopWithFinderRestored.windows.find((window) => window.id === 'finder-2')?.isMinimized).toBe(false)
  })
})

describe('toggleMaximize', () => {
  it('passe en plein écran puis revient à la position d’avant', () => {
    const desktop = withNotesAndFinder()
    const rectBeforeZoom = desktop.windows[0].rect

    const zoomedDesktop = toggleMaximize(desktop, 'notes-1', screen)
    const unzoomedDesktop = toggleMaximize(zoomedDesktop, 'notes-1', screen)

    expect(zoomedDesktop.windows[0].rect).toEqual({ x: 0, y: 30, width: 1000, height: 770 })
    expect(unzoomedDesktop.windows[0].rect).toEqual(rectBeforeZoom)
  })
})

describe('moveWindow', () => {
  it('déplace la fenêtre en la gardant dans l’écran', () => {
    const desktop = withNotesAndFinder()

    const desktopAfterDrag = moveWindow(desktop, 'notes-1', { x: 5000, y: -200 }, screen)

    expect(desktopAfterDrag.windows[0].rect).toMatchObject({ x: 600, y: 30 })
  })

  it('ignore le glissement d’une fenêtre en plein écran', () => {
    const zoomedDesktop = toggleMaximize(withNotesAndFinder(), 'notes-1', screen)

    const desktopAfterDrag = moveWindow(zoomedDesktop, 'notes-1', { x: 200, y: 200 }, screen)

    expect(desktopAfterDrag.windows[0].rect).toEqual(zoomedDesktop.windows[0].rect)
  })
})

describe('activeApp et runningApps', () => {
  it('affiche Finder quand aucune fenêtre n’a le focus', () => {
    const emptyDesktop = INITIAL_WINDOW_MANAGER_STATE

    expect(activeApp(emptyDesktop)).toBe('finder')
  })

  it('suit l’app de la fenêtre au premier plan', () => {
    const desktop = focusWindow(withNotesAndFinder(), 'notes-1')

    expect(activeApp(desktop)).toBe('notes')
  })

  it('compte une app réduite comme ouverte', () => {
    const desktop = minimizeWindow(withNotesAndFinder(), 'notes-1')

    expect(runningApps(desktop)).toEqual(new Set(['notes', 'finder']))
  })
})

describe('quitApp', () => {
  it('ferme toutes les fenêtres de l’app et donne le focus à la suivante', () => {
    const desktop = withNotesAndFinder()

    const desktopWithoutFinder = quitApp(desktop, 'finder')

    expect(desktopWithoutFinder.windows.map((window) => window.id)).toEqual(['notes-1'])
    expect(desktopWithoutFinder.focusedId).toBe('notes-1')
  })
})

describe('hideApp et hideOtherApps', () => {
  it('réduit les fenêtres de l’app et passe le focus à une fenêtre visible', () => {
    const desktop = withNotesAndFinder()

    const desktopWithFinderHidden = hideApp(desktop, 'finder')

    expect(desktopWithFinderHidden.windows.find((window) => window.app === 'finder')?.isMinimized).toBe(true)
    expect(desktopWithFinderHidden.focusedId).toBe('notes-1')
  })

  it('réduit toutes les autres apps et garde le focus', () => {
    const desktop = withNotesAndFinder()

    const desktopWithOthersHidden = hideOtherApps(desktop, 'finder')

    expect(desktopWithOthersHidden.windows.find((window) => window.app === 'notes')?.isMinimized).toBe(true)
    expect(desktopWithOthersHidden.focusedId).toBe('finder-2')
  })
})

describe('showAllWindows', () => {
  it('ramène toutes les fenêtres réduites', () => {
    const desktopWithNotesHidden = hideApp(withNotesAndFinder(), 'notes')

    const desktopWithAllShown = showAllWindows(desktopWithNotesHidden)

    expect(desktopWithAllShown.windows.every((window) => !window.isMinimized)).toBe(true)
  })

  it('ne modifie pas l’état reçu', () => {
    const desktopWithNotesHidden = hideApp(withNotesAndFinder(), 'notes')
    const snapshot = structuredClone(desktopWithNotesHidden)

    showAllWindows(desktopWithNotesHidden)

    expect(desktopWithNotesHidden).toEqual(snapshot)
  })
})
