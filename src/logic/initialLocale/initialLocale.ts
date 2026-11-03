import { DEFAULT_LOCALE, LOCALES, type Locale } from '@/data/locale'

export function isLocale(value: unknown): value is Locale {
  return LOCALES.some((locale) => locale === value)
}

// Choix enregistré d'abord, puis langue du navigateur, sinon anglais.
export function resolveInitialLocale(storedLocale: string | null, browserLanguage: string | undefined): Locale {
  if (isLocale(storedLocale)) return storedLocale
  if (browserLanguage?.toLowerCase().startsWith('fr')) return 'fr'
  return DEFAULT_LOCALE
}
