import type { Localized } from '@/data/locale'

export const CURSOR_KINDS = ['view', 'scroll'] as const

export type CursorKind = (typeof CURSOR_KINDS)[number]

// Libellé du curseur contextuel, choisi par l'attribut data-cursor de la zone survolée.
export const CURSOR_LABELS: Localized<Record<CursorKind, string>> = {
  en: { view: 'View', scroll: 'Scroll' },
  fr: { view: 'Voir', scroll: 'Défiler' },
}
