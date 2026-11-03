import type { Locale } from '@/data/locale'

const LOCALE_KEY = 'locale'

// localStorage peut lever une erreur (navigation privée, stockage bloqué) : on fait comme si rien n'était enregistré.
export function readStoredLocale() {
  try {
    return window.localStorage.getItem(LOCALE_KEY)
  } catch {
    return null
  }
}

export function storeLocale(locale: Locale) {
  try {
    window.localStorage.setItem(LOCALE_KEY, locale)
  } catch {
    return
  }
}
