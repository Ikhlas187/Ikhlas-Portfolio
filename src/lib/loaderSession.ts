const SEEN_KEY = 'loader.seen'

// sessionStorage peut lever une erreur (navigation privée, stockage bloqué) : on retombe sur « pas vu ».
export function hasSeenLoader() {
  try {
    return window.sessionStorage.getItem(SEEN_KEY) === '1'
  } catch {
    return false
  }
}

export function markLoaderSeen() {
  try {
    window.sessionStorage.setItem(SEEN_KEY, '1')
  } catch {
    return
  }
}

// Page révélée dans cet onglet : le loader commence sa sortie une seule fois par chargement de l'app.
let isPageRevealed = false
const revealListeners = new Set<() => void>()

export function isLoaderRevealed() {
  return isPageRevealed
}

export function markLoaderRevealed() {
  if (isPageRevealed) return
  isPageRevealed = true
  revealListeners.forEach((listener) => listener())
}

export function subscribeLoaderReveal(listener: () => void) {
  revealListeners.add(listener)
  return () => {
    revealListeners.delete(listener)
  }
}
