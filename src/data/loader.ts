import type { Localized } from '@/data/locale'

// Pièces du loader : nom de marque, identiques dans toutes les langues.
export const LOADER = {
  rows: ['IKHLAS', 'AGBETI'],
  roles: ['DEVELOPER', 'DESIGNER', 'CREATIVE'],
}

export const LOADER_LABELS: Localized<{ label: string }> = {
  en: { label: 'loading' },
  fr: { label: 'chargement' },
}
