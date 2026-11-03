export const LOCALES = ['en', 'fr'] as const

export type Locale = (typeof LOCALES)[number]

export type Localized<T> = Record<Locale, T>

export const DEFAULT_LOCALE: Locale = 'en'

// Chaque langue s'affiche dans sa propre langue, quelle que soit la locale courante.
export const LOCALE_NAMES: Record<Locale, string> = {
  en: 'English',
  fr: 'Français',
}

export const LANGUAGE_SELECT: Localized<{ label: string }> = {
  en: { label: 'Language' },
  fr: { label: 'Langue' },
}
