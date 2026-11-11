import type { Localized } from '@/data/locale'

export type NavLink = { label: string; href: string }

export const SITE = {
  name: 'Ikhlas Olamidé',
  url: 'https://ikhlas.studio',
  email: 'olaagb40@gmail.com',
  // Lien de réservation Cal.com (utilisateur/type d'événement), rendez-vous de 30 min avec Google Meet.
  calLink: 'ikhlas-agbeti-znpiai/30min',
  socials: {
    github: 'https://github.com/Ikhlas187',
    linkedin: 'https://www.linkedin.com/in/ikhlas-agbeti-28b866349/',
  },
}

export const NAV_LINKS: Localized<NavLink[]> = {
  en: [
    { label: 'Projects', href: '#projects' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ],
  fr: [
    { label: 'Projets', href: '#projects' },
    { label: 'À propos', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ],
}
