import { createBrowserSession, type BrowserSession } from '@/logic/macos/browserSession/browserSession'

export type BrowserTab = { id: string; session: BrowserSession }
export type BrowserTabs = { tabs: BrowserTab[]; activeId: string }

// Chaque onglet a son propre historique et s'ouvre directement sur Google.
export function createBrowserTabs(id: string): BrowserTabs {
  return { tabs: [{ id, session: createBrowserSession() }], activeId: id }
}

export function activeTab(state: BrowserTabs): BrowserTab {
  return state.tabs.find((tab) => tab.id === state.activeId) ?? state.tabs[0]
}

export function openTab(state: BrowserTabs, id: string): BrowserTabs {
  return { tabs: [...state.tabs, { id, session: createBrowserSession() }], activeId: id }
}

export function selectTab(state: BrowserTabs, id: string): BrowserTabs {
  return state.tabs.some((tab) => tab.id === id) ? { ...state, activeId: id } : state
}

// null : c'était le dernier onglet, la fenêtre se ferme. Fermer l'onglet actif active le dernier restant.
export function closeTab(state: BrowserTabs, id: string): BrowserTabs | null {
  const rest = state.tabs.filter((tab) => tab.id !== id)
  if (rest.length === 0) return null
  const activeId = id === state.activeId ? rest[rest.length - 1].id : state.activeId
  return { tabs: rest, activeId }
}

export function updateActiveSession(state: BrowserTabs, update: (session: BrowserSession) => BrowserSession): BrowserTabs {
  const activeId = activeTab(state).id
  return {
    ...state,
    tabs: state.tabs.map((tab) => (tab.id === activeId ? { ...tab, session: update(tab.session) } : tab)),
  }
}
