import type { Localized } from '@/data/locale'

export const MACBOOK: Localized<{
  sectionLabel: string
  openLabel: string
  powerOn: string
  shutDown: string
}> = {
  en: {
    sectionLabel: 'MacBook Pro in 3D',
    openLabel: 'Open the MacBook',
    powerOn: 'Turn on',
    shutDown: 'Shut down',
  },
  fr: {
    sectionLabel: 'MacBook Pro en 3D',
    openLabel: 'Ouvrir le MacBook',
    powerOn: 'Allumer',
    shutDown: 'Éteindre',
  },
}
