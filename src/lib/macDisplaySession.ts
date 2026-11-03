export type MacDisplay = { brightness: number; isDarkMode: boolean }

const DISPLAY_KEY = 'macos.display'
export const DEFAULT_MAC_DISPLAY: MacDisplay = { brightness: 1, isDarkMode: false }

// Luminosité et mode sombre du faux macOS, gardés pour la session. Stockage bloqué ou valeur abîmée : réglages par défaut.
export function readMacDisplay(): MacDisplay {
  try {
    const stored = JSON.parse(window.sessionStorage.getItem(DISPLAY_KEY) ?? 'null') as Partial<MacDisplay> | null
    if (!stored) return DEFAULT_MAC_DISPLAY
    return {
      brightness: typeof stored.brightness === 'number' ? stored.brightness : DEFAULT_MAC_DISPLAY.brightness,
      isDarkMode: typeof stored.isDarkMode === 'boolean' ? stored.isDarkMode : DEFAULT_MAC_DISPLAY.isDarkMode,
    }
  } catch {
    return DEFAULT_MAC_DISPLAY
  }
}

export function saveMacDisplay(display: MacDisplay) {
  try {
    window.sessionStorage.setItem(DISPLAY_KEY, JSON.stringify(display))
  } catch {
    return
  }
}
