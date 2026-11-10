import type { Localized } from '@/data/locale'

type CertificationsPageText = {
  title: string
  back: string
  photoPending: string
}

// Page des certifications : photo du certificat, titre et année (liste dans data/cv.ts).
export const CERTIFICATIONS_PAGE: Localized<CertificationsPageText> = {
  en: { title: 'Certifications', back: 'Back', photoPending: 'Photo coming soon' },
  fr: { title: 'Certifications', back: 'Retour', photoPending: 'Photo à venir' },
}
