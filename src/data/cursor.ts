import type { Localized } from '@/data/locale'
import type { CursorKind } from '@/logic/cursorKind/cursorKind'

// Libellé du curseur contextuel, choisi par l'attribut data-cursor de la zone survolée.
export const CURSOR_LABELS: Localized<Record<CursorKind, string>> = {
  en: { view: 'View', scroll: 'Scroll' },
  fr: { view: 'Voir', scroll: 'Défiler' },
}
