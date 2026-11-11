// Page révélée dans cet onglet : le loader commence sa sortie une seule fois par chargement de l'app.
let isPageRevealed = false

export function isLoaderRevealed() {
  return isPageRevealed
}

export function markLoaderRevealed() {
  isPageRevealed = true
}

// Voile du loader entièrement effacé : la page est visible, le hero peut lancer son entrée.
let isPageVisible = false
const visibleListeners = new Set<() => void>()

export function isLoaderGone() {
  return isPageVisible
}

export function markLoaderGone() {
  if (isPageVisible) return
  isPageVisible = true
  visibleListeners.forEach((listener) => listener())
}

export function subscribeLoaderGone(listener: () => void) {
  visibleListeners.add(listener)
  return () => {
    visibleListeners.delete(listener)
  }
}
