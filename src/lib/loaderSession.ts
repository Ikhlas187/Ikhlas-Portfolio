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
