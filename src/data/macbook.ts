import type { Localized } from '@/data/locale'

export const MACBOOK: Localized<{
  sectionLabel: string
  openHint: string
  openLabel: string
  powerOn: string
  shutDown: string
}> = {
  en: {
    sectionLabel: 'MacBook Pro in 3D',
    openHint: 'Scroll to open',
    openLabel: 'Open the MacBook',
    powerOn: 'Turn on',
    shutDown: 'Shut down',
  },
  fr: {
    sectionLabel: 'MacBook Pro en 3D',
    openHint: 'Faites défiler pour ouvrir',
    openLabel: 'Ouvrir le MacBook',
    powerOn: 'Allumer',
    shutDown: 'Éteindre',
  },
}
