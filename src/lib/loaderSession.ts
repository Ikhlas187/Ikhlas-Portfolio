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
