import { GOOGLE_HOME, type BrowserPage } from '@/logic/macos/browserAddress/browserAddress'
import {
  createHistory,
  currentEntry,
  goBack,
  goForward,
  pushEntry,
  type NavigationHistory,
} from '@/logic/macos/navigationHistory/navigationHistory'

// Historique d'un onglet de Safari (les onglets eux-mêmes : browserTabs).
export type BrowserSession = { history: NavigationHistory<BrowserPage>; reloadCount: number }

export function createBrowserSession(): BrowserSession {
  return { history: createHistory(GOOGLE_HOME), reloadCount: 0 }
}

export function currentPage(session: BrowserSession): BrowserPage {
  return currentEntry(session.history)
}

export function navigateTo(session: BrowserSession, page: BrowserPage): BrowserSession {
  return { ...session, history: pushEntry(session.history, page) }
}

export function goBackInSession(session: BrowserSession): BrowserSession {
  return { ...session, history: goBack(session.history) }
}

export function goForwardInSession(session: BrowserSession): BrowserSession {
  return { ...session, history: goForward(session.history) }
}

export function reloadSession(session: BrowserSession): BrowserSession {
  return { ...session, reloadCount: session.reloadCount + 1 }
}
