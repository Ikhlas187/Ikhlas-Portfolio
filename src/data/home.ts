import type { Localized } from '@/data/locale'

export const NOT_FOUND: Localized<{ code: string; title: string }> = {
  en: { code: '404', title: 'Page not found' },
  fr: { code: '404', title: 'Page introuvable' },
}
