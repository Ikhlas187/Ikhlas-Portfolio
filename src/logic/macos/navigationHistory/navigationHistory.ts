export type NavigationHistory<T> = { entries: T[]; index: number }

export function createHistory<T>(initial: T): NavigationHistory<T> {
  return { entries: [initial], index: 0 }
}

export function currentEntry<T>(history: NavigationHistory<T>): T {
  return history.entries[history.index]
}

// Naviguer après un retour efface les pages « suivantes », comme dans un navigateur.
export function pushEntry<T>(history: NavigationHistory<T>, entry: T): NavigationHistory<T> {
  return { entries: [...history.entries.slice(0, history.index + 1), entry], index: history.index + 1 }
}

export function canGoBack<T>(history: NavigationHistory<T>) {
  return history.index > 0
}

export function canGoForward<T>(history: NavigationHistory<T>) {
  return history.index < history.entries.length - 1
}

export function goBack<T>(history: NavigationHistory<T>): NavigationHistory<T> {
  return canGoBack(history) ? { ...history, index: history.index - 1 } : history
}

export function goForward<T>(history: NavigationHistory<T>): NavigationHistory<T> {
  return canGoForward(history) ? { ...history, index: history.index + 1 } : history
}
